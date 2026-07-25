export const textureCache = new Map();

export function getOrCreateTexture(key, generatorFn) {
  if (textureCache.has(key)) {
    return textureCache.get(key);
  }
  const texture = generatorFn();
  textureCache.set(key, texture);
  return texture;
}
