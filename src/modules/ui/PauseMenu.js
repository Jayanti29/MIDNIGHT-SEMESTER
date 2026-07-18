/**
 * PauseMenu.js — Pause menu overlay.
 */
export class PauseMenu {
  constructor({ onResume = () => {}, onSave = () => {}, onQuit = () => {} } = {}) {
    this.onResume = onResume; this.onSave = onSave; this.onQuit = onQuit; this._el = null;
  }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'pause-menu';
    this._el.innerHTML = `
      <div class="pause-panel">
        <h2>Paused</h2>
        <button id="btn-resume">Resume</button>
        <button id="btn-save">Save Game</button>
        <button id="btn-quit">Quit to Menu</button>
      </div>`;
    this._el.querySelector('#btn-resume').addEventListener('click', () => this.onResume());
    this._el.querySelector('#btn-save').addEventListener('click',   () => this.onSave());
    this._el.querySelector('#btn-quit').addEventListener('click',   () => this.onQuit());
    root.appendChild(this._el);
  }
  show() { this._el?.classList.add('visible'); }
  hide() { this._el?.classList.remove('visible'); }
  unmount() { this._el?.remove(); this._el = null; }
}
