export function createWhisperBuffer(ctx) {
  const duration = 1.8;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-2.2 * t);
    const chimeFreq = 880 * Math.exp(-1.8 * t);
    const chime = Math.sin(2 * Math.PI * chimeFreq * t) * 0.4;
    const sub = Math.sin(2 * Math.PI * 65 * Math.exp(-4 * t) * t) * 0.45;
    const mod = Math.sin(2 * Math.PI * 4.5 * t) * 0.4 + 0.6;
    const whisper = (Math.random() * 2 - 1) * 0.18 * mod;
    left[i] = (chime + sub + whisper) * envelope * 0.16;
    
    const tRight = Math.max(0, t - 0.025);
    const chimeR = Math.sin(2 * Math.PI * (880 * Math.exp(-1.8 * tRight)) * tRight) * 0.4;
    const whisperR = (Math.random() * 2 - 1) * 0.18 * mod;
    right[i] = (chimeR + sub + whisperR) * envelope * 0.16;
  }
  return buffer;
}

export function createCreepyWhisperBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 6.0; // 6-second loop
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const breath = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.3 * t);
    let hiss = (Math.random() * 2 - 1) * 0.05 * breath;
    if (t > 1.0 && t < 2.5) {
      hiss += Math.sin(2 * Math.PI * 440 * t) * (Math.random() * 0.03) * Math.sin(Math.PI * (t - 1.0) / 1.5);
    }
    if (t > 3.5 && t < 5.0) {
      hiss += Math.sin(2 * Math.PI * 220 * t) * (Math.random() * 0.04) * Math.sin(Math.PI * (t - 3.5) / 1.5);
    }
    data[i] = Math.max(-1.0, Math.min(1.0, hiss));
  }
  return buffer;
}
