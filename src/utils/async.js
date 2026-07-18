/** async.js — Promise and async flow utilities */
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function retry(fn, n = 3, delay = 200) {
  for (let i = 0; i < n; i++) {
    try { return await fn(); } catch (e) { if (i === n - 1) throw e; await sleep(delay * 2 ** i); }
  }
}
export function withTimeout(p, ms, msg = 'Timed out') {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);
}
