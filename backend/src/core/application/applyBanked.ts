export function applyBanked(deficit: number, banked: number, amount: number) {
  if (amount > banked) {
    throw new Error("Amount exceeds banked");
  }

  if (deficit >= 0) {
    throw new Error("No deficit to apply");
  }

  const newCB = deficit + amount;

  return {
    remainingBanked: banked - amount,
    newCB
  };
}