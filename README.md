# Cricket Packs — Cinematic Pack-Opening Game

React + Vite + Tailwind + Framer Motion style animations. Open Bronze/Silver/Gold packs, pull Common/Rare/Epic/Legend cricket players, with odds-driven RNG, flashy reveals, sounds, confetti, and a saved collection. Frontend only.

## Live Demo & Deploy
- Deploy via Netlify or Vercel MCP in Builder.io. Connect under MCP popover and trigger a deploy.

## Features
- Cinematic open flow: pre-open shake/glow + sparks, flip reveals, reveal-all/skip, rare glow/confetti.
- Tiers: Common, Rare, Epic, Legend. Packs: Bronze/Silver/Gold with configurable odds.
- Inventory in localStorage, duplicate conversion → coins. Filters in My Collection.
- Sounds with mute toggle. Responsive, 60fps-feel visuals (gradients, glassmorphism, metallic borders).
- State management via React Context.

## Tech Stack
- React 18, Vite, TypeScript, TailwindCSS 3, Framer Motion (animations), Radix UI/shadcn (dialogs, inputs).

## Getting Started

```bash
pnpm install
pnpm dev
# build
pnpm build && pnpm start
```

## RNG Logic
- Pack definitions and odds in `client/lib/rng.ts`:
  - Bronze: 70%/25%/4.5%/0.5%; Silver: 40%/45%/13%/2%; Gold: 20%/50%/25%/5% (Common/Rare/Epic/Legend).
- `weightedRandom` chooses a tier; a random player of that tier is sampled.
- 5 cards per pack. Duplicates award coins (tier-based): see `DUPLICATE_CONVERT_COINS`.
- All state updates are persisted to localStorage.

## Project Structure
- UI: `client/components/PackTile.tsx`, `PlayerCard.tsx`, `Confetti.tsx`, `SparkBurst.tsx`
- State: `client/context/GameContext.tsx`
- Pages: `client/pages/Index.tsx` (opening), `client/pages/Collection.tsx`
- Data: `client/data/players.json`

## Asset Credits
- Player photos use Unsplash sample URLs for demo purposes. Replace with licensed/credited assets as needed.

## Notes
- Frontend only per assignment. No external services required.
- Sounds generated via WebAudio; disable with Mute.

