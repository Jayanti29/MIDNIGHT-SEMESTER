# Performance Guide

## Targets
| Metric | Target |
|---|---|
| FPS | Stable 60 on mid-range hardware |
| Initial load | < 2 s on 4G |
| Bundle size | < 500 KB gzipped |
| Memory | < 100 MB after 10 min |

## Strategies
- **Procedural audio** — no audio file downloads
- **Canvas 2D** — no WebGL overhead for this art style
- **Viewport culling** — `Camera.isVisible()` skips off-screen draw calls
- **Object pooling** — reuse particle and SFX nodes
- **content-visibility: auto** — deferred rendering for off-screen panels
