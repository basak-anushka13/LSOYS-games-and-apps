import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { PackType, PACK_DEFS, Tier } from "@/lib/rng";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const tierOrder: Tier[] = ["Common", "Rare", "Epic", "Legend"];

export function PackTile({ type, onOpen }: { type: PackType; onOpen: () => void }) {
  const def = PACK_DEFS[type];

  const palette: Record<PackType, { bg: string; ring: string; glow: string }> = {
    Bronze: { bg: "from-orange-300/70 via-amber-500/80 to-amber-800/80", ring: "ring-amber-300/70", glow: "shadow-[0_0_60px_rgba(245,158,11,0.5)]" },
    Silver: { bg: "from-slate-200/80 via-slate-400/70 to-slate-700/80", ring: "ring-slate-200/80", glow: "shadow-[0_0_60px_rgba(203,213,225,0.5)]" },
    Gold: { bg: "from-yellow-200/90 via-amber-400/90 to-orange-700/90", ring: "ring-yellow-200", glow: "shadow-[0_0_80px_rgba(251,191,36,0.7)]" },
  };

  const p = palette[type];

  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98, rotate: [0, -2, 2, -1, 1, 0] }}
      className={`relative w-full overflow-hidden rounded-2xl ring-2 ${p.ring} ${p.glow} bg-gradient-to-br p-5 text-left`}
    >
      <div className="absolute -inset-16 opacity-30 blur-2xl bg-[conic-gradient(from_0deg,white_0deg,transparent_120deg)]" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs tracking-widest text-black/70">PACK</div>
          <div className="text-2xl font-extrabold text-black drop-shadow">{type}</div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-xs text-white ring-1 ring-white/30">
            <span className="font-semibold">{def.price}</span>
            <span className="opacity-80">coins</span>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger className="rounded-full bg-black/30 p-2 text-white ring-1 ring-white/20">
            <Info size={18} />
          </TooltipTrigger>
          <TooltipContent className="bg-background/90 backdrop-blur border">
            <div className="text-xs">
              <div className="font-semibold mb-1">Odds</div>
              {tierOrder.map((t) => (
                <div key={t} className="flex justify-between gap-6">
                  <span>{t}</span>
                  <span>{PACK_DEFS[type].odds[t]}%</span>
                </div>
              ))}
              <div className="mt-2 text-muted-foreground">5 cards per pack</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.button>
  );
}
