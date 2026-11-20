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

  async load(username: string): Promise<void> {
    const cached = this.readCache(username);
    if (cached) {
      this.current.set(cached);
      return;
    }

    this.current.set({ status: 'loading' });
    try {
      const base = `https://api.github.com/users/${encodeURIComponent(username)}`;
      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(base),
        fetch(`${base}/repos?per_page=100&sort=pushed`),
        fetch(`${base}/events/public?per_page=100`).catch(() => null),
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
        const commitDates = await this.fetchCommitDates(username, owned);
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
      this.writeCache(username, state);
    } catch {
      this.current.set({ status: 'error' });
    }
  }

  /** Commit dates in the heatmap window from the most recently pushed own repos, or null if none could be read. */
  private async fetchCommitDates(
    username: string,
    owned: Record<string, unknown>[],
  ): Promise<string[] | null> {
    const since = new Date(Date.now() - (WEEKS * 7 + 7) * DAY_MS).toISOString();
    const recent = owned.filter((r) => String(r['pushed_at']) >= since).slice(0, 8);
    const results = await Promise.all(
      recent.map(async (r) => {
        try {
          const dates: string[] = [];
          for (let page = 1; page <= 3; page++) {
            const res = await fetch(
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

  private readCache(username: string): GithubState | null {
    try {
      const raw = sessionStorage.getItem(`portfolio.github.v3.${username}`);
      if (!raw) return null;
      const { at, state } = JSON.parse(raw) as { at: number; state: GithubState };
      return Date.now() - at < CACHE_TTL_MS ? state : null;
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
