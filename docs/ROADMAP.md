# Roadmap

The project is a feature-rich prototype. The items below track stabilization and release verification, not a claim that every source-level feature has shipped or passed QA.

## Stabilization (In Progress)

- [x] Repair live HUD bindings and add markup-contract tests
- [x] Resolve Player 2 keyboard/gamepad sprint and interaction conflicts
- [x] Make controller actions edge-triggered and animation timers time-based
- [x] Fix narrow character-select layout and add Back/Escape navigation
- [x] Add mobile virtual-stick movement
- [x] Register `npm test` and run it in CI
- [ ] Replace fixture/copy-based tests with tests of core game systems
- [ ] Add browser E2E coverage for start, settings, pause, inventory, and restart

## Device And Accessibility Verification

- [ ] Verify touch movement/look/actions on physical iOS and Android devices
- [ ] Verify two-controller co-op and the full keyboard mapping
- [ ] Complete keyboard focus order, screen-reader dialogue, and reduced-motion checks
- [ ] Inspect every avatar, accessory, animation pose, and camera angle in both levels

## Release Gate

- [ ] Complete fresh-save playthroughs of both levels and all four endings
- [ ] Verify checkpoint/continue and ending-archive persistence
- [ ] Profile startup, mobile performance, and 10-minute GPU/memory behavior
- [ ] Reduce the production bundle and resolve lint warnings
- [ ] Complete the remaining accessibility and regression checks
