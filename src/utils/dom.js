/** dom.js — tiny DOM helper utilities */
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => r.querySelectorAll(s);
export function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else n[k] = v;
  }
  for (const c of children) n.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return n;
}
export const toggle = (e, c, f) => e?.classList.toggle(c, f);
