export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

// Cubic ease-in-out. Standard formula: 4t^3 for t<0.5, 1 - (-2t+2)^3/2 otherwise.
export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
