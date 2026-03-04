"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContainerScroll({
  titleComponent,
  children,
  className,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = (): [number, number] =>
    isMobile ? [0.7, 0.9] : [1.05, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className={cn(
        "h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20",
        className
      )}
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{ perspective: "1000px" }}
      >
        {/* Floating title above the card */}
        <motion.div
          style={{ translateY: translate }}
          className="max-w-5xl mx-auto text-center mb-8"
        >
          {titleComponent}
        </motion.div>

        {/* 3D rotating card */}
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
            borderColor: "#1e1e2e",
            background: "#12121a",
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full rounded-[30px] border-4 p-2 md:p-6 shadow-2xl"
        >
          <div
            className="h-full w-full overflow-y-auto rounded-2xl p-4 md:p-8"
            style={{ background: "#0a0a0f" }}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
