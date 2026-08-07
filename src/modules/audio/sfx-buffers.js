export function createProceduralDroneBuffer(ctx, durationSeconds = 12) {
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  let lastOut = 0;
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Low frequency drone harmonic combination
    const drone1 = Math.sin(2 * Math.PI * 55 * t);
    const drone2 = Math.sin(2 * Math.PI * 82.5 * t) * 0.4;
    const drone3 = Math.sin(2 * Math.PI * 110 * t) * 0.2;
    const hum = drone1 + drone2 + drone3;
    
    // Spooky ambient wind / brown noise
    const white = Math.random() * 2 - 1;
    const brownNoise = (lastOut + (0.02 * white)) / 1.02;
    lastOut = brownNoise;
    
    // slow breathing mod loop
    const mod = Math.sin(2 * Math.PI * 0.08 * t) * 0.25 + 0.75;
    
    left[i] = (hum * 0.4 + brownNoise * 6.0) * mod * 0.08;
    right[i] = (hum * 0.35 + brownNoise * 6.0) * mod * 0.08;
  }
  return buffer;
}

export function createConcreteStepBuffer(ctx) {
  const duration = 0.28;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-18 * t);
    const sine = Math.sin(2 * Math.PI * 120 * Math.exp(-22 * t) * t);
    const noise = (Math.random() * 2 - 1) * 0.15;
    data[i] = (sine * 0.65 + noise) * envelope * 0.22;
  }
  return buffer;
}

export function createTileStepBuffer(ctx) {
  const duration = 0.22;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-28 * t);
    const sine = Math.sin(2 * Math.PI * 340 * Math.exp(-32 * t) * t);
    const noise = (Math.random() * 2 - 1) * 0.1;
    data[i] = (sine * 0.8 + noise) * envelope * 0.14;
  }
  return buffer;
}

export function createFlashlightClickOnBuffer(ctx) {
  const duration = 0.08;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-60 * t);
    const clickNoise = (Math.random() * 2 - 1) * 0.3;
    const metalRing = Math.sin(2 * Math.PI * 1800 * t) * 0.45;
    data[i] = (clickNoise + metalRing) * envelope * 0.15;
  }
  return buffer;
}

export function createFlashlightClickOffBuffer(ctx) {
  const duration = 0.08;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-50 * t);
    const clickNoise = (Math.random() * 2 - 1) * 0.25;
    const metalRing = Math.sin(2 * Math.PI * 1400 * t) * 0.35;
    data[i] = (clickNoise + metalRing) * envelope * 0.12;
  }
  return buffer;
}

export function createDoorCreakBuffer(ctx) {
  const duration = 1.6;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = t < 0.2 ? t / 0.2 : Math.exp(-2.2 * (t - 0.2));
    const slipFrequency = 14 + t * 45;
    const click = Math.sin(2 * Math.PI * slipFrequency * t) > 0.94 ? 1.0 : -1.0;
    const squeakFreq = 950 + Math.sin(2 * Math.PI * 1.5 * t) * 150;
    const squeak = Math.sin(2 * Math.PI * squeakFreq * t) * 0.16;
    const noise = (Math.random() * 2 - 1) * 0.08;
    data[i] = (click * 0.25 + squeak + noise) * envelope * 0.15;
  }
  return buffer;
}

export function createDoorLatchBuffer(ctx) {
  const duration = 0.2;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-32 * t);
    const clickNoise = (Math.random() * 2 - 1) * 0.35;
    const clickTone = Math.sin(2 * Math.PI * 980 * t) * 0.2;
    data[i] = (clickNoise + clickTone) * envelope * 0.16;
  }
  return buffer;
}

export function createBuzzBuffer(ctx) {
  const duration = 1.0;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const mainHum = Math.sin(2 * Math.PI * 50 * t);
    const buzz1 = Math.sin(2 * Math.PI * 150 * t) * 0.45;
    const buzz2 = Math.sin(2 * Math.PI * 350 * t) * 0.25;
    const flicker = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.8 : 0;
    data[i] = (mainHum + buzz1 + buzz2 + flicker) * 0.08;
  }
  return buffer;
}

