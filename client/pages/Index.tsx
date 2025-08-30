import { useEffect, useMemo, useState } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { PackTile } from "@/components/PackTile";
import { PlayerCard } from "@/components/PlayerCard";
import { Confetti } from "@/components/Confetti";
import { SparkBurst } from "@/components/SparkBurst";
import { PackType, Player, PACK_DEFS } from "@/lib/rng";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function Beep({ play, when }: { play: boolean; when: number }) {
  useEffect(() => {
    if (!play) return;
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = when;
    g.gain.value = 0.02;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.08);
  }, [play, when]);
  return null;
}

function HomeInner() {
  const { coins, openPack, muted } = useGame();
  const [opening, setOpening] = useState<null | {
    cards: { player: Player; isDuplicate: boolean }[];
    gainedCoins: number;
    packPrice: number;
  }>(null);
  const [revealed, setRevealed] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [fireConfetti, setFireConfetti] = useState(false);
  const [prePack, setPrePack] = useState<null | PackType>(null);
  const [spark, setSpark] = useState(false);

  const hasRare = useMemo(
    () =>
      opening?.cards.some(
        (c) => c.player.tier === "Epic" || c.player.tier === "Legend",
      ) ?? false,
    [opening],
  );

  useEffect(() => {
    if (!opening) return;
    setRevealed(0);
    const seq = async () => {
      await new Promise((r) => setTimeout(r, 700));
      for (let i = 0; i < opening.cards.length; i++) {
        setRevealed((n) => n + 1);
        if (!muted) {
          // flip sound
          const ctx = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sawtooth";
          o.frequency.value = 680;
          g.gain.value = 0.02;
          o.connect(g);
          g.connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 0.06);
        }
        const card = opening.cards[i];
        if (
          (card.player.tier === "Epic" || card.player.tier === "Legend") &&
          !muted
        ) {
          const ctx = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "square";
          o.frequency.value = 900;
          g.gain.value = 0.04;
          o.connect(g);
          g.connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 0.1);
        }
        await new Promise((r) => setTimeout(r, 350));
      }
      setSummaryOpen(true);
      if (hasRare) setFireConfetti(true);
    };
    seq();
  }, [opening, hasRare, muted]);

  const handleOpen = (type: PackType) => {
    const price = PACK_DEFS[type].price;
    if (coins < price) {
      import("sonner").then(({ toast }) => toast.error("Not enough coins"));
      return;
    }
    setPrePack(type);
    setSummaryOpen(false);
    setFireConfetti(false);
    setSpark(true);
    if (!muted) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "triangle"; o.frequency.value = 200; g.gain.value = 0.05; o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.2);
      setTimeout(() => { const o2 = ctx.createOscillator(); const g2 = ctx.createGain(); o2.type = "sine"; o2.frequency.value = 1200; g2.gain.value = 0.03; o2.connect(g2); g2.connect(ctx.destination); o2.start(); o2.stop(ctx.currentTime + 0.08); }, 160);
    }
    setTimeout(() => {
      const res = openPack(type);
      if (res) setOpening(res);
      setPrePack(null);
      setSpark(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b1220] via-[#0b1220] to-[#020617] text-white">
      <div className="absolute inset-0 -z-0 opacity-40 bg-[radial-gradient(circle_at_20%_10%,#1e293b_0%,transparent_35%),radial-gradient(circle_at_80%_10%,#7c3aed_0%,transparent_30%),radial-gradient(circle_at_50%_80%,#f59e0b_0%,transparent_25%)]" />
      {fireConfetti && (
        <Confetti fire={true} onDone={() => setFireConfetti(false)} />
      )}

      <header className="sticky top-0 z-10 backdrop-blur border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-black tracking-widest text-sm text-white/80">
            CRICKET <span className="text-white">PACKS</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
              {coins} coins
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
              <span className="opacity-70 mr-2">Odds</span>
              <span className="opacity-90">
                Bronze 70/25/4.5/0.5 • Silver 40/45/13/2 • Gold 20/50/25/5
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-amber-200 to-fuchsia-200 bg-clip-text text-transparent">
            Pack-Opening Game
          </h1>
          <p className="mt-3 text-white/80">
            Shake. Glow. Reveal. Collect iconic cricket stars across Common,
            Rare, Epic and Legend tiers. Cinematic animations. 60fps vibes.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PackTile type="Bronze" onOpen={() => handleOpen("Bronze")} />
          <PackTile type="Silver" onOpen={() => handleOpen("Silver")} />
          <PackTile type="Gold" onOpen={() => handleOpen("Gold")} />
        </div>

        {opening && (
          <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur flex items-center justify-center">
            <div className="absolute top-6 right-6 flex gap-2">
              <Button variant="secondary" onClick={() => setRevealed(5)}>
                Reveal All
              </Button>
              <Button
                onClick={() => {
                  setRevealed(5);
                  setSummaryOpen(true);
                }}
              >
                Skip
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {opening.cards.map((c, idx) => (
                <PlayerCard
                  key={idx}
                  player={c.player}
                  revealed={idx < revealed}
                  rarePulse={
                    c.player.tier === "Epic" || c.player.tier === "Legend"
                  }
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="bg-background/95 backdrop-blur border">
          <DialogHeader>
            <DialogTitle>Pack Summary</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {opening?.cards.filter((c) => c.isDuplicate).length} duplicates
            converted for +{opening?.gainedCoins} coins
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {opening?.cards.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-md border p-2",
                  c.isDuplicate && "opacity-70",
                )}
              >
                <div className="text-xs mb-1">
                  {c.player.tier} • {c.player.role}
                </div>
                <div className="font-semibold leading-tight">
                  {c.player.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.player.team} • {c.player.rating}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSummaryOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Beep play={false} when={0} />
    </div>
  );
}

export default function Index() {
  return <HomeInner />;
}
