/**
 * dialogue.js — Generates whisper audio buffers and handles voice line playback hooks.
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

export const dialogueQueue = [];
let currentVoiceLine = null;

export function triggerVoiceLine(speaker, text, audioKey = "whisper") {
  const dialogueEl = document.getElementById("dialogue");
  const speakerEl = document.getElementById("speaker");
  const lineEl = document.getElementById("line");

  if (speakerEl) speakerEl.textContent = speaker.toUpperCase();
  if (lineEl) lineEl.textContent = text;
  if (dialogueEl) {
    dialogueEl.style.display = "block";
    dialogueEl.classList.add("open");
  }

  currentVoiceLine = { speaker, text, audioKey, time: Date.now() };
  dialogueQueue.push(currentVoiceLine);

  // Auto-close subtitle after 4.5 seconds
  setTimeout(() => {
    if (currentVoiceLine && Date.now() - currentVoiceLine.time >= 4400) {
      if (dialogueEl) dialogueEl.classList.remove("open");
    }
  }, 4500);

  return currentVoiceLine;
}
