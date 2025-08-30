import React, { useEffect, useRef } from "react";

export function Confetti({ fire, onDone }: { fire: boolean; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let t0 = performance.now();
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      canvas.width = canvas.clientWidth * DPR;
      canvas.height = canvas.clientHeight * DPR;
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * 200,
      vy: 1 + Math.random() * 2,
      vx: -1 + Math.random() * 2,
      r: 2 + Math.random() * 3,
      color: `hsl(${Math.floor(Math.random() * 360)},90%,60%)`,
      rot: Math.random() * Math.PI,
      vr: (-0.05 + Math.random() * 0.1),
    }));

    const draw = (now: number) => {
      const dt = Math.min(32, now - t0);
      t0 = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        p.rot += p.vr * dt * 0.06;
        if (p.y > canvas.height + 20) p.y = -10;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    const timeout = setTimeout(() => {
      cancelAnimationFrame(raf);
      onDone?.();
    }, 3000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      window.removeEventListener("resize", onResize);
    };
  }, [fire, onDone]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />;
}
