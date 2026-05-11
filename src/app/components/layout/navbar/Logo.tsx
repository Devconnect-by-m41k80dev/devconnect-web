"use client";

import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
      <div className="relative w-8 h-8 transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/logo-icon.png"
          alt="DevConnect"
          fill
          sizes="32px"
          className="object-contain rounded-lg"
          priority
        />
      </div>
      <span
        className="hidden sm:block font-display font-bold text-lg tracking-tight"
        style={{ color: "var(--text)" }}
      >
        DevConnect
      </span>
    </Link>
  );
}
