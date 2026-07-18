/**
 * SettingsMenu.js — Settings panel for audio and accessibility.
 */
export class SettingsMenu {
  constructor({ onApply = () => {}, audioManager = null } = {}) {
    this.onApply = onApply; this.am = audioManager; this._el = null;
    this.settings = { masterVolume: 0.8, sfxVolume: 1.0, musicVolume: 0.6, textSpeed: 'normal' };
  }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'settings-menu'; this._el.className = 'settings-panel glass';
    this._el.innerHTML = `<h3>Settings</h3>
      <label>Master Volume <input type="range" id="s-master" min="0" max="1" step="0.05" value="${this.settings.masterVolume}"></label>
      <label>SFX Volume    <input type="range" id="s-sfx"    min="0" max="1" step="0.05" value="${this.settings.sfxVolume}"></label>
      <label>Music Volume  <input type="range" id="s-music"  min="0" max="1" step="0.05" value="${this.settings.musicVolume}"></label>
      <label>Text Speed
        <select id="s-speed">
          <option value="slow">Slow</option><option value="normal" selected>Normal</option><option value="fast">Fast</option>
        </select>
      </label>
      <button id="s-apply">Apply</button>`;
    this._el.querySelector('#s-apply').addEventListener('click', () => {
      this.settings.masterVolume = +this._el.querySelector('#s-master').value;
      this.settings.sfxVolume    = +this._el.querySelector('#s-sfx').value;
      this.settings.musicVolume  = +this._el.querySelector('#s-music').value;
      this.settings.textSpeed    =  this._el.querySelector('#s-speed').value;
      this.am?.setMasterVolume(this.settings.masterVolume);
      this.onApply(this.settings);
    });
    root.appendChild(this._el);
  }
  show() { this._el?.classList.add('visible'); }
  hide() { this._el?.classList.remove('visible'); }
  unmount() { this._el?.remove(); this._el = null; }
}