export function createBlackoutCueBuffer(ctx) {
  const duration = 3.5;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-0.75 * t);
    const freq = 160 * Math.exp(-2.2 * t);
    const sweep = Math.sin(2 * Math.PI * freq * t) * 0.65;
    
    let spark = 0;
    if (t < 1.2) {
      const trigger = Math.sin(2 * Math.PI * 18 * t) > 0.85;
      if (trigger) {
        spark = (Math.random() * 2 - 1) * 0.45 * Math.sin(2 * Math.PI * 1200 * t);
      }
    }
    left[i] = (sweep + spark) * envelope * 0.4;
    
    const tRight = Math.max(0, t - 0.02);
    const freqR = 160 * Math.exp(-2.2 * tRight);
    const sweepR = Math.sin(2 * Math.PI * freqR * tRight) * 0.65;
    let sparkR = 0;
    if (tRight < 1.2) {
      const triggerR = Math.sin(2 * Math.PI * 18 * tRight) > 0.85;
      if (triggerR) {
        sparkR = (Math.random() * 2 - 1) * 0.45 * Math.sin(2 * Math.PI * 1200 * tRight);
      }
    }
    right[i] = (sweepR + sparkR) * envelope * 0.4;
  }
  return buffer;
}

export function createGeneratorStartBuffer(ctx) {
  const duration = 5.0;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let engineSound = 0;
    if (t < 1.5) {
      const click = Math.sin(2 * Math.PI * 8 * t) > 0.7 ? 0.35 : 0;
      const noise = (Math.random() * 2 - 1) * 0.12 * Math.sin(2 * Math.PI * 40 * t);
      engineSound = click + noise;
    } else {
      const ramp = Math.min(1.0, (t - 1.5) / 2.0);
      const mainFreq = 30 + ramp * 25;
      engineSound = Math.sin(2 * Math.PI * mainFreq * t) * 0.6 + 
                    Math.sin(2 * Math.PI * (mainFreq * 2) * t) * 0.28 +
                    (Math.random() * 2 - 1) * 0.06;
    }
    const envelope = t > 4.2 ? Math.max(0, 1.0 - (t - 4.2) / 0.8) : 1.0;
    const finalVal = engineSound * envelope * 0.8;
    
    left[i] = finalVal;
    right[i] = finalVal;
  }
  return buffer;
}

export function createUiHoverBuffer(ctx) {
  const duration = 0.04;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-120 * t);
    data[i] = Math.sin(2 * Math.PI * 2200 * t) * envelope * 0.05;
  }
  return buffer;
}

export function createDebrisImpactBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.0;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-6 * t);
    const res1 = Math.sin(2 * Math.PI * 880 * t) * 0.4;
    const res2 = Math.sin(2 * Math.PI * 1350 * t) * 0.25;
    const res3 = Math.sin(2 * Math.PI * 2200 * t) * 0.15;
    const noise = (Math.random() * 2 - 1) * 0.2;
    data[i] = (res1 + res2 + res3 + noise) * env * 0.55;
  }
  return buffer;
}

export function createUiSelectBuffer(ctx) {
  const duration = 0.15;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-22 * t);
    const tone1 = Math.sin(2 * Math.PI * 440 * t);
    const tone2 = Math.sin(2 * Math.PI * 554.37 * t) * 0.5;
    data[i] = (tone1 + tone2) * envelope * 0.08;
  }
  return buffer;
}

export function createUiPauseOpenBuffer(ctx) {
  const duration = 0.35;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-8 * t);
    const freq = 180 * Math.exp(-6 * t);
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.15;
  }
  return buffer;
}

export function createUiPauseCloseBuffer(ctx) {
  const duration = 0.25;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-12 * t);
    const freq = 120 + t * 400;
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.12;
  }
  return buffer;
}

export function createPhoneRingBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 2.4;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let ring = 0;
    if ((t >= 0 && t < 0.4) || (t >= 0.6 && t < 1.0)) {
      ring = Math.sin(2 * Math.PI * 400 * t) + Math.sin(2 * Math.PI * 450 * t);
      ring *= 0.5 * (1 + Math.sin(2 * Math.PI * 25 * t));
      let localT = (t >= 0 && t < 0.4) ? t : t - 0.6;
      let fade = Math.sin(Math.PI * localT / 0.4);
      ring *= fade;
    }
    data[i] = ring * 0.24;
  }
  return buffer;
}

export function createTickingBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.0; // 1 tick per second
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let click = 0;
    if (t < 0.05) {
      // Woodblock/tick decay click
      click = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-120 * t);
    }
    data[i] = click * 0.18;
  }
  return buffer;
}

