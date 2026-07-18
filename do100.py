#!/usr/bin/env python3
"""do100.py — create exactly 100 commits then push to origin/main"""
import os, subprocess, sys

REPO = "/Users/jayantigautam/Downloads/Midnight semester"
os.chdir(REPO)

COUNT = [0]

def write(path, content):
    os.makedirs(os.path.dirname(os.path.join(REPO, path)), exist_ok=True)
    with open(os.path.join(REPO, path), "w") as f:
        f.write(content)

def append(path, content):
    os.makedirs(os.path.dirname(os.path.join(REPO, path)), exist_ok=True)
    with open(os.path.join(REPO, path), "a") as f:
        f.write(content)

def commit(msg):
    COUNT[0] += 1
    subprocess.run(["git", "add", "-A"], check=True)
    result = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if result.returncode == 0:
        print(f"[{COUNT[0]}/100] ⚠ nothing to commit: {msg}")
        return
    subprocess.run(["git", "commit", "-m", msg, "--quiet"], check=True)
    print(f"[{COUNT[0]}/100] ✔  {msg}")

print("=" * 60)
print("  Creating 100 commits → push to GitHub")
print("=" * 60)

# 1
write("docs/ARCHITECTURE.md", """# Architecture Overview

## High-Level Structure
```
src/
├── main.js
├── styles.css
└── modules/
    ├── audio/       Web Audio API engine
    ├── character/   Character state & animations
    ├── core/        Engine loop, renderer, event bus
    ├── flow/        Game flow & narrative engine
    ├── input/       Keyboard & pointer handling
    ├── interaction/ Player↔world interaction
    ├── level/       Level loading & management
    ├── minigames/   Embedded mini-game modules
    ├── npc/         NPC AI & dialogue
    ├── player/      Player controller & stats
    ├── textures/    Procedural texture generation
    └── ui/          HUD, menus, overlays
```
Each module exposes a public API via its `index.js` barrel export.
""")
commit("docs: add ARCHITECTURE.md with high-level module overview")

# 2
write("docs/CONTRIBUTING.md", """# Contributing Guide

## Branching Strategy
- `main` — stable, production-ready
- `dev`  — integration branch
- `feature/<name>` — short-lived feature branches

## Commit Convention (Conventional Commits)
- `feat:`     new feature
- `fix:`      bug fix
- `refactor:` code restructure (no behaviour change)
- `docs:`     documentation only
- `chore:`    build / tooling
- `style:`    CSS / formatting

## Code Style
- ES2022+ modules, no CommonJS
- 2-space indent, single quotes
- JSDoc on all exported functions
""")
commit("docs: add CONTRIBUTING.md with branching and commit guidelines")

# 3
write("docs/AUDIO_SYSTEM.md", """# Audio System

## Overview
The audio system uses the Web Audio API:
- Procedural SFX (footsteps, ambient, UI sounds)
- Dialogue whisper buffers
- Dynamic music layering

## Key Classes
| Class | File | Responsibility |
|---|---|---|
| `AudioManager` | `modules/audio/AudioManager.js` | Central coordinator |
| `SFXGenerator` | `modules/audio/sfx.js` | Procedural SFX |
| `DialogueBuffer` | `modules/audio/dialogue.js` | Whisper/speech |

## Usage
```js
import { AudioManager } from './modules/audio/index.js';
const audio = new AudioManager();
audio.init(); // call after user gesture
audio.playSFX('blip');
```
""")
commit("docs: add AUDIO_SYSTEM.md describing audio module architecture")

# 4
write("docs/NPC_SYSTEM.md", """# NPC System

## Dialogue Tree
NPCs use a JSON-driven dialogue tree. Each node:
- `id`      — unique string identifier
- `text`    — display text
- `choices` — array of player responses `{label, next}`
- `next`    — next node id or `__end__`

## NPC State Machine
1. **Idle**    — standing, waiting for player
2. **Alert**   — player in proximity
3. **Talking** — dialogue active
4. **Fleeing** — stress threshold exceeded

## Adding a New NPC
1. Add entry to `campus-layout.json`
2. Create dialogue JSON under `src/modules/npc/dialogues/`
3. Register NPC in `src/modules/npc/index.js`
""")
commit("docs: add NPC_SYSTEM.md with dialogue tree and state machine")

# 5
write("docs/MINIGAMES.md", """# Mini-Games

## Currently Implemented
| Mini-Game | Module | Trigger |
|---|---|---|
| Exam Panic | `minigames/ExamPanic.js` | Library desk |
| Coffee Rush | `minigames/CoffeeRush.js` | Cafeteria counter |
| Deadline Dash | `minigames/DeadlineDash.js` | Dorm computer |

## Lifecycle Interface
Each mini-game exports `{ init, update, destroy }`.

## Adding a New Mini-Game
1. Create `src/modules/minigames/<Name>.js`
2. Export `{ init, update, destroy }`
3. Register in `src/modules/minigames/index.js`
4. Add trigger in relevant interaction handler
""")
commit("docs: add MINIGAMES.md with mini-game registry and extension guide")

# 6
write("docs/LEVEL_DESIGN.md", """# Level Design Guide

## Campus Layout
Geometry defined in `src/campus-layout.json`.
Coordinate system: X = east, Y = north.

## Room Schema
```json
{
  "id": "library",
  "name": "University Library",
  "bounds": { "x": 10, "y": 20, "w": 30, "h": 25 },
  "exits": ["main-hall", "study-rooms"],
  "lighting": "dramatic"
}
```

## Lighting Zones
- `"ambient"`  — soft fill light
- `"dramatic"` — high-contrast spotlight
- `"night"`    — dim blue tint
""")
commit("docs: add LEVEL_DESIGN.md with campus layout and room schema")

# 7
write("docs/UI_COMPONENTS.md", """# UI Components

## HUD Elements
| Component | CSS class | Description |
|---|---|---|
| Stress Meter | `.hud-stress` | Fills red as stress rises |
| Sleep Bar | `.hud-sleep` | Depletes over time |
| Calendar | `.hud-calendar` | Current in-game date |
| Notification | `.hud-notification` | Toast-style overlay |

## Menu Screens
- **Main Menu** — animated star background
- **Pause Menu** — blur overlay with resume/save/quit
- **Inventory** — item grid panel
- **Journal** — narrative log with chapter tabs
- **Settings** — volume sliders, text speed
""")
commit("docs: add UI_COMPONENTS.md with HUD and menu component inventory")

# 8
write("docs/PLAYER_MECHANICS.md", """# Player Mechanics

## Stats
| Stat | Range | Failure Effect |
|---|---|---|
| Energy | 0–100 | Blackout / game over |
| Stress | 0–100 | Panic, reduced choices |
| GPA | 0.0–4.0 | Affects endings |
| Social | 0–100 | Unlocks NPC dialogue |

## Time System
- 1 in-game hour = 30 real-world seconds
- Day cycle: 08:00 → 24:00

## Controls
| Key | Action |
|---|---|
| WASD / Arrows | Move |
| E | Interact |
| ESC | Pause |
| J | Toggle Journal |
""")
commit("docs: add PLAYER_MECHANICS.md with stats, time system, controls")

# 9
write("docs/TESTING.md", """# Testing Strategy

## Unit Tests
```bash
npm test
```
Coverage target: 80% for all modules.

## Integration Tests
Playwright browser tests:
```bash
npm run test:e2e
```

## Manual QA Checklist
- [ ] All NPC dialogues reachable
- [ ] All mini-games completable
- [ ] Save/load round-trip correct
- [ ] Audio plays without distortion
- [ ] No memory leaks after 10 min
- [ ] All three endings reachable
""")
commit("docs: add TESTING.md with unit, integration, and QA checklist")

# 10
write("docs/DEPLOYMENT.md", """# Deployment

## Development
```bash
npm install && npm run dev
```
Opens at http://localhost:5173

## Production Build
```bash
npm run build   # → dist/
```

## GitHub Pages
```bash
npm run build && npx gh-pages -d dist
```

## Environment Variables
| Variable | Default | Description |
|---|---|---|
| `VITE_DEBUG` | `false` | Enable debug overlay |
| `VITE_GOD_MODE` | `false` | Disable stat degradation |
""")
commit("docs: add DEPLOYMENT.md with dev, build, and GitHub Pages steps")

# 11
write("src/modules/character/CharacterController.js", """/**
 * CharacterController.js
 * Manages character position and velocity.
 */
export class CharacterController {
  constructor(x = 0, y = 0) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.speed = 3;
  }
  move(dx, dy) {
    this.vx = dx * this.speed; this.vy = dy * this.speed;
    this.x += this.vx; this.y += this.vy;
  }
  dampen() { this.vx = 0; this.vy = 0; }
}
""")
commit("feat(character): implement CharacterController")

