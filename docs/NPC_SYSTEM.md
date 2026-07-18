# NPC System

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
