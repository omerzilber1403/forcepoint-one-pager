"use client";

import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

interface BentoGridItemProps {
  className?: string;
  children?: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({ className, children }: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}
