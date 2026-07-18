/**
 * AssetLoader.js — Batch-loads images and JSON with progress tracking.
 */
export class AssetLoader {
  constructor() { this.cache = new Map(); this.total = 0; this.loaded = 0; }
  get progress() { return this.total === 0 ? 1 : this.loaded / this.total; }
  add(manifest) {
    for (const [k, u] of Object.entries(manifest)) this.cache.set(k, { url: u, asset: null });
    this.total = this.cache.size; return this;
  }
  async load(onProgress = () => {}) {
    await Promise.all([...this.cache.entries()].map(async ([k, e]) => {
      e.asset = await this._fetch(e.url); this.loaded++; onProgress(this.progress, k);
    })); return this;
  }
  get(k) { return this.cache.get(k)?.asset ?? null; }
  async _fetch(url) {
    if (url.endsWith('.json')) return fetch(url).then(r => r.json());
    if (/\.(png|jpg|webp|svg)$/.test(url)) return new Promise((res, rej) => {
      const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = url;
    });
    return url;
  }
}
