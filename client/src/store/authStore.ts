import { create } from "zustand";
import { getProfile, login as loginApi, logout as logoutApi } from "../api/auth";
import { clearAllAiChats } from "../store/aiChatStore";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  restoring: boolean;
  login: (emailId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  clearSession: () => void;
}

let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  restoring: false,

  setUser: (user) => set({ user }),

  clearSession: () => {
    localStorage.removeItem("token");
    clearAllAiChats();
    set({ user: null });
  },

  initialize: async () => {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      set({ restoring: true });

      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, initialized: true, restoring: false });
        return;
      }

      try {
        const { user } = await getProfile();
        set({ user, initialized: true, restoring: false });
      } catch {
        get().clearSession();
        set({ initialized: true, restoring: false });
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },

  fetchProfile: async () => {
    const { user } = await getProfile();
    set({ user });
  },

  login: async (emailId, password) => {
    set({ loading: true });
    try {
      const { token } = await loginApi({ emailId, password });
      localStorage.setItem("token", token);
      const { user } = await getProfile();
      set({ user, initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    } finally {
      get().clearSession();
    }
  },
}));
