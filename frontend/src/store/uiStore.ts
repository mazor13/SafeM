import { create } from 'zustand';
import type { User } from 'firebase/auth';

type UIState = {
  // החלק הקיים (Sidebar) - שומרים עליו!
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // החלק החדש (Auth) - מוסיפים אותו
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  // לוגיקה קיימת
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  // לוגיקה חדשה
  user: null,
  setUser: (user) => set({ user }),
}));
