import * as THREE from "three";
import { getOrCreateTexture } from "../../main.js";

export function proceduralTexture({ base = "#514b40", grain = "#2a241f", scratches = "#776b5a", scale = 1 } = {}) {
  const cacheKey = `procedural_${base}_${grain}_${scratches}_${scale}`;
  return getOrCreateTexture(cacheKey, () => {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext("2d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 420; i += 1) {
      const alpha = Math.random() * 0.16;
      ctx.strokeStyle = i % 4 === 0 ? `rgba(255,245,220,${alpha})` : `rgba(0,0,0,${alpha})`;
      ctx.beginPath();
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 80 * scale, y + Math.random() * 13 * scale);
      ctx.stroke();
    }

    ctx.strokeStyle = grain;
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y + Math.random() * 9);
      ctx.lineTo(512, y + Math.random() * 11);
      ctx.stroke();
    }

    ctx.strokeStyle = scratches;
    ctx.lineWidth = 1;
    for (let i = 0; i < 55; i += 1) {
      ctx.beginPath();
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.random() * 110 - 40, y + Math.random() * 45 - 22);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, window.renderer ? window.renderer.capabilities.getMaxAnisotropy() : 8);
    return texture;
  });
}

export function createFlashlightCookie() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 256, 256);

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
  grad.addColorStop(0.6, "rgba(255, 255, 255, 0.6)");
  grad.addColorStop(0.85, "rgba(255, 255, 255, 0.18)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 128, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(128, 128, 92, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  for (let i = 0; i < 40; i++) {
    const x = 128 + (Math.random() - 0.5) * 160;
    const y = 128 + (Math.random() - 0.5) * 160;
    const r = Math.random() * 2 + 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCheckerboardTexture() {
  const cacheKey = "checkerboard";
  return getOrCreateTexture(cacheKey, () => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    
    const tileSize = 64;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? "#8b8375" : "#2d3532";
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        
        ctx.strokeStyle = "rgba(10, 10, 10, 0.45)";
        ctx.lineWidth = 2;
        ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 30 + 10;
      const alpha = Math.random() * 0.15;
      ctx.fillStyle = `rgba(10, 12, 10, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 15 + 5;
      ctx.fillStyle = `rgba(75, 12, 10, ${Math.random() * 0.5 + 0.35})`;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = 0; j < 6; j++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * size * 2.5;
        const spSize = Math.random() * (size * 0.3);
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, spSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, window.renderer ? window.renderer.capabilities.getMaxAnisotropy() : 8);
    return texture;
  });
}

export function createPeelingWallTexture() {
  const cacheKey = "peelingWall";
  return getOrCreateTexture(cacheKey, () => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#3e4a45";
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 45 + 15;
      ctx.fillStyle = "#5a5349";
      
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.4) {
        const r = radius + (Math.random() - 0.5) * 12;
        ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(20, 18, 16, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (let i = 0; i < 120; i++) {
      const alpha = Math.random() * 0.12;
      ctx.fillStyle = i % 2 === 0 ? `rgba(0,0,0,${alpha})` : `rgba(255,240,210,${alpha})`;
      ctx.beginPath();
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 40, y + Math.random() * 120);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = Math.random() * 4 + 1;
      ctx.stroke();
    }

    for (let i = 0; i < 4; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = `rgba(60, 10, 8, ${Math.random() * 0.4 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 8 + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 2, y, Math.random() * 4 + 1, Math.random() * 50 + 20);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, window.renderer ? window.renderer.capabilities.getMaxAnisotropy() : 8);
    return texture;
  });
}
