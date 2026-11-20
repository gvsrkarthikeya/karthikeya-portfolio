import { TestBed } from '@angular/core/testing';
import { GithubService } from './github.service';

describe('GithubService', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  function ok(body: unknown) {
    return { ok: true, status: 200, json: async () => body };
  }

  it('maps repos, drops forks and totals stars', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve(
          url.includes('/repos')
            ? ok([
                {
                  name: 'a',
                  html_url: 'u/a',
                  stargazers_count: 2,
                  forks_count: 1,
                  pushed_at: '2026-01-01',
                  fork: false,
                },
                {
                  name: 'b',
                  html_url: 'u/b',
                  stargazers_count: 9,
                  forks_count: 0,
                  pushed_at: '2026-01-01',
                  fork: true,
                },
              ])
            : ok({ public_repos: 5, followers: 3 }),
        ),
      ),
    );
    const service = TestBed.inject(GithubService);
    await service.load('someone');
    const state = service.state();
    expect(state.status).toBe('ready');
    if (state.status === 'ready') {
      expect(state.repos.map((r) => r.name)).toEqual(['a']);
      expect(state.stars).toBe(2);
      expect(state.profile.publicRepos).toBe(5);
    }
  });

  it('reports an error state when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) }),
    );
    const service = TestBed.inject(GithubService);
    await service.load('someone');
    expect(service.state().status).toBe('error');
  });
});

describe('private stats', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('parses only well-formed aggregate data', async () => {
    const { parsePrivateStats } = await import('./github.service');
    expect(parsePrivateStats('<html>')).toBeNull();
    expect(parsePrivateStats({ languages: {}, commits: 'x' })).toBeNull();
    expect(
      parsePrivateStats({ languages: { Go: 2, Bad: 'x' }, commits: ['2026-01-01', 5] }),
    ).toEqual({ languages: { Go: 2 }, commits: ['2026-01-01'] });
  });

  it('folds private commits and languages into the insights', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve(
          url === 'github-private.json'
            ? ok({ languages: { Go: 2 }, commits: [today, today, today] })
            : url.includes('/repos?') || url.includes('/events')
              ? ok([])
              : ok({ public_repos: 0, followers: 0 }),
        ),
      ),
    );
    const { GithubService } = await import('./github.service');
    const service = TestBed.inject(GithubService);
    await service.load('someone');
    const state = service.state();
    expect(state.status).toBe('ready');
    if (state.status === 'ready') {
      expect(state.includesPrivate).toBe(true);
      expect(state.activity?.commits).toBe(3);
      expect(state.languages).toEqual([{ name: 'Go', repos: 2, percent: 100 }]);
    }
  });
});

describe('GitHub insight helpers', () => {
  it('computes language share by repo count, largest first', async () => {
    const { buildLanguages } = await import('./github.service');
    const out = buildLanguages([
      { language: 'TypeScript' },
      { language: 'TypeScript' },
      { language: 'Python' },
      { language: null },
    ]);
    expect(out).toEqual([
      { name: 'TypeScript', repos: 2, percent: 67 },
      { name: 'Python', repos: 1, percent: 33 },
    ]);
  });

  it('buckets commit dates into a 12-week grid with week labels', async () => {
    const { buildActivity } = await import('./github.service');
    const now = new Date('2026-11-20T10:00:00Z'); // a Friday
    const out = buildActivity(
      [
        {
          type: 'PushEvent',
          created_at: '2026-11-19T08:00:00Z',
          repo: { name: 'me/site' },
          payload: { size: 1 },
        },
      ],
      [...Array(27).fill('2026-11-19'), '2026-11-20', '2026-11-20'],
      now,
    );
    expect(out.days).toHaveLength(84);
    expect(new Date(out.days[0].date + 'T00:00:00Z').getUTCDay()).toBe(0);
    expect(out.days.find((d) => d.date === '2026-11-19')?.count).toBe(27);
    expect(out.days.find((d) => d.date === '2026-11-21')?.future).toBe(true);
    expect(out.commits).toBe(29);
    expect(out.weeks).toHaveLength(12);
    expect(out.weeks[0].label).not.toBe('');
    expect(out.feed[0].text).toBe('Pushed 1 commit to site');
  });
});
