"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/entities";
import { authApi, usersApi } from "../lib/api";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: user !== null }),

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await usersApi.getMe();
          set({ user, isAuthenticated: true });
        } catch (err) {
          const error = err as AxiosError;
          if (error.response?.status === 401) {
            
            set({ user: null, isAuthenticated: false });
          } else {
            
            console.warn("fetchMe error (no logout):", error.response?.status, error.message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (err) {
          const error = err as AxiosError;
          console.warn("Logout API failed", error.response?.status, error.message);
        } finally {
          
          set({ user: null, isAuthenticated: false });

          if (typeof window !== "undefined") {
            localStorage.removeItem("dc-auth");
          }

          window.dispatchEvent(
            new CustomEvent("open-auth-modal", { detail: { mode: "login" } }),
          );
        }
      },

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "dc-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        
        if (state) {
          state.isAuthenticated = false;
        }
      },
    },
  ),
);