import { create } from "zustand";

interface UIState {
  // Notifications
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  toggleNotifications: () => void;

  // Community
  showSortMenu: boolean;
  setShowSortMenu: (show: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;

  // User Polaroids
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;

  // Editor
  showNewCardChoice: boolean;
  setShowNewCardChoice: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Notifications
  showNotifications: false,
  setShowNotifications: (show) => set({ showNotifications: show }),
  toggleNotifications: () => set((state) => ({ showNotifications: !state.showNotifications })),

  // Community
  showSortMenu: false,
  setShowSortMenu: (show) => set({ showSortMenu: show }),
  showLoginModal: false,
  setShowLoginModal: (show) => set({ showLoginModal: show }),

  // User Polaroids
  deletingId: null,
  setDeletingId: (id) => set({ deletingId: id }),
  confirmDeleteId: null,
  setConfirmDeleteId: (id) => set({ confirmDeleteId: id }),

  // Editor
  showNewCardChoice: false,
  setShowNewCardChoice: (show) => set({ showNewCardChoice: show }),
}));








