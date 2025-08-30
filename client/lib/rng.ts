export type Tier = "Common" | "Rare" | "Epic" | "Legend";
export type Role = "BAT" | "BOWL" | "AR" | "WK";

export type Player = {
  id: string;
  name: string;
  role: Role;
  team: string;
  tier: Tier;
  rating: number;
  stats: {
    batting_avg: number;
    strike_rate: number;
    bowling_econ: number;
  };
  photo?: string;
};

export type PackType = "Bronze" | "Silver" | "Gold";

export const PACK_DEFS: Record<PackType, { price: number; odds: Record<Tier, number> }> = {
  Bronze: {
    price: 100,
    odds: { Common: 70, Rare: 25, Epic: 4.5, Legend: 0.5 },
  },
  Silver: {
    price: 500,
    odds: { Common: 40, Rare: 45, Epic: 13, Legend: 2 },
  },
  Gold: {
    price: 1500,
    odds: { Common: 20, Rare: 50, Epic: 25, Legend: 5 },
  },
};

export const DUPLICATE_CONVERT_COINS: Record<Tier, number> = {
  Common: 10,
  Rare: 30,
  Epic: 100,
  Legend: 300,
};

export function weightedRandom<T extends string | number>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const [k, w] of entries) {
    acc += w;
    if (r <= acc) return k;
  }
  return entries[entries.length - 1][0];
}

export function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
