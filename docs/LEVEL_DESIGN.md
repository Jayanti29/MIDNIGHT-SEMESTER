# Level Design Guide

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
