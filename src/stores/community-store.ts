import { create } from "zustand";

type SortOption = "recent" | "mostLiked";

interface CommunityState {
  sortBy: SortOption;
  maxOnly: boolean;
  setSortBy: (sort: SortOption) => void;
  setMaxOnly: (maxOnly: boolean) => void;
  toggleMaxOnly: () => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  sortBy: "recent",
  maxOnly: false,
  setSortBy: (sort) => set({ sortBy: sort }),
  setMaxOnly: (maxOnly) => set({ maxOnly }),
  toggleMaxOnly: () => set((state) => ({ maxOnly: !state.maxOnly })),
}));




