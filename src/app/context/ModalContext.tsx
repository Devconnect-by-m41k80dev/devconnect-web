"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AuthModal } from "../components/auth/AuthModal";

type AuthMode = "login" | "register";

type ModalContextType = {
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);


function getInitialAuthState(): { open: boolean; mode: AuthMode } {
  if (typeof window === "undefined") {
    return { open: false, mode: "login" };
  }

  const params = new URLSearchParams(window.location.search);
  const authParam = params.get("auth") as AuthMode | null;

  if (authParam === "login" || authParam === "register") {
    
    const clean = new URL(window.location.href);
    clean.searchParams.delete("auth");
    clean.searchParams.delete("redirect");
    window.history.replaceState({}, "", clean.toString());

    return { open: true, mode: authParam };
  }

  return { open: false, mode: "login" };
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const initial = getInitialAuthState();

  const [authOpen, setAuthOpen] = useState(initial.open);
  const [mode, setMode] = useState<AuthMode>(initial.mode);

  const openAuth = (m: AuthMode = "login") => {
    setMode(m);
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);

  
  useEffect(() => {
    const handler = (e: CustomEvent) => openAuth(e.detail?.mode ?? "login");
    window.addEventListener("open-auth-modal", handler as EventListener);

    return () => {
      window.removeEventListener("open-auth-modal", handler as EventListener);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}

      
      <AuthModal
        key={authOpen ? mode : "closed"}
        open={authOpen}
        onClose={closeAuth}
        mode={mode}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};