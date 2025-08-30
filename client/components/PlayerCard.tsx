import { motion } from "framer-motion";
import { Player, Tier } from "@/lib/rng";
import React from "react";
import { cn } from "@/lib/utils";

const tierStyles: Record<Tier, { bg: string; ring: string; glow: string; label: string }> = {
  Common: {
    bg: "bg-gradient-to-br from-slate-700 to-slate-900",
    ring: "ring-1 ring-slate-400/40",
    glow: "shadow-[0_0_40px_rgba(148,163,184,0.25)]",
    label: "from-slate-300 to-slate-100 text-slate-800",
  },
  Rare: {
    bg: "bg-gradient-to-br from-sky-700 to-indigo-900",
    ring: "ring-2 ring-sky-400/60",
    glow: "shadow-[0_0_50px_rgba(56,189,248,0.4)]",
    label: "from-cyan-200 to-sky-100 text-slate-800",
  },
  Epic: {
    bg: "bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-900",
    ring: "ring-2 ring-fuchsia-300/70",
    glow: "shadow-[0_0_70px_rgba(217,70,239,0.5)]",
    label: "from-fuchsia-200 to-pink-100 text-slate-800",
  },
  Legend: {
    bg: "bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700",
    ring: "ring-[3px] ring-amber-300",
    glow: "shadow-[0_0_80px_rgba(251,191,36,0.6)]",
    label: "from-amber-100 to-yellow-50 text-amber-900",
  },
};

export function PlayerCard({ player, revealed, rarePulse = false }: { player: Player; revealed: boolean; rarePulse?: boolean }) {
  const t = tierStyles[player.tier];

  return (
    <div className="relative w-40 h-64 sm:w-48 sm:h-72 perspective-1000">
      <motion.div
        className={cn("relative size-full rounded-xl overflow-hidden [transform-style:preserve-3d]", t.glow)}
        animate={{ rotateY: revealed ? 0 : 180 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Front */}
        <div className={cn("absolute inset-0 rounded-xl p-3 sm:p-4 flex flex-col", t.bg, t.ring)} style={{ backfaceVisibility: "hidden" }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,white,transparent_60%)]" />
            {player.tier !== "Common" && (
              <div className="absolute -inset-10 opacity-30 blur-2xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.05),rgba(255,255,255,0)_70%)]" />
            )}
          </div>
          <div className="text-xs font-semibold tracking-widest mb-1">
            <span className={cn("inline-block px-2 py-0.5 rounded-full bg-gradient-to-r", t.label)}>{player.tier}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {player.photo ? (
              <img src={player.photo} alt={player.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-2 border-white/40 shadow-inner" />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 border border-white/20" />
            )}
          </div>
          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-extrabold leading-tight">{player.name}</div>
            <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-black/30 border border-white/20">{player.role}</span>
              <span>{player.team}</span>
              <span className="ml-auto text-white/90 font-black text-lg">{player.rating}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] sm:text-xs text-white/80">
              <div className="bg-black/25 rounded px-1.5 py-1">AVG {player.stats.batting_avg}</div>
              <div className="bg-black/25 rounded px-1.5 py-1">SR {player.stats.strike_rate}</div>
              <div className="bg-black/25 rounded px-1.5 py-1">ECN {player.stats.bowling_econ}</div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-800 to-black ring-2 ring-neutral-600 grid place-items-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <div className={cn("text-center select-none", rarePulse && "animate-pulse")}> 
            <div className="text-[11px] tracking-widest text-neutral-300">CRICKET</div>
            <div className="text-2xl font-black text-neutral-100">PACKS</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
