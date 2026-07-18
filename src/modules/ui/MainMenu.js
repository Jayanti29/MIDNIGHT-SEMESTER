/**
 * MainMenu.js — Animated main menu screen.
 */
export class MainMenu {
  constructor({ onNewGame = () => {}, onContinue = () => {}, onCredits = () => {} } = {}) {
    this.onNewGame = onNewGame; this.onContinue = onContinue; this.onCredits = onCredits; this._el = null;
  }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'main-menu';
    this._el.innerHTML = `
      <div class="menu-bg"></div>
      <div class="menu-content">
        <h1 class="menu-title">Midnight Semester</h1>
        <p class="menu-subtitle">A college survival story</p>
        <div class="menu-buttons">
          <button id="btn-new">New Game</button>
          <button id="btn-cont">Continue</button>
          <button id="btn-cred">Credits</button>
        </div>
      </div>`;
    this._el.querySelector('#btn-new').addEventListener('click',  () => this.onNewGame());
    this._el.querySelector('#btn-cont').addEventListener('click', () => this.onContinue());
    this._el.querySelector('#btn-cred').addEventListener('click', () => this.onCredits());
    root.appendChild(this._el);
  }
  show() { this._el?.classList.add('visible'); }
  hide() { this._el?.classList.remove('visible'); }
  unmount() { this._el?.remove(); this._el = null; }
}
