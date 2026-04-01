export function bankSurplus(cb: number): number {
  if (cb <= 0) {
    throw new Error("Cannot bank non-positive CB");
  }
  
  return cb;
}