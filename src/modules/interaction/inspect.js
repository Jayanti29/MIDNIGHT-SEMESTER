// @ts-nocheck
/**
 * modules/interaction/inspect.js
 * Re-exports all player interaction / raycasting functions.
 *
 * The implementations live in main.js (deeply entangled with game state),
 * but this barrel is the canonical import point for other modules.
 */
export {
  getFocusedInteractable,
  getFocusedInteractable2,
  inspectNearest,
  inspectNearest2,
  inspectObject,
  updateInteractionPrompt
} from "../../main.js";