# 12
write("src/modules/character/CharacterAnimator.js", """/**
 * CharacterAnimator.js
 * Sprite-sheet frame selection based on movement state.
 */
export class CharacterAnimator {
  constructor(spriteSheetUrl, fw = 32, fh = 32) {
    this.url = spriteSheetUrl;
    this.fw = fw; this.fh = fh;
    this.frame = 0; this.direction = 'down';
    this.timer = 0; this.interval = 8;
  }
  tick(moving) {
    if (!moving) { this.frame = 0; return; }
    if (++this.timer >= this.interval) { this.timer = 0; this.frame = (this.frame + 1) % 4; }
  }
  getSourceRect() {
    const row = { down: 0, left: 1, right: 2, up: 3 }[this.direction] ?? 0;
    return { sx: this.frame * this.fw, sy: row * this.fh, sw: this.fw, sh: this.fh };
  }
}
""")
commit("feat(character): implement CharacterAnimator with sprite-sheet support")

# 13
write("src/modules/character/index.js", """export { CharacterController } from './CharacterController.js';
export { CharacterAnimator }   from './CharacterAnimator.js';
""")
commit("feat(character): add character module barrel export")

# 14
write("src/modules/core/EventBus.js", """/**
 * EventBus.js — Lightweight pub/sub event bus.
 */
export class EventBus {
  constructor() { this._l = new Map(); }
  on(e, fn) {
    if (!this._l.has(e)) this._l.set(e, new Set());
    this._l.get(e).add(fn);
    return () => this.off(e, fn);
  }
  off(e, fn) { this._l.get(e)?.delete(fn); }
  emit(e, d)  { this._l.get(e)?.forEach(fn => fn(d)); }
  once(e, fn) { const u = this.on(e, d => { fn(d); u(); }); }
}
""")
commit("feat(core): implement EventBus with on/off/emit/once")

# 15
write("src/modules/core/GameLoop.js", """/**
 * GameLoop.js — Fixed-timestep game loop using requestAnimationFrame.
 */
export class GameLoop {
  constructor({ update = () => {}, render = () => {}, targetFPS = 60 } = {}) {
    this.update = update; this.render = render;
    this.timestep = 1000 / targetFPS;
    this._raf = null; this._last = 0; this._acc = 0; this.running = false;
  }
  start() {
    if (this.running) return;
    this.running = true; this._last = performance.now();
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }
  stop() { this.running = false; cancelAnimationFrame(this._raf); }
  _loop(now) {
    if (!this.running) return;
    this._acc += Math.min(now - this._last, 200); this._last = now;
    while (this._acc >= this.timestep) { this.update(this.timestep / 1000); this._acc -= this.timestep; }
    this.render(this._acc / this.timestep);
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }
}
""")
commit("feat(core): implement fixed-timestep GameLoop")

# 16
write("src/modules/core/Renderer.js", """/**
 * Renderer.js — Canvas 2D rendering helper.
 */
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.width = canvas.width; this.height = canvas.height;
  }
  clear(c = '#0a0a0f') { this.ctx.fillStyle = c; this.ctx.fillRect(0, 0, this.width, this.height); }
  drawSprite(img, sx, sy, sw, sh, dx, dy, dw, dh) { this.ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); }
  drawRect(x, y, w, h, c) { this.ctx.fillStyle = c; this.ctx.fillRect(x, y, w, h); }
  drawText(t, x, y, { font = '16px monospace', color = '#fff', align = 'left' } = {}) {
    this.ctx.font = font; this.ctx.fillStyle = color; this.ctx.textAlign = align; this.ctx.fillText(t, x, y);
  }
  resize(w, h) { this.width = this.canvas.width = w; this.height = this.canvas.height = h; }
}
""")
commit("feat(core): implement Renderer with clear, drawSprite, drawRect, drawText")

# 17
write("src/modules/core/Camera.js", """/**
 * Camera.js — 2D camera with smooth follow and viewport culling.
 */
export class Camera {
  constructor(vw, vh) { this.x = 0; this.y = 0; this.vw = vw; this.vh = vh; this.lerp = 0.1; }
  follow(t) {
    this.x += (t.x - this.vw / 2 - this.x) * this.lerp;
    this.y += (t.y - this.vh / 2 - this.y) * this.lerp;
  }
  clamp(ww, wh) {
    this.x = Math.max(0, Math.min(ww - this.vw, this.x));
    this.y = Math.max(0, Math.min(wh - this.vh, this.y));
  }
  toScreen(wx, wy) { return { x: wx - this.x, y: wy - this.y }; }
  isVisible(x, y, w, h) {
    return x + w > this.x && x < this.x + this.vw && y + h > this.y && y < this.y + this.vh;
  }
}
""")
commit("feat(core): implement Camera with smooth follow and viewport culling")

# 18
write("src/modules/core/AssetLoader.js", """/**
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
    if (/\\.(png|jpg|webp|svg)$/.test(url)) return new Promise((res, rej) => {
      const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = url;
    });
    return url;
  }
}
""")
commit("feat(core): implement AssetLoader with batch loading and progress")

# 19
write("src/modules/core/DebugOverlay.js", """/**
 * DebugOverlay.js — On-screen FPS counter and debug data overlay.
 */
export class DebugOverlay {
  constructor() { this._el = null; this._fps = 0; this._fc = 0; this._lt = performance.now(); }
  mount(root = document.body) {
    this._el = document.createElement('div');
    Object.assign(this._el.style, {
      position: 'fixed', top: '0', right: '0', padding: '8px',
      background: 'rgba(0,0,0,.7)', color: '#0f0', font: '12px monospace',
      zIndex: '9999', pointerEvents: 'none', whiteSpace: 'pre',
    });
    root.appendChild(this._el);
  }
  update(data = {}) {
    this._fc++;
    const now = performance.now();
    if (now - this._lt >= 500) {
      this._fps = Math.round(this._fc / ((now - this._lt) / 1000));
      this._fc = 0; this._lt = now;
    }
    if (this._el) this._el.textContent = `FPS: ${this._fps}\\n` +
      Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\\n');
  }
  unmount() { this._el?.remove(); this._el = null; }
}
""")
commit("feat(core): implement DebugOverlay with FPS counter")

# 20
write("src/modules/core/index.js", """export { EventBus }     from './EventBus.js';
export { GameLoop }     from './GameLoop.js';
export { Renderer }     from './Renderer.js';
export { Camera }       from './Camera.js';
export { AssetLoader }  from './AssetLoader.js';
export { DebugOverlay } from './DebugOverlay.js';
""")
commit("feat(core): add core module barrel export")

# 21
write("src/modules/input/InputManager.js", """/**
 * InputManager.js — Centralised keyboard input state tracker.
 */
export class InputManager {
  constructor() { this._held = new Set(); this._jp = new Set(); this._jr = new Set(); }
  attach() {
    window.addEventListener('keydown', this._kd = e => {
      if (!this._held.has(e.code)) this._jp.add(e.code);
      this._held.add(e.code);
    });
    window.addEventListener('keyup', this._ku = e => {
      this._held.delete(e.code); this._jr.add(e.code);
    });
  }
  detach() {
    window.removeEventListener('keydown', this._kd);
    window.removeEventListener('keyup', this._ku);
  }
  flush() { this._jp.clear(); this._jr.clear(); }
  isHeld(k) { return this._held.has(k); }
  isJustPressed(k) { return this._jp.has(k); }
  isJustReleased(k) { return this._jr.has(k); }
}
""")
commit("feat(input): implement InputManager with held/justPressed/justReleased")

# 22
write("src/modules/input/index.js", "export { InputManager } from './InputManager.js';\n")
commit("feat(input): add input module barrel export")

# 23
write("src/modules/player/PlayerStats.js", """/**
 * PlayerStats.js — Tracks all player statistics.
 */
export class PlayerStats {
  constructor() { this.energy = 100; this.stress = 0; this.gpa = 3.0; this.social = 50; this.money = 200; }
  static clamp(v, mn = 0, mx = 100) { return Math.max(mn, Math.min(mx, v)); }
  modifyEnergy(d) { this.energy = PlayerStats.clamp(this.energy + d); }
  modifyStress(d) { this.stress = PlayerStats.clamp(this.stress + d); }
  modifyGPA(d) { this.gpa = PlayerStats.clamp(this.gpa + d, 0, 4.0); }
  modifySocial(d) { this.social = PlayerStats.clamp(this.social + d); }
  modifyMoney(d) { this.money = Math.max(0, this.money + d); }
  isGameOver() { return this.energy <= 0 || this.stress >= 100; }
  serialize() { return { energy: this.energy, stress: this.stress, gpa: this.gpa, social: this.social, money: this.money }; }
  deserialize(d) { Object.assign(this, d); }
}
""")
commit("feat(player): implement PlayerStats with clamp, modify, serialize")

