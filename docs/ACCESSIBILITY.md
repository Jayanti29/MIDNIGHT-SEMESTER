# Accessibility Guide

## Standards
Target: WCAG 2.1 Level AA.

## Implemented
- Semantic HTML5 elements throughout UI components
- `aria-label` on interactive icon-only buttons
- Focus ring styles on all interactive elements
- `.sr-only` utility for screen-reader-only content
- Modal focus trapping for Tab / Shift+Tab and Escape handling
- Character-selection focus entry and return to its menu opener
- Keyboard navigation for gameplay and menu controls (coverage still incomplete)

## Planned
- [ ] Verify keyboard focus order and modal behavior across all menu systems
- [ ] High-contrast mode toggle
- [ ] Reduced-motion mode (respects `prefers-reduced-motion`)
- [ ] Screen-reader-friendly dialogue with live regions
- [ ] Colour-blind friendly palette options
