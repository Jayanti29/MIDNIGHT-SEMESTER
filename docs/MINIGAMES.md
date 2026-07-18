# Mini-Games

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
