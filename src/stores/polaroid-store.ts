import { create } from "zustand";
import type { PolaroidRecord } from "@/lib/polaroids";

interface PolaroidState {
  activePolaroid: PolaroidRecord | null;
  editorKey: number;
  newCardRequested: boolean;
  isLoadingInitial: boolean;
  setActivePolaroid: (polaroid: PolaroidRecord | null) => void;
  incrementEditorKey: () => void;
  setNewCardRequested: (requested: boolean) => void;
  setIsLoadingInitial: (loading: boolean) => void;
  handleSelectPolaroid: (polaroid: PolaroidRecord | null) => void;
  handleAddNew: () => void;
  handleNewCardHandled: () => void;
}

export const usePolaroidStore = create<PolaroidState>((set, get) => ({
  activePolaroid: null,
  editorKey: 0,
  newCardRequested: false,
  isLoadingInitial: false,
  setActivePolaroid: (polaroid) => set({ activePolaroid: polaroid }),
  incrementEditorKey: () => set((state) => ({ editorKey: state.editorKey + 1 })),
  setNewCardRequested: (requested) => set({ newCardRequested: requested }),
  setIsLoadingInitial: (loading) => set({ isLoadingInitial: loading }),
  handleSelectPolaroid: (polaroid) => {
    set({ activePolaroid: polaroid, newCardRequested: false });
    document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
  },
  handleAddNew: () => {
    const { activePolaroid } = get();
    if (activePolaroid) {
      set({ newCardRequested: true });
    } else {
      set({ activePolaroid: null });
      set((state) => ({ editorKey: state.editorKey + 1 }));
      document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
    }
  },
  handleNewCardHandled: () => set({ newCardRequested: false }),
}));








