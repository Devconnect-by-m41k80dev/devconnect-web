import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "var(--brand)" }}
        />
      </div>
      <div className="relative text-center max-w-md anim-fade-up">
        <div
          className="font-display text-8xl font-bold text-gradient mb-4"
          style={{ lineHeight: 1 }}
        >
          404
        </div>
        <h1
          className="font-display text-2xl font-bold mb-3"
          style={{ color: "var(--text)" }}
        >
          Page not found
        </h1>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          {"This page doesn't exist or has been moved."}
        </p>
        <Link href="/" className="dc-btn-primary px-6 py-3 inline-flex">
          Go home
        </Link>
      </div>
    </div>
  );
}
