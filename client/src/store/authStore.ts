import { create } from "zustand";
import { getProfile, login as loginApi, logout as logoutApi } from "../api/auth";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (emailId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  initialize: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ initialized: true });
      return;
    }
    try {
      const { user } = await getProfile();
      set({ user, initialized: true });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, initialized: true });
    }
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
      await get().fetchProfile();
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
      localStorage.removeItem("token");
      set({ user: null });
    }
  },
}));
