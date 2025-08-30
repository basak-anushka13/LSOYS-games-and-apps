import { useMemo, useState } from "react";
import { useGame } from "@/context/GameContext";
import { PlayerCard } from "@/components/PlayerCard";
import { Player, Role, Tier } from "@/lib/rng";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Collection() {
  const { inventory } = useGame();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string>("All");
  const [role, setRole] = useState<string>("All");
  const [team, setTeam] = useState<string>("All");

  const players = Object.values(inventory);
  const teams = useMemo(
    () => Array.from(new Set(players.map((p) => p.team))),
    [players],
  );

  const filtered = players.filter((p) => {
    if (tier !== "All" && p.tier !== tier) return false;
    if (role !== "All" && p.role !== role) return false;
    if (team !== "All" && p.team !== team) return false;
    const query = q.trim().toLowerCase();
    if (query) {
      const hay = `${p.name} ${p.team} ${p.role} ${p.tier} ${p.rating}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b1220] via-[#0b1220] to-[#020617] text-white">
      <div className="absolute inset-0 -z-0 opacity-40 bg-[radial-gradient(circle_at_20%_10%,#1e293b_0%,transparent_35%),radial-gradient(circle_at_80%_10%,#7c3aed_0%,transparent_30%),radial-gradient(circle_at_50%_80%,#f59e0b_0%,transparent_25%)]" />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold">My Collection</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            type="search"
            placeholder="Search by name, team, tier, rating..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") setQ(""); }}
            autoComplete="off"
            className="bg-white/5 border-white/10"
          />
          <Select onValueChange={(v) => setTier(v)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Tier: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {(["Common", "Rare", "Epic", "Legend"] as Tier[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setRole(v)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Role: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {(["BAT", "BOWL", "AR", "WK"] as Role[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setTeam(v)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Team: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {teams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/70">
              No cards yet. Open some packs!
            </div>
          )}
          {filtered.map((p) => (
            <PlayerCard key={p.id} player={p as Player} revealed={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
