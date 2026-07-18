/**
 * dialogue.js — Generates whisper audio buffers.
 */
export function generateWhisper(ctx, duration = 0.5) {
  const rate = ctx.sampleRate, frames = Math.ceil(rate * duration);
  const buf = ctx.createBuffer(1, frames, rate), data = buf.getChannelData(0);
  let prev = 0;
  for (let i = 0; i < frames; i++) {
    const n = Math.random() * 2 - 1;
    prev = prev * 0.97 + n * 0.03;
    data[i] = (n - prev) * Math.sin(Math.PI * i / frames) * 0.3;
  }
  return buf;
}
