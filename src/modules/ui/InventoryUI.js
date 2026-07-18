/**
 * InventoryUI.js — Grid-based inventory display panel.
 */
export class InventoryUI {
  constructor(inventory) { this.inventory = inventory; this._el = null; }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'inventory-ui'; this._el.className = 'inventory-panel glass';
    root.appendChild(this._el); this.refresh();
  }
  refresh() {
    if (!this._el) return;
    const items = this.inventory.toArray();
    this._el.innerHTML = `<h3>Inventory</h3><div class="inventory-grid">${
      items.length ? items.map(i =>
        `<div class="inventory-slot" title="${i.name}"><span>📦</span><span>${i.name}</span>${i.qty > 1 ? `<span>×${i.qty}</span>` : ''}</div>`
      ).join('') : '<p>No items</p>'
    }</div>`;
  }
  show() { this._el?.classList.add('visible'); }
  hide() { this._el?.classList.remove('visible'); }
  unmount() { this._el?.remove(); this._el = null; }
}
