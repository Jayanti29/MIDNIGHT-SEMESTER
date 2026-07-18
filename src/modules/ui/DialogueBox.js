/**
 * DialogueBox.js — In-game dialogue overlay connected to DialogueEngine.
 */
export class DialogueBox {
  constructor(engine, { onFinish = () => {} } = {}) {
    this.engine = engine; this.onFinish = onFinish; this._el = null;
  }
  mount(root = document.body) {
    this._el = document.createElement('div');
    this._el.id = 'dialogue-box'; this._el.className = 'dialogue-box glass';
    root.appendChild(this._el); this._render();
  }
  _render() {
    if (!this._el) return;
    if (this.engine.finished) { this.unmount(); this.onFinish(); return; }
    const n = this.engine.currentNode;
    if (!n) { this.unmount(); this.onFinish(); return; }
    const choices = n.choices?.length ? n.choices : [{ label: 'Continue', next: '__end__' }];
    this._el.innerHTML = `
      <p class="dialogue-text">${n.text}</p>
      <div class="dialogue-choices">
        ${choices.map((c, i) => `<button class="dialogue-choice" data-i="${i}">${c.label}</button>`).join('')}
      </div>`;
    this._el.querySelectorAll('.dialogue-choice').forEach(b =>
      b.addEventListener('click', () => { this.engine.choose(+b.dataset.i); this._render(); }));
  }
  unmount() { this._el?.remove(); this._el = null; }
}
