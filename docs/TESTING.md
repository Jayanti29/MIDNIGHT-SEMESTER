# Testing Status

## Automated Checks

Run the configured Node checks with:

```bash
npm test
```

The current suite contains 12 checks. Four cover production animation/gamepad/touch behavior or the HUD-to-markup ID contract; the earlier eight primarily validate static fixtures and copied calculations. There is no coverage instrumentation, so these checks do not demonstrate an 80% coverage target or full feature correctness.

Run the production build and lint separately:

```bash
npm run build
npm run lint
```

There is currently no Playwright dependency or `test:e2e` script. Browser testing is manual and has not covered every ending or device/controller combination.

## Manual QA Checklist

- [ ] New Game, Continue, pause, settings, inventory, restart, and return-to-menu flows
- [ ] Evidence collection, door locks, checkpoint restore, and Level 1/Level 2 completion
- [ ] All NPC dialogue paths and mini-games
- [ ] All four ending choices and ending archive persistence
- [ ] Co-op keyboard controls and two-controller mappings
- [ ] Mouse sensitivity range, pointer lock, touch look, and mobile layout
- [ ] Character variants, accessories, animation poses, and camera clipping
- [ ] Audio levels, subtitle settings, and a 10-minute memory/performance run
- [ ] Keyboard-only focus order and screen-reader dialogue behavior
