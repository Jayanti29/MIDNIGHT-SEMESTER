// @ts-nocheck
/**
 * modules/interaction/dialogue.js
 * Re-exports all dialogue / story queue functions.
 *
 * The implementations live in main.js (rely on local DOM vars and audio).
 * Import from here as the canonical source for interaction-layer modules.
 */
export {
  sayLine,
  queueStory,
  showNextStoryLine,
  playIntroDialogue,
  translateSpeakerName
} from "../../main.js";