# 24
write("src/modules/player/Inventory.js", """/**
 * Inventory.js — Item bag with add/remove/has.
 */
export class Inventory {
  constructor(cap = 20) { this.cap = cap; this.items = new Map(); }
  add(item, qty = 1) {
    if (this.items.size >= this.cap && !this.items.has(item.id)) return false;
    const e = this.items.get(item.id);
    if (e) e.qty += qty; else this.items.set(item.id, { ...item, qty });
    return true;
  }
  remove(id, qty = 1) {
    const e = this.items.get(id);
    if (!e || e.qty < qty) return false;
    e.qty -= qty;
    if (e.qty <= 0) this.items.delete(id);
    return true;
  }
  has(id, qty = 1) { return (this.items.get(id)?.qty ?? 0) >= qty; }
  toArray() { return [...this.items.values()]; }
  serialize() { return this.toArray(); }
  deserialize(a) { this.items.clear(); for (const i of a) this.items.set(i.id, i); }
}
""")
commit("feat(player): implement Inventory with add, remove, has, serialize")

# 25
write("src/modules/player/Player.js", """/**
 * Player.js — Combines CharacterController, CharacterAnimator, and PlayerStats.
 */
import { CharacterController } from '../character/CharacterController.js';
import { CharacterAnimator }   from '../character/CharacterAnimator.js';
import { PlayerStats }         from './PlayerStats.js';

export class Player {
  constructor(x = 0, y = 0) {
    this.controller = new CharacterController(x, y);
    this.animator   = new CharacterAnimator('/assets/player-sheet.png');
    this.stats      = new PlayerStats();
  }
  get x() { return this.controller.x; }
  get y() { return this.controller.y; }
  update(input) {
    const dx = (input.isHeld('ArrowRight') || input.isHeld('KeyD') ? 1 : 0)
             - (input.isHeld('ArrowLeft')  || input.isHeld('KeyA') ? 1 : 0);
    const dy = (input.isHeld('ArrowDown')  || input.isHeld('KeyS') ? 1 : 0)
             - (input.isHeld('ArrowUp')    || input.isHeld('KeyW') ? 1 : 0);
    const moving = dx !== 0 || dy !== 0;
    if (moving) {
      this.controller.move(dx, dy);
      this.animator.direction = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
    }
    this.animator.tick(moving);
  }
}
""")
commit("feat(player): implement Player facade combining controller, animator, stats")

# 26
write("src/modules/player/index.js", """export { Player }      from './Player.js';
export { PlayerStats } from './PlayerStats.js';
export { Inventory }   from './Inventory.js';
""")
commit("feat(player): add player module barrel export")

# 27
write("src/modules/npc/NPC.js", """/**
 * NPC.js — Base class for all non-player characters.
 */
export class NPC {
  constructor({ id, name, x = 0, y = 0, dialogueTree = null }) {
    this.id = id; this.name = name; this.x = x; this.y = y;
    this.dialogueTree = dialogueTree; this.state = 'idle';
  }
  distanceTo(e) { return Math.hypot(e.x - this.x, e.y - this.y); }
  update(player) {
    if (this.state !== 'talking') this.state = this.distanceTo(player) < 80 ? 'alert' : 'idle';
  }
  startDialogue() { this.state = 'talking'; }
  endDialogue()   { this.state = 'idle'; }
}
""")
commit("feat(npc): implement NPC base class with proximity state machine")

# 28
write("src/modules/npc/DialogueEngine.js", """/**
 * DialogueEngine.js — Traverses a JSON dialogue tree.
 */
export class DialogueEngine {
  constructor(tree) { this.tree = tree; this.currentNodeId = 'start'; this.finished = false; }
  get currentNode() { return this.tree.nodes[this.currentNodeId] ?? null; }
  choose(index) {
    const c = this.currentNode?.choices?.[index];
    this.currentNodeId = c?.next ?? '__end__';
    if (this.currentNodeId === '__end__') this.finished = true;
  }
  reset() { this.currentNodeId = 'start'; this.finished = false; }
}
""")
commit("feat(npc): implement DialogueEngine for JSON dialogue tree traversal")

# 29
write("src/modules/npc/index.js", """export { NPC }            from './NPC.js';
export { DialogueEngine } from './DialogueEngine.js';
""")
commit("feat(npc): add NPC module barrel export")

# 30
os.makedirs("src/modules/npc/dialogues", exist_ok=True)
write("src/modules/npc/dialogues/professor.json", """{
  "nodes": {
    "start": {
      "text": "Ah, there you are. You look exhausted. Have you been sleeping at all this semester?",
      "choices": [
        { "label": "I'm fine, Professor Chen.", "next": "fine" },
        { "label": "Not really… the workload is intense.", "next": "honest" }
      ]
    },
    "fine": { "text": "Your last assignment tells a different story. Office hours are Tuesdays.", "choices": [] },
    "honest": {
      "text": "Honesty! Come to office hours — we can talk about extensions. Mental health matters.",
      "choices": [
        { "label": "Thank you, I'll come by.", "next": "thanks" },
        { "label": "I'll manage on my own.", "next": "__end__" }
      ]
    },
    "thanks": { "text": "Good. Tuesday, 2pm. Now get some rest.", "choices": [] }
  }
}
""")
commit("feat(npc): add Professor Chen dialogue tree JSON")

# 31
write("src/modules/npc/dialogues/roommate.json", """{
  "nodes": {
    "start": {
      "text": "Dude, are you seriously still awake? It's 3am.",
      "choices": [
        { "label": "I have an exam tomorrow.", "next": "exam" },
        { "label": "I couldn't sleep.", "next": "sleep" }
      ]
    },
    "exam": {
      "text": "Sleep deprivation tanks your memory. Close the laptop.",
      "choices": [
        { "label": "You're right. Goodnight.", "next": "__end__" },
        { "label": "Just one more hour.", "next": "stubborn" }
      ]
    },
    "sleep": { "text": "Put on rain sounds. Use my speaker.", "choices": [] },
    "stubborn": { "text": "Your funeral. I'm putting headphones on.", "choices": [] }
  }
}
""")
commit("feat(npc): add Roommate dialogue tree JSON")

# 32
write("src/modules/npc/dialogues/barista.json", """{
  "nodes": {
    "start": {
      "text": "Welcome to Campus Brew! The usual?",
      "choices": [
        { "label": "Double espresso, please.", "next": "espresso" },
        { "label": "What do you recommend?", "next": "recommend" },
        { "label": "Just water, I'm broke.", "next": "water" }
      ]
    },
    "espresso": { "text": "Coming right up! That's $3.50.", "choices": [] },
    "recommend": {
      "text": "The oat milk latte. Basically a hug in a cup. $4.75.",
      "choices": [
        { "label": "I'll take one.", "next": "latte" },
        { "label": "Maybe next time.", "next": "__end__" }
      ]
    },
    "latte": { "text": "Great choice! Coming right up.", "choices": [] },
    "water": { "text": "No worries — water's always free. Stay hydrated!", "choices": [] }
  }
}
""")
commit("feat(npc): add Campus Brew barista dialogue tree JSON")

# 33
write("src/modules/npc/dialogues/librarian.json", """{
  "nodes": {
    "start": {
      "text": "Shh. This is a library. Can I help you find something?",
      "choices": [
        { "label": "Books on algorithms?", "next": "algo" },
        { "label": "Where are the study rooms?", "next": "rooms" },
        { "label": "Sorry, just passing through.", "next": "__end__" }
      ]
    },
    "algo": { "text": "Section 4B, third shelf. Cormen and Sedgewick are both there.", "choices": [] },
    "rooms": { "text": "Down the hall, turn left. First come, first served. Max 2 hours.", "choices": [] }
  }
}
""")
commit("feat(npc): add Librarian dialogue tree JSON")

# 34
write("src/modules/flow/FlowController.js", """/**
 * FlowController.js — Manages high-level game state transitions.
 */
export class FlowController {
  constructor(bus) { this.bus = bus; this.state = 'mainMenu'; }
  transition(to) { const prev = this.state; this.state = to; this.bus.emit('flowTransition', { from: prev, to }); }
  startGame()        { this.transition('gameplay'); }
  pauseGame()        { this.transition('paused'); }
  resumeGame()       { this.transition('gameplay'); }
  triggerEnding(id)  { this.transition(`ending:${id}`); }
  returnToMenu()     { this.transition('mainMenu'); }
}
""")
commit("feat(flow): implement FlowController for game state transitions")

