"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InfiniteMovingCardsProps {
  items: { name: string; icon?: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        scrollerRef.current!.appendChild(item.cloneNode(true));
      });

      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );

      const durationMap = { fast: "20s", normal: "40s", slow: "60s" };
      containerRef.current.style.setProperty(
        "--animation-duration",
        durationMap[speed]
      );

      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-3 py-2 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationName: start ? "scroll" : "none",
          animationDuration: "var(--animation-duration, 60s)",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: "var(--animation-direction, forwards)",
        }}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className="flex-shrink-0"
          >
            <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-mono select-none"
              style={{
                borderColor: "rgba(99,102,241,0.3)",
                background: "rgba(99,102,241,0.06)",
                color: "#a5b4fc",
              }}>
              {item.icon && <span>{item.icon}</span>}
              {item.name}
            </span>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50%)); }
        }
      `}</style>
    </div>
  );
}
