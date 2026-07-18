/** time.js — in-game time formatting utilities */
export const formatTime = (h, m) =>
  `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
export function getPeriod(h) {
  if (h < 6)  return 'Night';
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  if (h < 21) return 'Evening';
  return 'Night';
}
export const realToGameMinutes = (s, scale = 2) => (s / 3600) * 60 * scale;
