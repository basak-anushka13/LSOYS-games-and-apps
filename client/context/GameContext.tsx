import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import playersData from "@/data/players.json";
import { DUPLICATE_CONVERT_COINS, PACK_DEFS, PackType, Player, Tier, weightedRandom, sample } from "@/lib/rng";

export type OpenedCard = { player: Player; isDuplicate: boolean };

export type GameState = {
  coins: number;
  inventory: Record<string, Player>; // id -> player owned
  counts: Record<string, number>; // id -> copies
  muted: boolean;
  openPack: (pack: PackType) => { cards: OpenedCard[]; packPrice: number; gainedCoins: number } | null;
  setMuted: (v: boolean) => void;
  playersByTier: Record<Tier, Player[]>;
  reset: () => void;
};

const GameContext = createContext<GameState | null>(null);

const STORAGE_KEY = "cricket-packs-state-v1";

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

function createBeep(freq = 440, duration = 0.12, type: OscillatorType = "sine", gain = 0.02) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = usePersistentState<number>(`${STORAGE_KEY}:coins`, 2000);
  const [muted, setMuted] = usePersistentState<boolean>(`${STORAGE_KEY}:muted`, false);
  const [inventory, setInventory] = usePersistentState<Record<string, Player>>(`${STORAGE_KEY}:inv`, {});
  const [counts, setCounts] = usePersistentState<Record<string, number>>(`${STORAGE_KEY}:counts`, {});

  const playersByTier = useMemo(() => {
    const map: Record<Tier, Player[]> = { Common: [], Rare: [], Epic: [], Legend: [] };
    (playersData as Player[]).forEach((p) => map[p.tier].push(p));
    return map;
  }, []);

  const play = useCallback((tone: "open" | "flip" | "rare") => {
    if (muted) return;
    if (tone === "open") createBeep(220, 0.12, "triangle", 0.04);
    else if (tone === "flip") createBeep(660, 0.08, "sawtooth", 0.03);
    else if (tone === "rare") {
      createBeep(880, 0.12, "square", 0.05);
      setTimeout(() => createBeep(1320, 0.12, "square", 0.05), 120);
    }
  }, [muted]);

  const openPack = useCallback((pack: PackType) => {
    const def = PACK_DEFS[pack];
    if (coins < def.price) return null;

    const cards: OpenedCard[] = [];
    let gainedCoins = 0;

    for (let i = 0; i < 5; i++) {
      const tier = weightedRandom(def.odds as Record<Tier, number>);
      const pool = playersByTier[tier];
      const player = sample(pool);
      const isDuplicate = Boolean(counts[player.id]);
      cards.push({ player, isDuplicate });
      if (isDuplicate) {
        gainedCoins += DUPLICATE_CONVERT_COINS[player.tier];
      }
    }

    // Update wallet and inventory
    setCoins((c) => c - def.price + gainedCoins);
    setInventory((inv) => {
      const next = { ...inv };
      for (const { player } of cards) next[player.id] = player;
      return next;
    });
    setCounts((prev) => {
      const next = { ...prev };
      for (const { player } of cards) next[player.id] = (next[player.id] || 0) + 1;
      return next;
    });

    play("open");

    return { cards, packPrice: def.price, gainedCoins };
  }, [coins, counts, playersByTier, play, setCoins, setCounts, setInventory]);

  const reset = useCallback(() => {
    setCoins(2000);
    setInventory({});
    setCounts({});
  }, [setCoins, setInventory, setCounts]);

  const value: GameState = {
    coins,
    inventory,
    counts,
    muted,
    setMuted,
    openPack,
    playersByTier,
    reset,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
