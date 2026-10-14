/** Side of the bubble the reaction badge sits on: same side as the bubble. */
export function getReactionBadgeAlignment(
  sent: boolean,
): 'flex-start' | 'flex-end' {
  return sent ? 'flex-end' : 'flex-start';
}

/** First `max` reactions to show in the badge; safe for missing/invalid input. */
export function getVisibleReactions<T>(
  reactions: readonly T[] | null | undefined,
  max = 3,
): T[] {
  return Array.isArray(reactions) ? reactions.slice(0, max) : [];
}
