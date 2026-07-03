# Deployment

## Static Hosting

The app is a Vite static build. Use:

```bash
npm install
npm run check
npm run build
```

Deploy the generated `dist/` directory.

## GitHub Pages

`vite.config.js` uses `base: "./"` so built assets work from a repository subpath.

## Local Verification

Use the dev server while developing:

```bash
npm run dev
```

Use preview before shipping:

```bash
npm run preview
```
