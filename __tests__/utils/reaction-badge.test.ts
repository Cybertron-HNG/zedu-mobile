import {
  getReactionBadgeAlignment,
  getVisibleReactions,
} from '@/utils/reaction-badge';

describe('getReactionBadgeAlignment', () => {
  it('puts the badge on the end side for sent messages', () => {
    expect(getReactionBadgeAlignment(true)).toBe('flex-end');
  });

  it('puts the badge on the start side for received messages', () => {
    expect(getReactionBadgeAlignment(false)).toBe('flex-start');
  });
});

describe('getVisibleReactions', () => {
  const make = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ reaction: `e${i}` }));

  it('returns an empty array for missing or non-array input', () => {
    expect(getVisibleReactions(undefined)).toEqual([]);
    expect(getVisibleReactions(null)).toEqual([]);
    expect(getVisibleReactions('nope' as unknown as never[])).toEqual([]);
  });

  it('returns all reactions when under the limit', () => {
    expect(getVisibleReactions(make(1))).toEqual(make(1));
    expect(getVisibleReactions(make(3))).toEqual(make(3));
  });

  it('caps at 3 by default, preserving order', () => {
    expect(getVisibleReactions(make(5))).toEqual(make(3));
  });

  it('honours a custom max', () => {
    expect(getVisibleReactions(make(5), 2)).toEqual(make(2));
  });

  it('does not mutate the input', () => {
    const input = make(5);
    getVisibleReactions(input);
    expect(input).toHaveLength(5);
  });
});
