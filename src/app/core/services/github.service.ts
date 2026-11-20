import { Injectable, signal } from '@angular/core';

export interface GithubRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
}

export interface GithubProfile {
  publicRepos: number;
  followers: number;
  createdAt: string;
}

export interface LanguageShare {
  name: string;
  repos: number;
  percent: number;
}

export interface ActivityDay {
  date: string;
  count: number;
  future: boolean;
}

export interface ActivityFeedItem {
  text: string;
  at: string;
}

export interface GithubActivityData {
  days: ActivityDay[];
  weeks: { start: string; label: string }[];
  commits: number;
  feed: ActivityFeedItem[];
}

export interface RateLimit {
  remaining: number;
  limit: number;
  /** Epoch milliseconds when the window resets. */
  resetAt: number;
}

export type GithubState =
  | { status: 'idle' | 'loading' | 'error' }
  | {
      status: 'ready';
      profile: GithubProfile;
      repos: GithubRepo[];
      stars: number;
      languages: LanguageShare[];
      /** Absent when the events endpoint is unavailable. */
      activity?: GithubActivityData;
    };

const WEEKS = 12;
const DAY_MS = 86_400_000;

/** Share of owned repositories per primary language, largest first. */
export function buildLanguages(repos: { language: string | null }[]): LanguageShare[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, n]) => ({ name, repos: n, percent: Math.round((n / total) * 100) }));
}

interface RawEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { size?: number; action?: string; ref_type?: string; ref?: string | null };
}

