// @ts-nocheck
import * as THREE from "three";

// Enable Three.js global asset caching
THREE.Cache.enabled = true;

/**
 * Global THREE.LoadingManager for project asset loading.
 */
export const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const pct = Math.round((itemsLoaded / itemsTotal) * 100);
  const progressEl = /** @type {HTMLElement|null} */ (document.querySelector("#loading-progress"));
  const statusEl = document.querySelector("#loading-status");
  if (progressEl) progressEl.style.width = `${pct}%`;
  if (statusEl) statusEl.textContent = `Compiling shaders & assets... ${pct}% (${itemsLoaded}/${itemsTotal})`;
};

loadingManager.onLoad = () => {
  const loadingScreen = /** @type {HTMLElement|null} */ (document.querySelector("#loading-screen"));
  const statusEl = document.querySelector("#loading-status");
  if (statusEl) statusEl.textContent = "Assets loaded successfully. Ready.";
  if (loadingScreen) {
    loadingScreen.style.transition = "opacity 0.4s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => { loadingScreen.style.display = "none"; }, 400);
  }
};

loadingManager.onError = (url) => {
  console.warn(`[AssetLoader] Non-fatal asset loading issue at: ${url}`);
};

/**
 * AssetLoader.js — Batch-loads images and JSON with progress tracking.
 */
export class AssetLoader {
  constructor() {
    this.cache = new Map();
    this.total = 0;
    this.loaded = 0;
    this.textureLoader = new THREE.TextureLoader(loadingManager);
  }
  get progress() { return this.total === 0 ? 1 : this.loaded / this.total; }
  add(manifest) {
    for (const [k, u] of Object.entries(manifest)) this.cache.set(k, { url: u, asset: null });
    this.total = this.cache.size; return this;
  }
  async load(onProgress = (progress, key) => {}) {
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

