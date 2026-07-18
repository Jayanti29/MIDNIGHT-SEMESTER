# Deployment

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
