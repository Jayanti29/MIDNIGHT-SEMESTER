# Midnight Semester Project Audit

**Audit date:** 2026-10-01
**Overall assessment:** The baseline project was not release-ready. Several confirmed HUD, input, animation, and mobile UI defects have since been fixed, but full playthroughs, device/controller testing, and several architecture/accessibility issues remain open.

This is an evidence-based audit, not a claim that every story branch was completed. Findings below distinguish reproduced behavior from source-confirmed defects and risks that still need a full playthrough.

## Audit Scope

Checked the live Vite app in the integrated browser at 540x395 and 390x844, followed New Game through character selection into gameplay, tested Escape while character selection was open, inspected settings/control wiring and relevant modules, and compared literal `getElementById()` calls against the IDs in `index.html`.

Commands run:

- `npm run build`: passed; Vite emitted a large-chunk warning.
- `npm run lint`: completed with 81 warnings and 0 errors.
- `node tests/run-game-tests.js`: 8 passed, 0 failed.
- `npm test`: failed because no `test` script exists.
- `npm run`: lists no test or E2E script.

These command results describe the original audit baseline. The current test command and remediation status are listed below.

## Remediation Update

- **Fixed:** Gameplay HUD IDs; P2 sprint/interact/flashlight bindings; P1/P2 gamepad press repetition; frame-rate-dependent reach timer; mobile character-select horizontal clipping; missing character-select Back/Escape path; missing touch movement; heartbeat-node null crash; outdated Player Mechanics guide; missing page title and incorrect canvas description.
- **Partially fixed:** `npm test` is now configured and runs 12 checks, including four checks against production code or markup; CI runs it. Eight legacy checks remain fixture/copy-based, there is no coverage instrumentation, and no Playwright/E2E suite exists.
- **Partially fixed:** Character selection now has a Back button, Escape handling, focus return, and focus entry. Modal focus trapping is implemented but was not conclusively verified in the hidden browser; screen-reader behavior remains untested.
- **Partially fixed:** README dependency versions, controls, story-bible link, and prototype status are corrected. Other architecture/module documentation and the roadmap still need reconciliation.
- **Still open:** Stale extracted UI modules, main-module/architecture mismatch, large-bundle warning, 81 lint warnings, full ending/level/save/audio/character QA, and physical mobile/controller testing. The virtual joystick is implemented but has not been tested on a physical phone.

## Baseline Findings

### High

**A-01: Gameplay HUD values do not update.** The state updater looks up nonexistent IDs such as `gameplayState.battery-p1-meter`, `gameplayState.fear-p1-val`, `breath-p1-val`, and `noise-p1-val`. The live page defines `battery-meter`, `fear-meter`, `breath-p1-text`, and `noise-p1` instead. The lookups return `null`, so battery/fear text and meter bars remain at their initial markup values; breath/noise labels also remain stale. P2 HUD selectors are similarly mismatched. This makes important gameplay feedback unreliable or false. See [state.js](../src/modules/player/state.js) and [index.html](../index.html).

**A-02: Automated tests are not part of the normal test command and do not test gameplay code.** `npm test` fails with “Missing script: test”; the documented `npm run test:e2e` is also absent. The standalone eight-case script passes, but most assertions recreate expected values in local objects or test hand-written math rather than importing movement, game state, UI, or character code. CI only runs lint/build. The stated 80% coverage target is unsupported by any configured coverage tool. See [package.json](../package.json), [run-game-tests.js](../tests/run-game-tests.js), [TESTING.md](TESTING.md), and [workflows](../.github/workflows).

### Medium

**A-03: Character selection clips horizontally on a phone-sized viewport.** At 390x844, the dialog is 358px wide but the preview canvas starts at x=-60, outside the viewport/dialog. The preview and parts of the two-column content are therefore clipped; key customization controls compete for a layout that does not fit. See [index.html](../index.html) and [styles.css](../src/styles.css).

