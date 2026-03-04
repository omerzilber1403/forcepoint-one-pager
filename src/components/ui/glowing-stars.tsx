"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingStarsProps {
  className?: string;
  starCount?: number;
  glowColor?: string;
}

export function GlowingStarsBackground({
  className,
  starCount = 80,
  glowColor = "#6366f1",
}: GlowingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate fixed star positions
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      glowRadius: Math.random() * 4 + 2,
      pulseDuration: Math.random() * 3000 + 2000,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let startTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      for (const star of stars) {
        const pulse = Math.sin(
          (elapsed / star.pulseDuration) * Math.PI * 2 + star.pulseOffset
        );
        const alpha = star.opacity + pulse * 0.2;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.glowRadius
        );
        gradient.addColorStop(0, `rgba(99,102,241,${alpha * 0.4})`);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,250,252,${alpha})`;
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [starCount, glowColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
    />
  );
}
