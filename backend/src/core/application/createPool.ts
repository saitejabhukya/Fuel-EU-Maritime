export function createPool(members: { shipId: string; cb: number }[]) {
  members.sort((a, b) => b.cb - a.cb);

  let surplus = members.filter(m => m.cb > 0);
  let deficit = members.filter(m => m.cb < 0);

  for (let d of deficit) {
    for (let s of surplus) {
      if (s.cb <= 0) continue;

      const transfer = Math.min(s.cb, -d.cb);

      s.cb -= transfer;
      d.cb += transfer;

      if (d.cb === 0) break;
    }
  }

  const total = members.reduce((sum, m) => sum + m.cb, 0);

  if (total < 0) {
    throw new Error("Invalid pool: total CB < 0");
  }

  // ✅ RETURN FORMAT FIXED
  return members.map(m => ({
    shipId: m.shipId,
    cb_after: m.cb
  }));
}