# 35
write("src/modules/flow/SaveManager.js", """/**
 * SaveManager.js — Serialises game state to/from localStorage.
 */
const KEY = 'midnight_semester_save';
export class SaveManager {
  save(state)  { try { localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() })); return true; } catch { return false; } }
  load()       { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
  deleteSave() { localStorage.removeItem(KEY); }
  hasSave()    { return localStorage.getItem(KEY) !== null; }
}
""")
commit("feat(flow): implement SaveManager with localStorage persistence")

# 36
write("src/modules/flow/AchievementManager.js", """/**
 * AchievementManager.js — Tracks and unlocks achievements.
 */
export class AchievementManager {
  constructor(bus) { this.bus = bus; this.achievements = new Map(); }
  register(a) { this.achievements.set(a.id, { ...a, unlocked: false }); }
  unlock(id) {
    const a = this.achievements.get(id);
    if (!a || a.unlocked) return;
    a.unlocked = true; this.bus.emit('achievementUnlocked', a);
  }
  isUnlocked(id) { return this.achievements.get(id)?.unlocked ?? false; }
  serialize()    { return [...this.achievements.entries()].filter(([, a]) => a.unlocked).map(([id]) => id); }
  deserialize(ids) { for (const id of ids) { const a = this.achievements.get(id); if (a) a.unlocked = true; } }
}
""")
commit("feat(flow): implement AchievementManager with unlock and persist")

# 37
write("src/modules/flow/index.js", """export { FlowController }     from './FlowController.js';
export { SaveManager }        from './SaveManager.js';
export { AchievementManager } from './AchievementManager.js';
""")
commit("feat(flow): add flow module barrel export")

# 38
write("src/modules/interaction/Interactable.js", """/**
 * Interactable.js — Base class for interactable world objects.
 */
export class Interactable {
  constructor({ id, x, y, radius = 40, label = '', onInteract = () => {} }) {
    this.id = id; this.x = x; this.y = y;
    this.radius = radius; this.label = label; this.onInteract = onInteract; this.enabled = true;
  }
  disable() { this.enabled = false; }
  enable()  { this.enabled = true; }
  getPrompt() { return this.enabled ? `[E] ${this.label}` : ''; }
}
""")
commit("feat(interaction): implement Interactable base class")

# 39
write("src/modules/interaction/InteractionSystem.js", """/**
 * InteractionSystem.js — Detects and triggers player↔world interactions.
 */
export class InteractionSystem {
  constructor(bus) { this.bus = bus; this.interactables = []; }
  register(o)    { this.interactables.push(o); }
  unregister(id) { this.interactables = this.interactables.filter(i => i.id !== id); }
  getNearby(player) {
    let best = null, min = Infinity;
    for (const o of this.interactables) {
      const d = Math.hypot(player.x - o.x, player.y - o.y);
      if (o.enabled && d <= o.radius && d < min) { best = o; min = d; }
    }
    return best;
  }
  tryInteract(player) {
    const t = this.getNearby(player);
    if (t) { t.onInteract(player); this.bus.emit('interaction', { id: t.id }); }
  }
}
""")
commit("feat(interaction): implement InteractionSystem with proximity detection")

# 40
write("src/modules/interaction/index.js", """export { InteractionSystem } from './InteractionSystem.js';
export { Interactable }      from './Interactable.js';
""")
commit("feat(interaction): add interaction module barrel export")

# 41
write("src/modules/level/Room.js", """/**
 * Room.js — Represents a single room in the campus layout.
 */
export class Room {
  constructor({ id, name, bounds, exits = [], lighting = 'ambient' }) {
    this.id = id; this.name = name; this.bounds = bounds;
    this.exits = exits; this.lighting = lighting; this.interactables = [];
  }
  contains(x, y) {
    return x >= this.bounds.x && x <= this.bounds.x + this.bounds.w
        && y >= this.bounds.y && y <= this.bounds.y + this.bounds.h;
  }
  addInteractable(o) { this.interactables.push(o); }
}
""")
commit("feat(level): implement Room with bounds and contains check")

# 42
write("src/modules/level/CollisionMap.js", """/**
 * CollisionMap.js — Grid-based tile collision detection.
 */
export class CollisionMap {
  constructor(grid, tileSize = 32) {
    this.grid = grid; this.ts = tileSize;
    this.cols = grid[0]?.length ?? 0; this.rows = grid.length;
  }
  isSolid(wx, wy) {
    const c = Math.floor(wx / this.ts), r = Math.floor(wy / this.ts);
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return true;
    return this.grid[r][c] === 1;
  }
  rectOverlaps(x, y, w, h) {
    const x1 = Math.floor(x / this.ts), y1 = Math.floor(y / this.ts);
    const x2 = Math.floor((x + w - 1) / this.ts), y2 = Math.floor((y + h - 1) / this.ts);
    for (let r = y1; r <= y2; r++) for (let c = x1; c <= x2; c++) if (this.grid[r]?.[c] === 1) return true;
    return false;
  }
}
""")
commit("feat(level): implement CollisionMap with point and AABB checks")

# 43
write("src/modules/level/LevelManager.js", """/**
 * LevelManager.js — Loads and manages the campus level from JSON.
 */
import { Room } from './Room.js';
export class LevelManager {
  constructor() { this.rooms = new Map(); this.currentRoomId = null; }
  async load(url) {
    const data = await fetch(url).then(r => r.json());
    for (const rd of data.rooms ?? []) this.rooms.set(rd.id, new Room(rd));
    this.currentRoomId = data.startRoom ?? this.rooms.keys().next().value;
  }
  get currentRoom() { return this.rooms.get(this.currentRoomId) ?? null; }
  transition(id) {
    if (!this.rooms.has(id)) throw new Error(`Unknown room: ${id}`);
    this.currentRoomId = id;
  }
}
""")
commit("feat(level): implement LevelManager with async load and room transition")

# 44
write("src/modules/level/index.js", """export { LevelManager } from './LevelManager.js';
export { Room }         from './Room.js';
export { CollisionMap } from './CollisionMap.js';
""")
commit("feat(level): add level module barrel export")

# 45
write("src/modules/textures/TextureGenerator.js", """/**
 * TextureGenerator.js — Procedural canvas textures.
 */
export class TextureGenerator {
  static noise(size = 64, base = '#1a1a2e') {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'); ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
    const id = ctx.getImageData(0, 0, size, size), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() * 20 - 10) | 0;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    }
    ctx.putImageData(id, 0, 0); return c;
  }
  static checkerboard(size = 64, cA = '#111122', cB = '#1a1a3a') {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'), h = size / 2;
    ctx.fillStyle = cA; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = cB; ctx.fillRect(0, 0, h, h); ctx.fillRect(h, h, h, h);
    return c;
  }
}
""")
commit("feat(textures): implement TextureGenerator with noise and checkerboard")

# 46
write("src/modules/textures/index.js", "export { TextureGenerator } from './TextureGenerator.js';\n")
commit("feat(textures): add textures module barrel export")

# 47
write("src/modules/minigames/ExamPanic.js", """/**
 * ExamPanic.js — Mini-game: MCQ questions against the clock.
 */
export class ExamPanic {
  constructor({ questions = [], timeLimit = 60, onComplete = () => {} } = {}) {
    this.questions = questions; this.timeLimit = timeLimit; this.onComplete = onComplete;
    this.index = 0; this.score = 0; this.elapsed = 0; this.active = false;
  }
  init()   { this.index = 0; this.score = 0; this.elapsed = 0; this.active = true; }
  update(dt) { if (!this.active) return; this.elapsed += dt; if (this.elapsed >= this.timeLimit) this._end(); }
  answer(i) {
    const q = this.questions[this.index]; if (!q) return;
    if (i === q.correct) this.score++;
    this.index++; if (this.index >= this.questions.length) this._end();
  }
  _end()    { this.active = false; this.onComplete({ score: this.score, total: this.questions.length }); }
  destroy() { this.active = false; }
}
""")
commit("feat(minigames): implement ExamPanic MCQ mini-game")

# 48
write("src/modules/minigames/CoffeeRush.js", """/**
 * CoffeeRush.js — Mini-game: tap to keep energy up.
 */
export class CoffeeRush {
  constructor({ targetTaps = 20, windowMs = 10000, onComplete = () => {} } = {}) {
    this.targetTaps = targetTaps; this.windowMs = windowMs; this.onComplete = onComplete;
    this.taps = 0; this.elapsed = 0; this.active = false;
  }
  init()   { this.taps = 0; this.elapsed = 0; this.active = true; }
  update(dt) { if (!this.active) return; this.elapsed += dt * 1000; if (this.elapsed >= this.windowMs) this._end(); }
  tap()    { if (!this.active) return; this.taps++; if (this.taps >= this.targetTaps) this._end(); }
  _end()   { this.active = false; this.onComplete({ success: this.taps >= this.targetTaps, taps: this.taps }); }
  destroy() { this.active = false; }
}
""")
commit("feat(minigames): implement CoffeeRush tap mini-game")

