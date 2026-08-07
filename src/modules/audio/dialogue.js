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
let typewriterTimer = null;

// Registry for swappable voice line audio files
const customVoiceAudioSources = new Map();

/**
 * Register or swap in an audio file URL for a specific voice line key.
 * @param {string} key 
 * @param {string} audioUrl 
 */
export function setVoiceAudioSource(key, audioUrl) {
  customVoiceAudioSources.set(key, audioUrl);
}

/**
 * Trigger a short spoken line or text subtitle at story/interaction points.
 * @param {string} speaker 
 * @param {string} text 
 * @param {string} audioKey 
 * @param {object} [audioManager] 
 */
export function triggerVoiceLine(speaker, text, audioKey = "whisper", audioManager = null) {
  const dialogueEl = document.getElementById("dialogue");
  const speakerEl = document.getElementById("speaker");
  const lineEl = document.getElementById("line");

  if (speakerEl) speakerEl.textContent = speaker.toUpperCase();
  if (dialogueEl) {
    dialogueEl.style.display = "block";
    dialogueEl.classList.add("open");
  }

  if (typewriterTimer) clearInterval(typewriterTimer);
  if (lineEl) {
    lineEl.textContent = "";
    let charIdx = 0;
    typewriterTimer = setInterval(() => {
      if (charIdx < text.length) {
        lineEl.textContent += text[charIdx];
        charIdx++;
      } else {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
      }
    }, 28);
  }

  // Play voice line audio if audioManager is supplied or custom voice file is registered
  if (audioManager) {
    if (customVoiceAudioSources.has(audioKey)) {
      const customUrl = customVoiceAudioSources.get(audioKey);
      const audio = new Audio(customUrl);
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } else if (audioKey && audioManager.playSound) {
      audioManager.playSound(audioKey, { volume: 0.65 });
    }
  }

  currentVoiceLine = { speaker, text, audioKey, time: Date.now() };
  dialogueQueue.push(currentVoiceLine);

  // Auto-close subtitle container after reading duration
  const autoCloseDelay = Math.max(3500, text.length * 70);
  setTimeout(() => {
    if (currentVoiceLine && Date.now() - currentVoiceLine.time >= autoCloseDelay - 100) {
      if (dialogueEl) dialogueEl.classList.remove("open");
    }
  }, autoCloseDelay);

  return currentVoiceLine;
}

