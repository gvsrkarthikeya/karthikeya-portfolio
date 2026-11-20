/** Scores how well `query` matches `text` as an in-order subsequence; 0 means no match. */
export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const t = text.toLowerCase();
  let score = 0;
  let from = 0;
  let streak = 0;
  for (const ch of q) {
    const at = t.indexOf(ch, from);
    if (at === -1) return 0;
    streak = at === from ? streak + 1 : 0;
    score += 1 + streak * 2 + (at === 0 || t[at - 1] === ' ' ? 3 : 0);
    from = at + 1;
  }
  return score;
}