# 49
write("src/modules/minigames/DeadlineDash.js", """/**
 * DeadlineDash.js — Mini-game: type a passage before time runs out.
 */
export class DeadlineDash {
  constructor({ passage = '', timeLimit = 90, onComplete = () => {} } = {}) {
    this.passage = passage; this.timeLimit = timeLimit; this.onComplete = onComplete;
    this.typed = ''; this.elapsed = 0; this.active = false;
  }
  init()       { this.typed = ''; this.elapsed = 0; this.active = true; }
  update(dt)   { if (!this.active) return; this.elapsed += dt; if (this.elapsed >= this.timeLimit) this._end(false); }
  typeChar(ch) { if (!this.active) return; this.typed += ch; if (this.typed === this.passage) this._end(true); }
  get accuracy() {
    let ok = 0;
    for (let i = 0; i < this.typed.length; i++) if (this.typed[i] === this.passage[i]) ok++;
    return this.typed.length ? ok / this.typed.length : 0;
  }
  _end(ok)  { this.active = false; this.onComplete({ success: ok, accuracy: this.accuracy, elapsed: this.elapsed }); }
  destroy() { this.active = false; }
}
""")
commit("feat(minigames): implement DeadlineDash typing mini-game")

# 50
write("src/modules/minigames/MinigameManager.js", """/**
 * MinigameManager.js — Orchestrates mini-game lifecycle.
 */
export class MinigameManager {
  constructor(bus) { this.bus = bus; this.active = null; }
  launch(game) { this.active?.destroy(); this.active = game; game.init(); this.bus.emit('minigameStart', { game }); }
  update(dt)   { this.active?.update(dt); }
  end(result)  { const g = this.active; this.active = null; this.bus.emit('minigameEnd', { game: g, result }); }
}
""")
commit("feat(minigames): implement MinigameManager orchestrator")

# 51
write("src/modules/minigames/index.js", """export { ExamPanic }       from './ExamPanic.js';
export { CoffeeRush }      from './CoffeeRush.js';
export { DeadlineDash }    from './DeadlineDash.js';
export { MinigameManager } from './MinigameManager.js';
""")
commit("feat(minigames): add mini-games module barrel export")

# 52
write("src/modules/ui/HUD.js", """/**
 * HUD.js — Heads-up display DOM elements.
 */
export class HUD {
  constructor(root = document.body) { this.root = root; this._el = null; }
  mount() {
    this._el = document.createElement('div'); this._el.id = 'hud';
    this._el.innerHTML = `
      <div class="hud-bar hud-energy"><span class="hud-label">Energy</span><div class="hud-fill" id="hud-energy"></div></div>
      <div class="hud-bar hud-stress"><span class="hud-label">Stress</span><div class="hud-fill" id="hud-stress"></div></div>
      <div class="hud-stat" id="hud-gpa">GPA: 3.00</div>
      <div class="hud-stat" id="hud-date">Day 1 — 08:00</div>`;
    this.root.appendChild(this._el);
  }
  update({ energy, stress, gpa, day, hour, minute }) {
    document.getElementById('hud-energy').style.width = `${energy}%`;
    document.getElementById('hud-stress').style.width = `${stress}%`;
    document.getElementById('hud-gpa').textContent = `GPA: ${gpa.toFixed(2)}`;
    document.getElementById('hud-date').textContent =
      `Day ${day} — ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
  }
  unmount() { this._el?.remove(); this._el = null; }
}
""")
commit("feat(ui): implement HUD with energy/stress bars and stat display")

# 53
write("src/modules/ui/NotificationManager.js", """/**
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
""")
commit("feat(ui): implement NotificationManager with toast animations")

# 54
write("src/modules/ui/MainMenu.js", """/**
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
""")
commit("feat(ui): implement MainMenu with animated title and nav buttons")

# 55
write("src/modules/ui/PauseMenu.js", """/**
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
""")
commit("feat(ui): implement PauseMenu with resume, save, quit callbacks")

# 56
write("src/modules/ui/DialogueBox.js", """/**
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
""")
commit("feat(ui): implement DialogueBox connected to DialogueEngine")

# 57
write("src/modules/ui/Journal.js", """/**
 * Journal.js — Narrative log UI.
 */
export class Journal {
  constructor() { this._entries = []; this._el = null; }
  addEntry(e) { this._entries.push(e); this._render(); }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'journal'; this._el.className = 'journal glass';
    this._el.innerHTML = '<h2>Journal</h2><div class="journal-entries"></div>';
    root.appendChild(this._el); this._render();
  }
  _render() {
    if (!this._el) return;
    this._el.querySelector('.journal-entries').innerHTML = this._entries.map(e =>
      `<div class="journal-entry"><strong>${e.title}</strong> <span>Day ${e.day}</span><p>${e.body}</p></div>`
    ).join('');
  }
  show() { this._el?.classList.add('visible'); }
  hide() { this._el?.classList.remove('visible'); }
  unmount() { this._el?.remove(); this._el = null; }
}
""")
commit("feat(ui): implement Journal narrative log component")

# 58
write("src/modules/ui/LoadingScreen.js", """/**
 * LoadingScreen.js — Full-screen loading overlay with progress bar.
 */
export class LoadingScreen {
  constructor() { this._el = null; }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'loading-screen';
    this._el.innerHTML = `
      <div class="loading-content">
        <div class="loading-logo">Midnight Semester</div>
        <div class="loading-bar-track"><div class="loading-bar-fill" id="loading-fill"></div></div>
        <div class="loading-label" id="loading-label">Loading…</div>
      </div>`;
    root.appendChild(this._el);
  }
  setProgress(pct, label = '') {
    const f = document.getElementById('loading-fill'), l = document.getElementById('loading-label');
    if (f) f.style.width = `${Math.round(pct)}%`; if (l && label) l.textContent = label;
  }
  hide(delay = 400) {
    return new Promise(r => { this._el?.classList.add('fade-out'); setTimeout(() => { this._el?.remove(); r(); }, delay); });
  }
}
""")
commit("feat(ui): implement LoadingScreen with animated progress bar")

# 59
write("src/modules/ui/InventoryUI.js", """/**
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
""")
commit("feat(ui): implement InventoryUI grid panel")

# 60
write("src/modules/ui/SettingsMenu.js", """/**
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
""")
commit("feat(ui): implement SettingsMenu with volume and text speed controls")

# 61
write("src/modules/ui/AchievementPopup.js", """/**
 * AchievementPopup.js — Brief achievement unlock notification.
 */
export class AchievementPopup {
  constructor(notificationManager) { this.notif = notificationManager; }
  show(achievement) {
    this.notif.show(`🏆 Achievement: "${achievement.name}"`, { duration: 5000, type: 'success' });
  }
}
""")
commit("feat(ui): implement AchievementPopup notification")

# 62
write("src/modules/ui/index.js", """export { HUD }                 from './HUD.js';
export { NotificationManager } from './NotificationManager.js';
export { MainMenu }            from './MainMenu.js';
export { PauseMenu }           from './PauseMenu.js';
export { DialogueBox }         from './DialogueBox.js';
export { Journal }             from './Journal.js';
export { LoadingScreen }       from './LoadingScreen.js';
export { InventoryUI }         from './InventoryUI.js';
export { SettingsMenu }        from './SettingsMenu.js';
export { AchievementPopup }    from './AchievementPopup.js';
""")
commit("feat(ui): add complete UI module barrel export")

# 63
write("src/utils/math.js", """/** math.js — shared maths utilities */
export const lerp       = (a, b, t) => a + (b - a) * t;
export const invLerp    = (a, b, v) => (v - a) / (b - a);
export const remap      = (v, a1, b1, a2, b2) => lerp(a2, b2, invLerp(a1, b1, v));
export const clamp      = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
export const clamp01    = v => clamp(v, 0, 1);
export const deg2rad    = d => d * Math.PI / 180;
export const rad2deg    = r => r * 180 / Math.PI;
export const dist       = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
export const smoothstep = (a, b, t) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
""")
commit("feat(utils): add math.js with lerp, clamp, remap, smoothstep, seeded RNG")

# 64
write("src/utils/time.js", """/** time.js — in-game time formatting utilities */
export const formatTime = (h, m) =>
  `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
export function getPeriod(h) {
  if (h < 6)  return 'Night';
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  if (h < 21) return 'Evening';
  return 'Night';
}
export const realToGameMinutes = (s, scale = 2) => (s / 3600) * 60 * scale;
""")
commit("feat(utils): add time.js with formatTime, getPeriod, realToGameMinutes")

