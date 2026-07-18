# Security Policy

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
