import { create } from "zustand";

interface EditorUIState {
  // Sharing
  isSharing: boolean;
  shareCopied: boolean;
  setIsSharing: (sharing: boolean) => void;
  setShareCopied: (copied: boolean) => void;

  // Tilt effect
  tilt: { x: number; y: number };
  isHovering: boolean;
  setTilt: (tilt: { x: number; y: number }) => void;
  setIsHovering: (hovering: boolean) => void;
  resetTilt: () => void;
}

export const useEditorUIStore = create<EditorUIState>((set) => ({
  // Sharing
  isSharing: false,
  shareCopied: false,
  setIsSharing: (sharing) => set({ isSharing: sharing }),
  setShareCopied: (copied) => set({ shareCopied: copied }),

  // Tilt effect
  tilt: { x: 0, y: 0 },
  isHovering: false,
  setTilt: (tilt) => set({ tilt }),
  setIsHovering: (hovering) => set({ isHovering: hovering }),
  resetTilt: () => set({ tilt: { x: 0, y: 0 }, isHovering: false }),
}));













