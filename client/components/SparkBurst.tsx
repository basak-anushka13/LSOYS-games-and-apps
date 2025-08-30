import React, { useEffect, useRef } from "react";

export function SparkBurst({ fire }: { fire: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!fire) return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      c.width = c.clientWidth * DPR;
      c.height = c.clientHeight * DPR;
    };
    resize();
    let raf = 0;
    let t0 = performance.now();
    const sparks = Array.from({ length: 80 }, () => ({
      x: c.width / 2,
      y: c.height / 2,
      a: Math.random() * Math.PI * 2,
      v: 1.5 + Math.random() * 2.5,
      life: 700 + Math.random() * 500,
      r: 1 + Math.random() * 2,
      hue: 40 + Math.random() * 40,
    }));
    const draw = (now: number) => {
      const dt = now - t0;
      t0 = now;
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      for (const s of sparks) {
        s.life -= dt;
        if (s.life <= 0) continue;
        s.x += Math.cos(s.a) * s.v * dt * 0.06;
        s.y += Math.sin(s.a) * s.v * dt * 0.06 + 0.02 * dt; // gravity
        ctx.beginPath();
        ctx.fillStyle = `hsl(${s.hue},95%,60%)`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const timeout = setTimeout(() => {
      cancelAnimationFrame(raf);
    }, 1200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [fire]);
  return (
    <canvas ref={ref} className="pointer-events-none fixed inset-0 z-50" />
  );
}
