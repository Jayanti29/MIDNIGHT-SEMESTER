# Module Boundaries

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
