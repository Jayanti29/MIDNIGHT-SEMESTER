/**
 * sfx.js — Procedural SFX buffer generators using Web Audio API.
 */
export function generateNoiseBurst(ctx, duration = 0.05, frequency = 0) {
  const rate = ctx.sampleRate, frames = Math.ceil(rate * duration);
  const buf = ctx.createBuffer(1, frames, rate), data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    const env = 1 - i / frames;
    data[i] = (Math.random() * 2 - 1) * env * 0.5
      + (frequency > 0 ? Math.sin(2 * Math.PI * frequency * i / rate) * env * 0.5 : 0);
  }
  return buf;
}
export function generateBlip(ctx, freq = 440, duration = 0.1) {
  const rate = ctx.sampleRate, frames = Math.ceil(rate * duration);
  const buf = ctx.createBuffer(1, frames, rate), data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++)
    data[i] = Math.sin(2 * Math.PI * freq * i / rate) * Math.sin(Math.PI * i / frames) * 0.4;
  return buf;
}
