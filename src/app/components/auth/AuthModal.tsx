"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { LoginForm } from "./LoginFormModal";
import { RegisterForm } from "./RegisterFormModal";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "login" | "register";
}

export function AuthModal({ open, onClose, mode = "login" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(mode === "login");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border p-8 shadow-2xl anim-scale-in"
        style={{
          background: "var(--bg-raised)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm mt-1">
            {isLogin
              ? "Sign in to your DevConnect account"
              : "Join DevConnect and start collaborating"}
          </p>
        </div>

        {isLogin ? (
          <LoginForm onSwitch={() => setIsLogin(false)} onSuccess={onClose} />
        ) : (
          <RegisterForm onSwitch={() => setIsLogin(true)} onSuccess={onClose} />
        )}
      </div>
    </div>
  );
}