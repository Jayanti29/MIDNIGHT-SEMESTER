/**
 * NotificationManager.js — Toast-style notification overlay.
 */
export class NotificationManager {
  constructor(root = document.body) { this.root = root; this._c = null; }
  mount() { this._c = document.createElement('div'); this._c.id = 'notifications'; this.root.appendChild(this._c); }
  show(msg, { duration = 3000, type = 'info' } = {}) {
    const el = document.createElement('div');
    el.className = `notification notification--${type}`; el.textContent = msg;
    this._c.appendChild(el);
    requestAnimationFrame(() => el.classList.add('notification--visible'));
    setTimeout(() => {
      el.classList.remove('notification--visible');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, duration);
  }
  unmount() { this._c?.remove(); this._c = null; }
}
