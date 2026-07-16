export const GameState = Object.freeze({
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover",
  WIN: "win",
  CHOICE: "choice",
  DECRYPTING: "decrypting"
});

export const state = {
  gameState: GameState.MENU,
  coopMode: false,
  hardcoreMode: false,
  
  // Volume controls
  masterVolume: 1.0,
  sfxVolume: 1.0,
  ambientVolume: 1.0
};