# 65
write("src/utils/storage.js", """/** storage.js — type-safe localStorage helpers */
export const storage = {
  get(k, fb = null)  { try { const r = localStorage.getItem(k); return r !== null ? JSON.parse(r) : fb; } catch { return fb; } },
  set(k, v)          { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  remove(k)          { localStorage.removeItem(k); },
  clear()            { localStorage.clear(); },
  has(k)             { return localStorage.getItem(k) !== null; },
};
""")
commit("feat(utils): add storage.js with type-safe localStorage helpers")

# 66
write("src/utils/dom.js", """/** dom.js — tiny DOM helper utilities */
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => r.querySelectorAll(s);
export function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else n[k] = v;
  }
  for (const c of children) n.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return n;
}
export const toggle = (e, c, f) => e?.classList.toggle(c, f);
""")
commit("feat(utils): add dom.js with query helpers and el factory")

# 67
write("src/utils/async.js", """/** async.js — Promise and async flow utilities */
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function retry(fn, n = 3, delay = 200) {
  for (let i = 0; i < n; i++) {
    try { return await fn(); } catch (e) { if (i === n - 1) throw e; await sleep(delay * 2 ** i); }
  }
}
export function withTimeout(p, ms, msg = 'Timed out') {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);
}
""")
commit("feat(utils): add async.js with sleep, retry, withTimeout")

# 68
write("src/utils/index.js", """export * from './math.js';
export * from './time.js';
export * from './storage.js';
export * from './dom.js';
export * from './async.js';
""")
commit("feat(utils): add utils barrel export")

# 69
write("src/modules/gameState.js", """/**
 * gameState.js — single source of truth for mutable runtime state.
 */
export const gameState = {
  day: 1, hour: 8, minute: 0, timeScale: 1,
  energy: 100, stress: 0, gpa: 3.0, social: 50, money: 200,
  flags: {}, chapter: 1, currentRoom: 'dormitory', paused: false, debug: false,
};
export function advanceTime(minutes) {
  gameState.minute += minutes;
  while (gameState.minute >= 60) { gameState.minute -= 60; gameState.hour++; }
  if (gameState.hour >= 24) { gameState.hour = 8; gameState.minute = 0; gameState.day++; return true; }
  return false;
}
export function setFlag(k, v = true) { gameState.flags[k] = v; }
export function getFlag(k) { return gameState.flags[k] ?? false; }
export function serializeState() { return JSON.parse(JSON.stringify(gameState)); }
export function deserializeState(s) { Object.assign(gameState, s); }
""")
commit("feat: expand gameState.js with time, flags, serialize/deserialize")

# 70
write(".eslintrc.json", """{
  "env": { "browser": true, "es2022": true },
  "extends": ["eslint:recommended"],
  "parserOptions": { "ecmaVersion": 2022, "sourceType": "module" },
  "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "eqeqeq": ["error", "always"],
    "prefer-const": "error",
    "no-var": "error"
  }
}
""")
commit("chore: add ESLint config with ES2022 module rules")

# 71
write(".prettierrc.json", """{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "arrowParens": "avoid"
}
""")
commit("chore: add Prettier config for consistent code formatting")

# 72
write(".editorconfig", """root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
[*.md]
trim_trailing_whitespace = false
""")
commit("chore: add .editorconfig for cross-editor consistency")

# 73
write("jsconfig.json", """{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "checkJs": true,
    "strict": false,
    "baseUrl": ".",
    "paths": { "@modules/*": ["src/modules/*"], "@/*": ["src/*"] }
  },
  "include": ["src/**/*.js"],
  "exclude": ["node_modules", "dist"]
}
""")
commit("chore: add jsconfig.json with path aliases for IDE support")

# 74
write("vite.config.js", """import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: { alias: { '@': path.resolve(__dirname, 'src'), '@modules': path.resolve(__dirname, 'src/modules') } },
  build: { outDir: 'dist', sourcemap: true, rollupOptions: { input: './index.html' } },
  server: { port: 5173, open: true },
});
""")
commit("chore: update vite.config.js with path aliases and build options")

# 75
write("package.json", """{
  "name": "midnight-semester",
  "version": "0.2.0",
  "description": "A college survival story — web game built with Vite",
  "type": "module",
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview",
    "lint":    "eslint src --ext .js",
    "format":  "prettier --write src"
  },
  "devDependencies": { "vite": "^5.2.0" },
  "keywords": ["game", "visual-novel", "college", "vite"],
  "author": "Jayanti29",
  "license": "MIT"
}
""")
commit("chore: bump package.json to v0.2.0 with lint and format scripts")

# 76
write("src/modules/ui/hud.css", """#hud { position: fixed; top: 1rem; left: 1rem; display: flex; flex-direction: column; gap: .4rem; z-index: 100; pointer-events: none; }
.hud-bar { display: flex; align-items: center; gap: .5rem; background: rgba(0,0,0,.5); border-radius: 999px; padding: .15rem .6rem; width: 180px; }
.hud-label { font-size: .6rem; text-transform: uppercase; letter-spacing: .08em; color: #aaa; min-width: 42px; }
.hud-fill { height: 6px; border-radius: 999px; transition: width .3s ease; flex: 1; }
.hud-energy .hud-fill { background: linear-gradient(90deg, #4ade80, #22d3ee); }
.hud-stress .hud-fill  { background: linear-gradient(90deg, #facc15, #f87171); }
.hud-stat { font-size: .7rem; color: #ccc; padding: .1rem .4rem; background: rgba(0,0,0,.4); border-radius: 4px; }
""")
commit("style(ui): add hud.css with energy/stress bars")

# 77
write("src/modules/ui/notifications.css", """#notifications { position: fixed; bottom: 1.5rem; right: 1.5rem; display: flex; flex-direction: column-reverse; gap: .5rem; z-index: 200; pointer-events: none; }
.notification { padding: .6rem 1.1rem; border-radius: 8px; font-size: .85rem; color: #fff; background: rgba(20,20,40,.9); backdrop-filter: blur(8px); border-left: 3px solid #6366f1; opacity: 0; transform: translateX(20px); transition: opacity .25s ease, transform .25s ease; }
.notification--visible { opacity: 1; transform: translateX(0); }
.notification--success { border-color: #4ade80; }
.notification--warning { border-color: #facc15; }
.notification--error   { border-color: #f87171; }
""")
commit("style(ui): add notifications.css with glassmorphism toast styles")

# 78
write("src/modules/ui/menus.css", """#main-menu { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: radial-gradient(ellipse at 50% 70%, #0d0d2b 0%, #000 100%); z-index: 300; }
#main-menu.visible { display: flex; }
.menu-bg { position: absolute; inset: 0; background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.3) 0%, transparent 100%), radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,.2) 0%, transparent 100%); background-size: 300px 300px; animation: starDrift 60s linear infinite; }
@keyframes starDrift { from { background-position: 0 0, 0 0 } to { background-position: 300px 300px, -300px -300px } }
.menu-title { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; background: linear-gradient(135deg, #a78bfa, #38bdf8, #f0abfc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.menu-subtitle { color: #94a3b8; font-size: 1.1rem; }
.menu-buttons { display: flex; flex-direction: column; gap: .75rem; width: 200px; }
.menu-buttons button { width: 100%; padding: .75rem; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; background: rgba(255,255,255,.05); color: #e2e8f0; cursor: pointer; transition: background .2s, transform .1s; }
.menu-buttons button:hover { background: rgba(99,102,241,.2); border-color: #6366f1; transform: translateY(-1px); }
#pause-menu { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); z-index: 250; }
#pause-menu.visible { display: flex; }
.pause-panel { background: rgba(15,15,35,.95); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 2.5rem 3rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
""")
commit("style(ui): add menus.css with animated main menu and pause overlay")

# 79
append("src/styles.css", """
/* ── CSS Design Tokens ───────────────────────────────────── */
:root {
  --color-bg: #08080f; --color-surface: #111122; --color-surface-2: #1a1a33;
  --color-border: rgba(255,255,255,0.08); --color-primary: #6366f1;
  --color-primary-glow: rgba(99,102,241,0.3); --color-accent: #a78bfa;
  --color-success: #4ade80; --color-warning: #facc15; --color-danger: #f87171;
  --color-text: #e2e8f0; --color-text-muted: #94a3b8;
  --font-base: 'Inter', system-ui, sans-serif; --font-mono: 'JetBrains Mono', monospace;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px; --radius-full: 9999px;
  --shadow-glow: 0 0 20px var(--color-primary-glow); --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --transition-fast: 0.15s ease; --transition-base: 0.25s ease; --transition-slow: 0.4s ease;
}
""")
commit("style: add CSS custom property design tokens")

