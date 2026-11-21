import { amend, commit, createHistory, redo, undo } from './builder-history';

describe('builder history', () => {
  it('commits, undoes and redoes in sequence', () => {
    let h = createHistory(0);
    h = commit(commit(h, 1), 2);
    expect(h.present).toBe(2);
    h = undo(h);
    expect(h.present).toBe(1);
    h = undo(h);
    expect(h.present).toBe(0);
    h = redo(h);
    expect(h.present).toBe(1);
  });

  it('is a no-op when committing the identical present', () => {
    const state = {};
    const h = createHistory(state);
    expect(commit(h, state)).toBe(h);
  });

  it('clears the future when committing after an undo', () => {
    let h = commit(commit(createHistory(0), 1), 2);
    h = commit(undo(h), 9);
    expect(h.future).toEqual([]);
    expect(redo(h)).toBe(h);
  });

  it('caps the past at 100 entries', () => {
    let h = createHistory(0);
    for (let i = 1; i <= 101; i++) h = commit(h, i);
    expect(h.past.length).toBe(100);
    expect(h.past[0]).toBe(1);
  });

  it('undo and redo at the ends return the same history', () => {
    const h = createHistory(0);
    expect(undo(h)).toBe(h);
    expect(redo(h)).toBe(h);
  });

  it('amends the present without adding an undo step', () => {
    const h = commit(createHistory(0), 1);
    const next = amend(h, 5);
    expect(next.present).toBe(5);
    expect(next.past).toEqual([0]);
    expect(undo(next).present).toBe(0);
  });
});
