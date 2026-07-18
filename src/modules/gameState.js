/**
 * gameState.js — single source of truth for mutable runtime state.
 */
export const gameState = {
  day: 1, hour: 8, minute: 0, timeScale: 1,
  energy: 100, stress: 0, gpa: 3.0, social: 50, money: 200,
  flags: {}, chapter: 1, currentRoom: 'dormitory', paused: false, debug: false,
};
export function advanceTime(minutes) {
  gameState.minute += minutes;
  while (gameState.minute >= 60) { gameState.minute -= 60; gameState.hour++; }
  if (gameState.hour >= 24) { gameState.hour = 8; gameState.minute = 0; gameState.day++; return true; }
  return false;
}
export function setFlag(k, v = true) { gameState.flags[k] = v; }
export function getFlag(k) { return gameState.flags[k] ?? false; }
export function serializeState() { return JSON.parse(JSON.stringify(gameState)); }
export function deserializeState(s) { Object.assign(gameState, s); }
