"use client";
import { useState } from "react";
import Image from "next/image";
import { getInitials, cn } from "@/app/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  fullName?: string;
  profileImageUrl?: string | null;
  size?: Size;
  className?: string;
}

const sizeMap: Record<Size, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

function hueFromString(s?: string): number {
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 360;
  }
  return h;
}

export function Avatar({
  fullName,
  profileImageUrl,
  size = "md",
  className,
}: AvatarProps) {
  const safeName = (fullName || "User").trim();
  const [imgError, setImgError] = useState(false);

  const hue = hueFromString(safeName);
  const bg = `linear-gradient(135deg, hsl(${hue} 55% 48%), hsl(${
    (hue + 60) % 360
  } 55% 55%))`;

  if (profileImageUrl && !imgError) {
    return (
      <Image
        src={profileImageUrl}
        alt={safeName}
        width={64}
        height={64}
        onError={() => setImgError(true)}
        className={cn(
          "rounded-xl object-cover shrink-0 bg-muted",
          sizeMap[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center text-white font-semibold shrink-0 font-sans select-none",
        sizeMap[size],
        className,
      )}
      style={{ background: bg }}
      aria-label={safeName}
      title={safeName}
    >
      {getInitials(safeName)}
    </div>
  );
}