export function createTapePrequelBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 12.0; // 12 seconds
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  // Generate base static hum + metronome clicks + code frequency beeps
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // 12Hz deep carrier hum (Dr. Verma's neural grid)
    let sample = Math.sin(2 * Math.PI * 12 * t) * 0.15;
    
    // Metronome tick every 1.2 seconds
    const tickPeriod = 1.2;
    const tInPeriod = t % tickPeriod;
    if (tInPeriod < 0.05) {
      // Wood creak click
      sample += Math.sin(2 * Math.PI * 800 * tInPeriod) * Math.exp(-150 * tInPeriod) * 0.4;
    }
    
    // Voice/beeps at key timings representing the numbers
    // 42 at t = 2.2 - 3.2
    if (t >= 2.2 && t < 3.2) {
      const dt = t - 2.2;
      const freq = 300 + Math.sin(2 * Math.PI * 8 * dt) * 50;
      sample += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-3 * dt) * 0.25;
    }
    // 18 at t = 4.2 - 5.2
    if (t >= 4.2 && t < 5.2) {
      const dt = t - 4.2;
      const freq = 200 + Math.sin(2 * Math.PI * 6 * dt) * 30;
      sample += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-3 * dt) * 0.25;
    }
    // 5 at t = 6.2 - 7.2
    if (t >= 6.2 && t < 7.2) {
      const dt = t - 6.2;
      const freq = 120 + Math.sin(2 * Math.PI * 4 * dt) * 20;
      sample += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-3 * dt) * 0.25;
    }
    // 0 at t = 8.2 - 9.2
    if (t >= 8.2 && t < 9.2) {
      const dt = t - 8.2;
      const freq = 60 + Math.sin(2 * Math.PI * 2 * dt) * 10;
      sample += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-3 * dt) * 0.25;
    }
    
    // Glitches and tape static (random pops)
    if (Math.random() < 0.00015) {
      sample += (Math.random() * 2 - 1) * 0.6;
    }
    
    // Faint creepy white noise background sweep
    const sweepVolume = 0.04 + Math.sin(t * 1.5) * 0.03;
    sample += (Math.random() * 2 - 1) * sweepVolume;
    
    data[i] = Math.max(-1.0, Math.min(1.0, sample));
  }
  return buffer;
}

export function createEmfTickBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 0.15; // very short click
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Geiger tick: short metallic decay
    let click = Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-220 * t);
    // Add small high frequency noise pop
    click += (Math.random() * 2 - 1) * 0.15 * Math.exp(-350 * t);
    data[i] = click * 0.42;
  }
  return buffer;
}

export function createHeartBeatSlowBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.0;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let val = 0;
    if (t >= 0.05 && t < 0.25) {
      const dt = t - 0.05;
      val += Math.sin(2 * Math.PI * 55 * dt) * Math.exp(-22 * dt) * 0.7;
    }
    if (t >= 0.25 && t < 0.45) {
      const dt = t - 0.25;
      val += Math.sin(2 * Math.PI * 75 * dt) * Math.exp(-25 * dt) * 0.55;
    }
    data[i] = val;
  }
  return buffer;
}

export function createHeartBeatFastBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 0.5;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let val = 0;
    if (t >= 0.02 && t < 0.18) {
      const dt = t - 0.02;
      val += Math.sin(2 * Math.PI * 68 * dt) * Math.exp(-32 * dt) * 0.85;
    }
    if (t >= 0.16 && t < 0.32) {
      const dt = t - 0.16;
      val += Math.sin(2 * Math.PI * 90 * dt) * Math.exp(-35 * dt) * 0.7;
    }
    data[i] = val;
  }
  return buffer;
}

export function createBreathInBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.2;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  let lastVal = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noise = Math.random() * 2 - 1;
    lastVal = lastVal * 0.94 + noise * 0.06;
    const env = Math.sin((t / duration) * Math.PI * 0.5);
    data[i] = lastVal * env * 0.35;
  }
  return buffer;
}

export function createBreathOutBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.5;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  let lastVal = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noise = Math.random() * 2 - 1;
    lastVal = lastVal * 0.96 + noise * 0.04;
    const env = Math.cos((t / duration) * Math.PI * 0.5);
    data[i] = lastVal * env * 0.28;
  }
  return buffer;
}

export function createPillConsumeBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 0.45; // 450ms gulp
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 120 * Math.exp(-6 * t) + 80;
    const amp = Math.sin(2 * Math.PI * freq * t) * Math.sin(Math.PI * (t / duration));
    const noise = (Math.random() * 2 - 1) * 0.12 * Math.exp(-12 * t);
    data[i] = (amp + noise) * 0.5;
  }
  return buffer;
}

export function createJumpscareStingerBuffer(ctx) {
  const duration = 2.4;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-1.4 * t);
    
    // FM synth high frequency screaming screech
    const fm = Math.sin(2 * Math.PI * 40 * t) * 120;
    const screamer = Math.sin(2 * Math.PI * (2800 + fm) * t) * 0.35;
    
    // Sub bass impact boom
    const subFreq = 90 * Math.exp(-2.8 * t);
    const subBoom = Math.sin(2 * Math.PI * subFreq * t) * 0.5;
    
    // Brutal white noise impact transient
    const noiseEnv = Math.exp(-6.5 * t);
    const noise = (Math.random() * 2 - 1) * 0.6 * noiseEnv;
    
    left[i] = (screamer + subBoom + noise) * envelope * 0.28;
    
    const tRight = Math.max(0, t - 0.024);
    const fmR = Math.sin(2 * Math.PI * 40 * tRight) * 120;
    const screamerR = Math.sin(2 * Math.PI * (2800 + fmR) * tRight) * 0.35;
    const noiseR = (Math.random() * 2 - 1) * 0.6 * Math.exp(-6.5 * tRight);
    right[i] = (screamerR + subBoom + noiseR) * envelope * 0.28;
  }
  return buffer;
}

