import { useEffect, useRef } from "react";
import { useUserPolaroids } from "@/hooks/use-polaroids-query";
import { useAuth } from "@/hooks/use-auth";
import { usePolaroidStore } from "@/stores/polaroid-store";

export function usePolaroidManagement() {
  const { user } = useAuth();
  const hasLoadedInitialRef = useRef(false);
  const { data: userPolaroids = [], isLoading: isLoadingPolaroids } = useUserPolaroids(!!user);
  const activePolaroid = usePolaroidStore((state) => state.activePolaroid);
  const setActivePolaroid = usePolaroidStore((state) => state.setActivePolaroid);
  const setIsLoadingInitial = usePolaroidStore((state) => state.setIsLoadingInitial);

  // Auto-select first polaroid when user polaroids load
  useEffect(() => {
    if (!hasLoadedInitialRef.current && userPolaroids.length > 0 && activePolaroid === null) {
      setActivePolaroid(userPolaroids[0]);
      hasLoadedInitialRef.current = true;
    }
  }, [userPolaroids, activePolaroid, setActivePolaroid]);

  // Sync loading state
  useEffect(() => {
    setIsLoadingInitial(isLoadingPolaroids && !hasLoadedInitialRef.current);
  }, [isLoadingPolaroids, setIsLoadingInitial]);

  return {
    activePolaroid,
    setActivePolaroid,
    editorKey: usePolaroidStore((state) => state.editorKey),
    newCardRequested: usePolaroidStore((state) => state.newCardRequested),
    isLoadingInitial: usePolaroidStore((state) => state.isLoadingInitial),
    handleSelectPolaroid: usePolaroidStore((state) => state.handleSelectPolaroid),
    handleAddNew: usePolaroidStore((state) => state.handleAddNew),
    handleNewCardHandled: usePolaroidStore((state) => state.handleNewCardHandled),
  };
}

