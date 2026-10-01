export function getTouchMovementState(deltaX, deltaY, threshold) {
  return {
    left: deltaX < -threshold,
    right: deltaX > threshold,
    forward: deltaY < -threshold,
    backward: deltaY > threshold
  };
}