# 80
append("src/styles.css", """
/* ── Utility Classes ─────────────────────────────────────── */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); border: 1px solid var(--color-border); }
.glow-primary { box-shadow: var(--shadow-glow); }
.fade-in { animation: fadeIn var(--transition-base) both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
.pulse { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
""")
commit("style: add utility classes (glass, glow, fade-in, pulse, spin)")

# 81
write("src/modules/audio/sfx.js", """/**
 * sfx.js — Procedural SFX buffer generators using Web Audio API.
 */
export function generateNoiseBurst(ctx, duration = 0.05, frequency = 0) {
  const rate = ctx.sampleRate, frames = Math.ceil(rate * duration);
  const buf = ctx.createBuffer(1, frames, rate), data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    const env = 1 - i / frames;
    data[i] = (Math.random() * 2 - 1) * env * 0.5
      + (frequency > 0 ? Math.sin(2 * Math.PI * frequency * i / rate) * env * 0.5 : 0);
  }
  return buf;
}
export function generateBlip(ctx, freq = 440, duration = 0.1) {
  const rate = ctx.sampleRate, frames = Math.ceil(rate * duration);
  const buf = ctx.createBuffer(1, frames, rate), data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++)
    data[i] = Math.sin(2 * Math.PI * freq * i / rate) * Math.sin(Math.PI * i / frames) * 0.4;
  return buf;
}
""")
commit("feat(audio): add sfx.js with procedural noise burst and blip generators")

# 82
write("src/modules/audio/dialogue.js", """/**
 * dialogue.js — Generates whisper audio buffers.
 */
export function generateWhisper(ctx, duration = 0.5) {
  const rate = ctx.sampleRate, frames = Math.ceil(rate * duration);
  const buf = ctx.createBuffer(1, frames, rate), data = buf.getChannelData(0);
  let prev = 0;
  for (let i = 0; i < frames; i++) {
    const n = Math.random() * 2 - 1;
    prev = prev * 0.97 + n * 0.03;
    data[i] = (n - prev) * Math.sin(Math.PI * i / frames) * 0.3;
  }
  return buf;
}
""")
commit("feat(audio): add dialogue.js whisper buffer generator")

# 83
write("src/modules/audio/AudioManager.js", """/**
 * AudioManager.js — Central coordinator for all game audio.
 */
import { generateNoiseBurst, generateBlip } from './sfx.js';
import { generateWhisper } from './dialogue.js';
export class AudioManager {
  constructor() { this._ctx = null; this._master = null; this._sfx = null; this._music = null; }
  init() {
    if (this._ctx) return;
    this._ctx = new AudioContext();
    this._master = this._ctx.createGain();
    this._sfx    = this._ctx.createGain();
    this._music  = this._ctx.createGain();
    this._sfx.connect(this._master); this._music.connect(this._master); this._master.connect(this._ctx.destination);
  }
  setMasterVolume(v) { this._master?.gain.setTargetAtTime(v, this._ctx.currentTime, 0.01); }
  setSFXVolume(v)    { this._sfx?.gain.setTargetAtTime(v, this._ctx.currentTime, 0.01); }
  setMusicVolume(v)  { this._music?.gain.setTargetAtTime(v, this._ctx.currentTime, 0.01); }
  _play(buf, gain) { if (!this._ctx) return; const s = this._ctx.createBufferSource(); s.buffer = buf; s.connect(gain); s.start(); }
  playSFX(type = 'click') { this.init(); this._play(type === 'blip' ? generateBlip(this._ctx) : generateNoiseBurst(this._ctx), this._sfx); }
  playWhisper() { this.init(); this._play(generateWhisper(this._ctx), this._sfx); }
  suspend() { this._ctx?.suspend(); }
  resume()  { this._ctx?.resume(); }
}
""")
commit("refactor(audio): consolidate AudioManager with SFX and whisper support")

# 84
write("src/modules/audio/index.js", """export { AudioManager }                      from './AudioManager.js';
export { generateNoiseBurst, generateBlip }  from './sfx.js';
export { generateWhisper }                   from './dialogue.js';
""")
commit("refactor(audio): update audio barrel to export all public APIs")

# 85
write("src/modules/README.md", """# Module Boundaries

| Module | Responsibility | Public API |
|---|---|---|
| `audio` | Web Audio SFX / music | `AudioManager` |
| `character` | Sprite controller + animator | `CharacterController`, `CharacterAnimator` |
| `core` | Game loop, renderer, event bus, camera | `GameLoop`, `Renderer`, `EventBus`, `Camera`, `AssetLoader`, `DebugOverlay` |
| `flow` | Game state machine + save/load + achievements | `FlowController`, `SaveManager`, `AchievementManager` |
| `input` | Keyboard / pointer state | `InputManager` |
| `interaction` | Player↔world trigger zones | `InteractionSystem`, `Interactable` |
| `level` | Level loading + room management | `LevelManager`, `Room`, `CollisionMap` |
| `minigames` | Embedded mini-game logic | `ExamPanic`, `CoffeeRush`, `DeadlineDash`, `MinigameManager` |
| `npc` | NPC AI + dialogue trees | `NPC`, `DialogueEngine` |
| `player` | Player facade (stats + movement + inventory) | `Player`, `PlayerStats`, `Inventory` |
| `textures` | Procedural canvas textures | `TextureGenerator` |
| `ui` | HUD, menus, notifications, dialogs | `HUD`, `MainMenu`, `PauseMenu`, `NotificationManager`, `DialogueBox`, `Journal`, `LoadingScreen`, `InventoryUI`, `SettingsMenu` |

## Rules
1. Modules communicate via `EventBus` — no direct cross-module imports.
2. `gameState.js` is the single source of truth.
3. All exported functions must have JSDoc comments.
""")
commit("docs(modules): update README with complete module boundary table")

# 86
write("docs/ROADMAP.md", """# Roadmap

## v0.2.0 — Module Scaffolding ✅
All 12 modules scaffolded with documented APIs, tooling configured.

## v0.3.0 — Vertical Slice
- [ ] Wire EventBus across all modules in `main.js`
- [ ] First playable loop: dorm → campus → library → exam mini-game
- [ ] 5 campus rooms in `campus-layout.json`
- [ ] HUD integrated into game loop
- [ ] Basic collision detection

## v0.4.0 — NPC & Narrative
- [ ] 5 NPCs with full dialogue trees
- [ ] Journal collecting entries from events
- [ ] GPA calculation from mini-game performance
- [ ] Day/night cycle visual changes

## v0.5.0 — Polish & Endings
- [ ] 3 unique endings based on final stats
- [ ] Achievement system (10 achievements)
- [ ] Ambient audio tracks per location
- [ ] Full Save/Load via SaveManager

## v1.0.0 — Release
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Mobile touch controls
- [ ] GitHub Pages deployment
- [ ] Trailer video
""")
commit("docs: add ROADMAP.md with version milestones")

# 87
write("docs/SECURITY.md", """# Security Policy

## Scope
Midnight Semester is a client-side web game with no server component.
All data is stored in `localStorage` — nothing is transmitted externally.

## Reporting Issues
Open a GitHub issue with the label `security`.

## Known Risks
| Risk | Mitigation |
|---|---|
| Save data tampering | Saves are local only; no server validation needed |
| Third-party CDN | No CDN dependencies — all assets are bundled |
| Clickjacking | Set `X-Frame-Options` header on hosting provider |
""")
commit("docs: add SECURITY.md policy for client-side web game")

# 88
write("docs/GLOSSARY.md", """# Glossary

| Term | Definition |
|---|---|
| **EventBus** | Pub/sub system for inter-module communication |
| **GameLoop** | Fixed-timestep loop driving update and render |
| **Interactable** | World object the player triggers with E key |
| **Mini-game** | Short embedded gameplay sequence with `init/update/destroy` |
| **NPC** | Non-player character with state machine and dialogue tree |
| **Room** | Named area in the campus layout with bounds and exits |
| **Stat** | Player attribute (energy, stress, GPA, social, money) |
| **Flag** | Boolean narrative marker in `gameState.flags` |
| **Barrel export** | `index.js` that re-exports all public symbols from a module |
| **Dialogue tree** | JSON structure defining NPC conversation branches |
""")
commit("docs: add GLOSSARY.md with project-specific terminology")

