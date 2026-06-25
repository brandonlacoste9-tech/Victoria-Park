"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({
  className,
  showWordmark = true,
  size = 36,
  variant = "dark",
  href = "/",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  variant?: "dark" | "light";
  href?: string;
}) {
  return (
    <a
      href={href}
      className={cn("group relative z-50 inline-flex items-center", className)}
      aria-label="Victoria Park home"
    >
      <img
        src="/logo.png"
        alt="Victoria Park Medispa"
        className="pointer-events-none h-12 w-auto shrink-0 transition-transform group-hover:scale-105 [clip-path:inset(0_2px_0_2px)]"
      />
    </a>
  );
}