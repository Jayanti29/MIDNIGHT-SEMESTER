// @ts-nocheck
/**
 * modules/player/multiplayer.js
 * Co-op / Player 2 wiring helpers.
 * setupPlayer2() remains in main.js (deep local dependencies),
 * but is re-exported here so consuming code can import from one place.
 */
import {
  setupPlayer2,
  player2Keys,
  coopMode,
  GameState,
  getGameState,
  toggleFlashlight2,
  setEmfActive2,
  inspectNearest2
} from "../../main.js";

export { setupPlayer2 };

/**
 * Wire Player-2 specific keydown codes into the shared player2Keys Set.
 * Must be called AFTER the DOM is ready. The P1 keydown handler lives in
 * main.js; this function adds the complementary P2 branch so both can
 * co-exist on the same document listener.
 *
 * NOTE: In the current architecture the keydown listener in main.js already
 * handles player2Keys. This module is the canonical place to put any
 * additional coop input logic as it grows.
 */
export function initCoopKeyHandlers() {
  // Placeholder: the keydown branch in main.js already correctly routes
  // ArrowUp/Down/Left/Right, Period, Slash, ShiftRight, KeyO, KeyP into
  // player2Keys when coopMode is active. This function can be extended in
  // future tasks (gamepad support, touch overlay, etc.)
}

/**
 * Returns true if co-op mode is currently active.
 */
export function isCoopActive() {
  return coopMode;
}
