import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "indigo" | "cyan" | "muted";
}

export function Badge({ children, className, variant = "indigo" }: BadgeProps) {
  const variants = {
    indigo: "border-indigo-500/30 bg-indigo-950/40 text-indigo-300",
    cyan: "border-cyan-500/30 bg-cyan-950/30 text-cyan-300",
    muted: "border-white/10 bg-white/5 text-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
