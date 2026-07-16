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
  masterVolume: parseFloat(localStorage.getItem("setting-master-volume") || "1.0"),
  sfxVolume: parseFloat(localStorage.getItem("setting-sfx-volume") || "0.8"),
  ambientVolume: parseFloat(localStorage.getItem("setting-ambient-volume") || "0.8")
};