**A-04: There is no way to cancel character selection.** The dossier has a confirm action but no Back/Cancel control. Pressing Escape while it is open leaves it open; this was reproduced in the browser. A player who enters New Game or Co-op cannot return to the main menu through the visible or Escape-key UI. See [index.html](../index.html) and the Escape handling in [main.js](../src/main.js).

**A-05: Player 2's keyboard interact and sprint controls conflict.** `ShiftRight` calls `inspectNearest2()` on keydown and is also read continuously as Player 2's sprint key. One key therefore interacts when pressed and sprints while held. See [main.js](../src/main.js) and [movement.js](../src/modules/player/movement.js).

**A-06: Player 2 gamepad sprint does not take effect.** The code sets `gpSprint = true` from the P2 controller's L3 button, but `sprint2` and `speed2` are calculated before this value is set, and `gpSprint` is never used afterward. The documented L3 sprint mapping is consequently ineffective for P2. See [movement.js](../src/modules/player/movement.js).

**A-07: Held Player 1 gamepad face buttons repeat actions every frame.** The movement loop calls `inspectNearest()` whenever button 0 is pressed and toggles the flashlight whenever button 2 is pressed. These are held-state checks with no just-pressed/debounce handling, so holding a button repeatedly interacts and rapidly toggles the flashlight. See [movement.js](../src/modules/player/movement.js).

**A-08: Reach animation duration depends on display frame rate.** `reachTimer` is reduced by a hard-coded `0.016` on every animation update, while the animation loop runs once per rendered frame. The interaction reach therefore lasts different real times at 30, 60, and 120+ FPS. The update should use elapsed delta time. See [character.js](../src/modules/character/character.js) and [main.js](../src/main.js).

**A-09: Modal accessibility behavior is incomplete.** Several overlays declare `role="dialog"` and `aria-modal="true"`, but focus is not moved into the dialog, trapped there, or returned to the opener. Escape also fails to close character selection. The accessibility document explicitly leaves full keyboard support and screen-reader dialogue behavior planned, so the WCAG AA target is not yet demonstrated. See [ACCESSIBILITY.md](ACCESSIBILITY.md), [index.html](../index.html), and [main.js](../src/main.js).

**A-10: Extracted UI modules are stale and not integrated with the live markup.** `HUD.js` expects Energy/Stress/GPA/Date IDs that do not exist in the current horror HUD, and `LoadingScreen.js` expects `loading-fill`/`loading-label` instead of `loading-progress`/`loading-status`. A literal-ID scan found 26 references absent from the initial HTML; some are intentionally created dynamically during WebGL recovery, while the dead UI modules and live HUD mismatches above are genuine integration defects. The modules are not imported by the running app, so they create misleading APIs rather than working components. See [HUD.js](../src/modules/ui/HUD.js), [LoadingScreen.js](../src/modules/ui/LoadingScreen.js), [modules README](../src/modules/README.md), and [index.html](../index.html).

### Low / Project Quality

**A-11: Project documentation contradicts the implementation and itself.** Examples: README advertises Vite 7 while the package/build use Vite 5; it describes Three.js r177 while the dependency is Three.js 0.185.x; `package.json` reports 0.2.0 while README advertises a v0.3.0 rebuild; README marks later phases complete while [ROADMAP.md](ROADMAP.md) still lists the first playable loop, HUD integration, and save/load as incomplete; the testing guide describes three endings while the current UI exposes four ending choices. These conflicts make the actual scope and release state impossible to assess from docs alone. See [README.md](../README.md), [package.json](../package.json), [ROADMAP.md](ROADMAP.md), and [TESTING.md](TESTING.md).

**A-12: Player mechanics documentation describes another game model.** It lists Energy, Stress, GPA, Social, a day cycle, and `J` for Journal, while the live game uses fear, sanity, flashlight battery, evidence, and an in-world journal. No `KeyJ` handler was found. This guide should not be treated as the current control or gameplay specification. See [PLAYER_MECHANICS.md](PLAYER_MECHANICS.md) and [main.js](../src/main.js).