export function describeEvent(e: RawEvent): string {
  const repo = e.repo.name.split('/').pop() ?? e.repo.name;
  const p = e.payload ?? {};
  switch (e.type) {
    case 'PushEvent': {
      const n = p.size ?? 1;
      return `Pushed ${n} commit${n === 1 ? '' : 's'} to ${repo}`;
    }
    case 'CreateEvent':
      return `Created ${p.ref_type ?? 'repository'}${p.ref ? ` ${p.ref}` : ''} in ${repo}`;
    case 'PullRequestEvent':
      return `${p.action ?? 'Updated'} a pull request in ${repo}`;
    case 'IssuesEvent':
      return `${p.action ?? 'Updated'} an issue in ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    default:
      return `${e.type.replace(/Event$/, '')} in ${repo}`;
  }
}

/** Builds a 12-week, Sunday-first grid of commits per day (UTC) from public push events. */
/** `commitDates` are YYYY-MM-DD strings, one per commit, taken from each commit's author date. */
export function buildActivity(
  events: RawEvent[],
  commitDates: string[],
  now = new Date(),
): GithubActivityData {
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const weekStart = todayUtc - new Date(todayUtc).getUTCDay() * DAY_MS;
  const start = weekStart - (WEEKS - 1) * 7 * DAY_MS;

  const perDay = new Map<string, number>();
  for (const day of commitDates) perDay.set(day, (perDay.get(day) ?? 0) + 1);

  const days: ActivityDay[] = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const t = start + i * DAY_MS;
    const date = new Date(t).toISOString().slice(0, 10);
    return { date, count: perDay.get(date) ?? 0, future: t > todayUtc };
  });

  const weeks = Array.from({ length: WEEKS }, (_, w) => {
    const first = new Date(days[w * 7].date + 'T00:00:00Z');
    const prev = w > 0 ? new Date(days[(w - 1) * 7].date + 'T00:00:00Z') : null;
    const newMonth = !prev || prev.getUTCMonth() !== first.getUTCMonth();
    return {
      start: days[w * 7].date,
      label: newMonth ? first.toLocaleString('en', { month: 'short', timeZone: 'UTC' }) : '',
    };
  });

  return {
    days,
    weeks,
    commits: days.reduce((sum, d) => sum + d.count, 0),
    feed: events.slice(0, 5).map((e) => ({ text: describeEvent(e), at: e.created_at })),
  };
}

const CACHE_TTL_MS = 10 * 60 * 1000;

/** Reads public GitHub data. Unauthenticated calls are rate limited, so results are cached briefly. */
@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly current = signal<GithubState>({ status: 'idle' });
  readonly state = this.current.asReadonly();

  private readonly refreshingFlag = signal(false);
  private readonly refreshFailedFlag = signal(false);
  private readonly updated = signal<number | null>(null);
  private readonly limit = signal<RateLimit | null>(null);
  readonly refreshing = this.refreshingFlag.asReadonly();
  readonly refreshFailed = this.refreshFailedFlag.asReadonly();
  readonly updatedAt = this.updated.asReadonly();
  /** Most recent quota GitHub reported, so visitors (and I) can see how many calls remain. */
  readonly rateLimit = this.limit.asReadonly();

  /** Bypasses the cache. Keeps showing the current data while loading, and keeps it if the refresh fails. */
  async refresh(username: string): Promise<void> {
    if (this.refreshingFlag()) return;
    this.refreshingFlag.set(true);
    this.refreshFailedFlag.set(false);
    try {
      await this.load(username, true);
    } finally {
      this.refreshingFlag.set(false);
    }
  }

  async load(username: string, force = false): Promise<void> {
    if (!force) {
      const cached = this.readCache(username);
      if (cached) {
        this.current.set(cached.state);
        this.updated.set(cached.at);
        return;
      }
    }

    const previous = this.current();
    if (!force || previous.status !== 'ready') this.current.set({ status: 'loading' });
    let lowest: RateLimit | null = null;
    const get = async (url: string): Promise<Response> => {
      const res = await fetch(url);
      const remaining = Number(res.headers?.get('x-ratelimit-remaining'));
      if (res.headers?.get('x-ratelimit-remaining') != null && !Number.isNaN(remaining)) {
        if (!lowest || remaining < lowest.remaining) {
          lowest = {
            remaining,
            limit: Number(res.headers.get('x-ratelimit-limit')) || 60,
            resetAt: Number(res.headers.get('x-ratelimit-reset')) * 1000,
          };
        }
        this.limit.set(lowest);
      }
      return res;
    };
    try {
      const base = `https://api.github.com/users/${encodeURIComponent(username)}`;
      const [userRes, reposRes, eventsRes] = await Promise.all([
        get(base),
        get(`${base}/repos?per_page=100&sort=pushed`),
        get(`${base}/events/public?per_page=100`).catch(() => null),
      ]);
      if (!userRes.ok || !reposRes.ok) {
        throw new Error(`GitHub responded ${userRes.status}/${reposRes.status}`);
      }
      const user = (await userRes.json()) as Record<string, number | string>;
      const raw = (await reposRes.json()) as Record<string, unknown>[];

      const owned = raw.filter((r) => !r['fork']);
      const repos: GithubRepo[] = owned.slice(0, 6).map((r) => ({
        name: String(r['name']),
        description: (r['description'] as string | null) ?? null,
        url: String(r['html_url']),
        language: (r['language'] as string | null) ?? null,
        stars: Number(r['stargazers_count'] ?? 0),
        forks: Number(r['forks_count'] ?? 0),
        pushedAt: String(r['pushed_at']),
      }));
      const stars = owned.reduce((sum, r) => sum + Number(r['stargazers_count'] ?? 0), 0);

      let activity: GithubActivityData | undefined;
      try {
        const events = eventsRes?.ok ? ((await eventsRes.json()) as RawEvent[]) : [];
        const commitDates = await this.fetchCommitDates(username, owned, get);
        if (commitDates) activity = buildActivity(events, commitDates);
      } catch {
        // Activity is optional; the rest of the section still renders.
      }

      const state: GithubState = {
        status: 'ready',
        profile: {
          publicRepos: Number(user['public_repos'] ?? 0),
          followers: Number(user['followers'] ?? 0),
          createdAt: String(user['created_at'] ?? ''),
        },
        repos,
        stars,
        languages: buildLanguages(
          owned.map((r) => ({ language: (r['language'] as string | null) ?? null })),
        ),
        activity,
      };
      this.current.set(state);
      this.updated.set(Date.now());
      this.writeCache(username, state);
    } catch {
      if (force && previous.status === 'ready') {
        this.current.set(previous);
        this.refreshFailedFlag.set(true);
      } else {
        this.current.set({ status: 'error' });
      }
    }
  }

  /** Commit dates in the heatmap window from the most recently pushed own repos, or null if none could be read. */
  private async fetchCommitDates(
    username: string,
    owned: Record<string, unknown>[],
    get: (url: string) => Promise<Response>,
  ): Promise<string[] | null> {
    const since = new Date(Date.now() - (WEEKS * 7 + 7) * DAY_MS).toISOString();
    const recent = owned.filter((r) => String(r['pushed_at']) >= since).slice(0, 8);
    const results = await Promise.all(
      recent.map(async (r) => {
        try {
          const dates: string[] = [];
          for (let page = 1; page <= 3; page++) {
            const res = await get(
              `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(String(r['name']))}/commits?author=${encodeURIComponent(username)}&since=${since}&per_page=100&page=${page}`,
            );
            if (!res.ok) return page === 1 ? null : dates;
            const list = (await res.json()) as { commit?: { author?: { date?: string } } }[];
            dates.push(...list.flatMap((c) => c.commit?.author?.date?.slice(0, 10) ?? []));
            if (list.length < 100) break;
          }
          return dates;
        } catch {
          return null;
        }
      }),
    );
    if (recent.length && results.every((r) => r === null)) return null;
    return results.flatMap((r) => r ?? []);
  }

  private readCache(username: string): { at: number; state: GithubState } | null {
    try {
      const raw = sessionStorage.getItem(`portfolio.github.v3.${username}`);
      if (!raw) return null;
      const { at, state } = JSON.parse(raw) as { at: number; state: GithubState };
      return Date.now() - at < CACHE_TTL_MS ? { at, state } : null;
    } catch {
      return null;
    }
  }

  private writeCache(username: string, state: GithubState): void {
    try {
      sessionStorage.setItem(
        `portfolio.github.v3.${username}`,
        JSON.stringify({ at: Date.now(), state }),
      );
    } catch {
      // Caching is optional.
    }
  }
}
