// Builds public/github-private.json from the owner's private repositories at build time.
// Only aggregate data is written (commit dates and per-language repo counts), never repo names.
// Needs GH_STATS_TOKEN: a fine-grained token with read access to Contents and Metadata.
import { mkdirSync, writeFileSync } from 'node:fs';

const token = process.env.GH_STATS_TOKEN;
const out = new URL('../public/github-private.json', import.meta.url);

if (!token) {
  console.log('GH_STATS_TOKEN not set; skipping private GitHub stats.');
  process.exit(0);
}

const WEEKS = 12;
const since = new Date(Date.now() - (WEEKS * 7 + 7) * 86_400_000).toISOString();
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

try {
  const me = await api('/user');
  const repos = (
    await api('/user/repos?visibility=private&affiliation=owner&per_page=100&sort=pushed')
  ).filter((r) => !r.fork);

  const commits = [];
  for (const repo of repos.filter((r) => r.pushed_at >= since)) {
    for (let page = 1; page <= 5; page++) {
      const list = await api(
        `/repos/${repo.full_name}/commits?author=${me.login}&since=${since}&per_page=100&page=${page}`,
      );
      commits.push(...list.flatMap((c) => c.commit?.author?.date?.slice(0, 10) ?? []));
      if (list.length < 100) break;
    }
  }

  const languages = {};
  for (const repo of repos) {
    if (repo.language) languages[repo.language] = (languages[repo.language] ?? 0) + 1;
  }

  mkdirSync(new URL('./', out), { recursive: true });
  writeFileSync(
    out,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      repos: repos.length,
      languages,
      commits,
    }),
  );
  console.log(`Wrote private stats: ${repos.length} repos, ${commits.length} commits.`);
} catch (error) {
  // A failure here must not block deploying the site; it just falls back to public data.
  console.warn(`Could not build private GitHub stats: ${error.message}`);
}
