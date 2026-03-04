"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-accent text-white hover:opacity-90",
        variant === "secondary" &&
          "bg-surface text-text-secondary hover:text-text-primary border border-border-col",
        variant === "outline" &&
          "border border-border-col text-text-secondary hover:text-text-primary hover:border-accent",
        variant === "ghost" && "text-text-secondary hover:text-text-primary hover:bg-surface",
        variant === "link" && "text-accent underline-offset-4 hover:underline p-0",
        size === "default" && "px-6 py-3 text-sm",
        size === "sm" && "px-4 py-2 text-xs",
        size === "lg" && "px-8 py-4 text-base",
        size === "icon" && "w-10 h-10 p-0",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
