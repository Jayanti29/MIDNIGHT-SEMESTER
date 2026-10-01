export class GamepadButtonTracker {
  constructor() {
    this._pressed = new Map();
  }

  justPressed(pad, buttonIndex) {
    const key = `${pad.index}:${buttonIndex}`;
    const pressed = Boolean(pad.buttons[buttonIndex]?.pressed);
    const wasPressed = this._pressed.get(key) || false;
    this._pressed.set(key, pressed);
    return pressed && !wasPressed;
  }

  reset() {
    this._pressed.clear();
  }
}