**A-13: The advertised module architecture is not the runtime architecture.** The module guide says `gameState.js` is the single state source and modules communicate through EventBus, but `main.js` still owns the game state and directly coordinates movement, rendering, input, UI, story, and systems. `InputManager` and multiple UI/core/flow facades are not wired into the live loop. The 5,000+ line entry module remains a regression and testability risk. See [modules README](../src/modules/README.md), [gameState.js](../src/modules/gameState.js), and [main.js](../src/main.js).

**A-14: Build output is a large single JavaScript chunk.** `npm run build` emits a 750 KB minified JS asset and Vite warns above 500 KB. Startup succeeded in the audit browser, but lower-end/mobile download and parse performance have not been measured. Consider code splitting/deferred loading for non-startup systems and profile on target phones. See [package.json](../package.json) and [vite.config.js](../vite.config.js).

**A-15: Lint is green only because warnings are non-fatal.** ESLint reports 79 warnings, including unused imports/state and DOM references, unused animation variables, and unused gamepad state. This does not currently block builds, but it obscures real regressions and contradicts claims of a clean lint pass. See [main.js](../src/main.js), [movement.js](../src/modules/player/movement.js), and [character.js](../src/modules/character/character.js).

**A-16: Small accessibility/metadata defects remain.** The HTML has no document `<title>`. The game canvas is labeled “First-person” although the active movement code runs a third-person follow camera. Screen-reader users receive an inaccurate description, and the browser tab is unnamed. See [index.html](../index.html) and [movement.js](../src/modules/player/movement.js).

## Character / Avatar Status

The character dossier preview does render a WebGL canvas, and the source applies model variants, colors, accessories, and body scale when creating the preview/player mesh. The avatar is procedurally assembled from primitive geometry and bone-parented parts rather than an imported, fully skinned character asset; the project’s “anime-realistic” wording is therefore a quality claim, not a verified visual result. The interaction reach animation has the frame-rate defect in A-08. Mobile clipping in A-03 also cuts into the preview area.

A full animation/clip-through assessment was not completed: this audit did not systematically inspect every model, hair/accessory combination, chair interaction, camera angle, or character on both levels. No claim is made that all avatars are broken.

## Completion And Verification Gaps

The browser check verified that the app boots, the main menu opens character selection, the character preview renders, confirming the dossier enters gameplay, and intro dialogue appears without a fatal overlay. The browser reported Three.js deprecation warnings for `THREE.Clock` and `PCFSoftShadowMap`; no startup exception was observed. Mouse sensitivity is wired into both pointer-lock and drag-look code paths, so no source-level wiring failure was found; actual sensitivity range was not measured with physical mouse input. Gamepad look speed is hard-coded separately from the mouse setting.

These high-value flows remain unverified and need real playthroughs/tests:

- Complete Level 1 and Level 2 from a fresh save, including collision/door navigation and all required evidence.
- Reach every ending and confirm prerequisites, choice text, epilogues, and ending archive persistence.
- Save/checkpoint/continue/restart round trips, including collected items, doors, settings, and character customization.
- Co-op with two keyboards and two physical controllers, including every mapping and split-screen HUD.
- Pointer-lock, mouse sensitivity at minimum/maximum, touch camera controls, and mobile quick actions on actual mobile browsers.
- All character models/accessories/poses, reach and sit/stand transitions, and camera/avatar clipping.
- Audio mix, subtitle toggle behavior, and long-session GPU/memory stability.
- Keyboard-only and screen-reader operation, focus order, focus restoration, and reduced-motion behavior.

## Outstanding Recommended Work

1. Add browser E2E coverage for settings, pause, inventory, restart, level completion, and all endings; verify save/checkpoint behavior.
2. Run physical mobile and two-controller tests, including movement/look/action overlap and split-screen HUD behavior.
3. Complete avatar/pose/camera inspection, keyboard focus trapping, screen-reader dialogue, and reduced-motion checks.
4. Reconcile the remaining roadmap/module architecture claims and either integrate or remove the stale UI facades.
5. Reduce the production bundle and resolve the 81 non-fatal lint warnings.