# 89
write("docs/ACCESSIBILITY.md", """# Accessibility Guide

## Standards
Target: WCAG 2.1 Level AA.

## Implemented
- Semantic HTML5 elements throughout UI components
- `aria-label` on interactive icon-only buttons
- Focus ring styles on all interactive elements
- `.sr-only` utility for screen-reader-only content
- Keyboard navigation: Tab, Enter, Escape, WASD

## Planned
- [ ] Full keyboard control of all menu systems
- [ ] High-contrast mode toggle
- [ ] Reduced-motion mode (respects `prefers-reduced-motion`)
- [ ] Screen-reader-friendly dialogue with live regions
- [ ] Colour-blind friendly palette options
""")
commit("docs: add ACCESSIBILITY.md with WCAG targets and checklist")

# 90
write("docs/PERFORMANCE.md", """# Performance Guide

## Targets
| Metric | Target |
|---|---|
| FPS | Stable 60 on mid-range hardware |
| Initial load | < 2 s on 4G |
| Bundle size | < 500 KB gzipped |
| Memory | < 100 MB after 10 min |

## Strategies
- **Procedural audio** — no audio file downloads
- **Canvas 2D** — no WebGL overhead for this art style
- **Viewport culling** — `Camera.isVisible()` skips off-screen draw calls
- **Object pooling** — reuse particle and SFX nodes
- **content-visibility: auto** — deferred rendering for off-screen panels
""")
commit("docs: add PERFORMANCE.md with targets and optimisation strategies")

# 91
os.makedirs(".github/ISSUE_TEMPLATE", exist_ok=True)
write(".github/ISSUE_TEMPLATE/bug_report.md", """---
name: Bug Report
about: Report a bug in Midnight Semester
labels: bug
---

## Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behaviour
What should have happened.

## Actual Behaviour
What actually happened.

## Environment
- Browser:
- OS:
- Version:
""")
commit("chore: add GitHub bug report issue template")

# 92
write(".github/ISSUE_TEMPLATE/feature_request.md", """---
name: Feature Request
about: Suggest a new feature
labels: enhancement
---

## Problem
What problem does this feature solve?

## Proposed Solution
Describe your proposed solution.

## Alternatives Considered
Any alternative approaches considered.

## Additional Context
Screenshots, mockups, references.
""")
commit("chore: add GitHub feature request issue template")

# 93
write(".github/pull_request_template.md", """## Summary
Brief description of the changes.

## Type of Change
- [ ] feat: new feature
- [ ] fix: bug fix
- [ ] refactor: code restructure
- [ ] docs: documentation
- [ ] chore: build / tooling

## Testing
Describe how you tested your changes.

## Checklist
- [ ] Code follows project style (`npm run lint`)
- [ ] Self-review completed
- [ ] CHANGELOG.md updated
- [ ] Docs updated if needed
""")
commit("chore: add GitHub pull request template")

# 94
os.makedirs(".github/workflows", exist_ok=True)
write(".github/workflows/lint.yml", """name: Lint
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
""")
commit("chore: add GitHub Actions lint CI workflow")

# 95
write(".github/workflows/build.yml", """name: Build
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }
""")
commit("chore: add GitHub Actions build CI workflow")

# 96
append("CHANGELOG.md", """
## [0.2.0] — 2026-07-18

### Added
- 10 documentation files in `docs/`
- 12 module directories fully scaffolded with barrel exports
- Core engine: `GameLoop`, `Renderer`, `EventBus`, `Camera`, `AssetLoader`, `DebugOverlay`
- Player system: `Player`, `PlayerStats`, `Inventory`
- NPC system: `NPC`, `DialogueEngine`, 4 dialogue JSON files
- Game flow: `FlowController`, `SaveManager`, `AchievementManager`
- Mini-games: `ExamPanic`, `CoffeeRush`, `DeadlineDash`, `MinigameManager`
- UI: `HUD`, `MainMenu`, `PauseMenu`, `NotificationManager`, `DialogueBox`, `Journal`, `LoadingScreen`, `InventoryUI`, `SettingsMenu`, `AchievementPopup`
- Utilities: `math.js`, `time.js`, `storage.js`, `dom.js`, `async.js`
- CSS design tokens and utility classes
- Tooling: ESLint, Prettier, EditorConfig, jsconfig, vite path aliases
- GitHub Actions: lint.yml, build.yml
- GitHub: issue templates, PR template
""")
commit("chore: update CHANGELOG.md with v0.2.0 additions")

# 97
append("PROGRESS.md", """
---
## Track D — Module Scaffolding & Tooling (2026-07-18)

### Completed
- [x] All 12 module directories scaffolded with barrel exports
- [x] Core engine: GameLoop, Renderer, EventBus, Camera, AssetLoader, DebugOverlay
- [x] Player: Player, PlayerStats, Inventory + character system
- [x] NPC: NPC, DialogueEngine + 4 dialogue JSON files
- [x] Flow: FlowController, SaveManager, AchievementManager
- [x] Mini-games: ExamPanic, CoffeeRush, DeadlineDash, MinigameManager
- [x] UI: 10 components including HUD, menus, overlays
- [x] Audio: AudioManager, sfx.js, dialogue.js fully consolidated
- [x] Utils: math, time, storage, dom, async
- [x] CSS design tokens, utility classes, component stylesheets
- [x] Tooling: ESLint, Prettier, EditorConfig, jsconfig
- [x] CI/CD: GitHub Actions lint + build workflows

### Next Steps
- [ ] Connect EventBus across all modules in main.js
- [ ] First playable vertical slice
- [ ] Populate campus-layout.json with full room data
""")
commit("chore: update PROGRESS.md with Track D scaffolding summary")

# 98
append("README.md", """
## Module Structure
All game logic lives under `src/modules/`. Each module exposes a public API via its `index.js`.
See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full overview.

## Quick Start
```bash
npm install && npm run dev
```

## Documentation
| File | Contents |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | High-level system design |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Commit conventions & PR guide |
| [AUDIO_SYSTEM.md](docs/AUDIO_SYSTEM.md) | Audio module docs |
| [NPC_SYSTEM.md](docs/NPC_SYSTEM.md) | NPC dialogue & AI |
| [MINIGAMES.md](docs/MINIGAMES.md) | Mini-game registry |
| [LEVEL_DESIGN.md](docs/LEVEL_DESIGN.md) | Level & room schema |
| [PLAYER_MECHANICS.md](docs/PLAYER_MECHANICS.md) | Stats & controls |
| [TESTING.md](docs/TESTING.md) | Testing strategy |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Build & deploy |
| [ROADMAP.md](docs/ROADMAP.md) | Version milestones |
""")
commit("docs: update README with module structure and documentation index")

# 99
append("NOTES.md", """
---
## Track D Complete — 2026-07-18

Module scaffolding pass complete. The project now has:
- **12 feature modules** each with barrel exports and documented APIs
- **5 utility modules** (math, time, storage, dom, async)
- **10+ documentation files** covering every major system
- **Comprehensive CSS** design tokens and utility classes
- **Proper tooling**: ESLint, Prettier, EditorConfig, jsconfig
- **CI/CD**: GitHub Actions lint and build workflows

### Architecture decisions
1. **Fixed-timestep game loop** — prevents physics inconsistencies
2. **Procedural audio only** — no external files, small bundle
3. **JSON dialogue trees** — writers author NPC conversations without touching code
4. **CSS custom properties** — enables runtime theming
5. **EventBus communication** — flat dependency graph, independently testable modules
""")
commit("docs: add Track D completion notes")

# 100
append("StoryBible.md", """
---
## Update — 2026-07-18

### Endings Detail

| Ending | Condition | Final Scene |
|---|---|---|
| **Graduate** | GPA ≥ 3.0 AND Social ≥ 60 | Graduation ceremony, letter from Professor Chen |
| **Dropout** | GPA < 2.0 | Packing boxes in the dorm, bittersweet monologue |
| **Burned Out** | Stress = 100 | Waking up in the campus clinic, reflective ending |

### Campus Rooms (v0.3.0 target)
1. **Dormitory** — starting room, has computer, bed, roommate NPC
2. **Main Hall** — hub, connects to all buildings
3. **Library** — ExamPanic mini-game trigger, Librarian NPC
4. **Cafeteria** — CoffeeRush mini-game, Barista NPC, energy refill
5. **Science Block** — DeadlineDash mini-game, late-night study spots

### Character Arc Notes
The player character starts overwhelmed and ends — depending on choices — either
resilient, defeated, or transformed. All endings avoid cheap moralising.
""")
commit("docs: update StoryBible with endings detail and campus room targets")

# ── PUSH ────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"  ✅  {COUNT[0]} commits created locally!")
print("  📤  Pushing to origin/main ...")
print("=" * 60)
subprocess.run(["git", "push", "origin", "main"], check=True)
print()
print("=" * 60)
print(f"  🎉  All {COUNT[0]} commits pushed to GitHub!")
print("  👉  https://github.com/Jayanti29/MIDNIGHT-SEMESTER")
print("=" * 60)
