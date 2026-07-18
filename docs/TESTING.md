# Testing Strategy

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