export function createTerminalBeepBuffer(ctx) {
  const duration = 0.08;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin(Math.PI * (t / duration));
    data[i] = Math.sin(2 * Math.PI * 1400 * t) * envelope * 0.15;
  }
  return buffer;
}

export function createDecryptSuccessBuffer(ctx) {
  const duration = 0.5;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-6.0 * t);
    const freq = t < 0.15 ? 523.25 : (t < 0.3 ? 659.25 : 783.99); // C5 -> E5 -> G5
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
  }
  return buffer;
}

export function createLockerShakeBuffer(ctx) {
  const duration = 0.6;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-5.0 * t);
    const rattle = Math.sin(2 * Math.PI * (80 + Math.random() * 40) * t);
    data[i] = rattle * envelope * 0.35;
  }
  return buffer;
}

export function createDrawerSlideBuffer(ctx) {
  const duration = 0.8;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin(Math.PI * (t / duration));
    const scrape = (Math.random() * 2 - 1) * 0.25 * Math.sin(2 * Math.PI * 180 * t);
    data[i] = scrape * envelope;
  }
  return buffer;
}

export function createRadioStaticBuffer(ctx) {
  const duration = 1.2;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.12;
  }
  return buffer;
}

export function createCameraSwitchBuffer(ctx) {
  const duration = 0.15;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    data[i] = Math.sin(2 * Math.PI * 650 * t) * Math.exp(-8.0 * t) * 0.15;
  }
  return buffer;
}

export function createStrobeBuzzBuffer(ctx) {
  const duration = 0.5;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    data[i] = Math.sin(2 * Math.PI * 60 * t) * (Math.random() * 0.15) * 0.25;
  }
  return buffer;
}

export function createDoorUnlockBeepBuffer(ctx) {
  const duration = 0.22;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    data[i] = Math.sin(2 * Math.PI * 1920 * t) * Math.exp(-6.0 * t) * 0.2;
  }
  return buffer;
}

export function createButtonClickBuffer(ctx) {
  const duration = 0.12;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-12.0 * t);
    data[i] = Math.sin(2 * Math.PI * 880 * t) * envelope * 0.2;
  }
  return buffer;
}

export function createPaperRustleBuffer(ctx) {
  const duration = 0.55;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin(Math.PI * (t / duration));
    data[i] = (Math.random() * 2 - 1) * envelope * 0.16;
  }
  return buffer;
}

export function createDecryptFailureBuffer(ctx) {
  const duration = 0.45;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-4.5 * t);
    const buzz = Math.sin(2 * Math.PI * 130 * t) + Math.sin(2 * Math.PI * 260 * t) * 0.5;
    const noise = Math.random() * 2 - 1;
    data[i] = (buzz * 0.6 + noise * 0.4) * envelope * 0.25;
  }
  return buffer;
}

// commit-ref: 56
// commit-ref: 60
// commit-ref: 66
// commit-ref: 70
// commit-ref: 76
// commit-ref: 80
// commit-ref: 86
// commit-ref: 90
// commit-ref: 96
// commit-ref: 100
// commit-ref: 106
// commit-ref: 110
// commit-ref: 116
// commit-ref: 120
// commit-ref: 121
// commit-ref: 122
// commit-ref: 123
// commit-ref: 124
// commit-ref: 125
// commit-ref: 126
// commit-ref: 127
// commit-ref: 128
// commit-ref: 129
// commit-ref: 130
// commit-ref: 131
// commit-ref: 132
// commit-ref: 133
// commit-ref: 134
// commit-ref: 135
// commit-ref: 136
// commit-ref: 137
// commit-ref: 138
// commit-ref: 139
// commit-ref: 140
// commit-ref: 141
// commit-ref: 142
// commit-ref: 143
// commit-ref: 144
// commit-ref: 145
// commit-ref: 146
// commit-ref: 147
// commit-ref: 148
// commit-ref: 149
// commit-ref: 150
// commit-ref: 151
// commit-ref: 152
// commit-ref: 153
// commit-ref: 154
// commit-ref: 155
// commit-ref: 156
// commit-ref: 157
// commit-ref: 158