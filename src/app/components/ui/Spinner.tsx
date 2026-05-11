import { cn } from "@/app/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      className={cn(
        "block rounded-full border-2 animate-spin-slow",
        sizes[size],
        className,
      )}
      style={{
        borderColor: "var(--border)",
        borderTopColor: "var(--brand)",
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
