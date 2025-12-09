import { useState, useEffect, useRef, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import type { CursorProfile } from "@/types/form";
import { useCreatePolaroid, useUpdatePolaroid } from "@/hooks/use-polaroids-query";

export type SyncStatus = "idle" | "saving" | "saved" | "error";

export interface UsePolaroidAutosaveReturn {
  currentPolaroidId: string | null;
  syncStatus: SyncStatus;
  error: string | null;
  forceSave: () => Promise<void>;
}

interface UsePolaroidAutosaveParams {
  profile: CursorProfile;
  image: string | null;
  user: User | null;
  debounceMs?: number;
  hasUserInteracted: boolean;
  initialPolaroidId?: string | null;
  source?: string;
  referred_by?: string | null;
  onGenerateRenderedImages?: (polaroidId: string) => Promise<void>;
}

export function usePolaroidAutosave({
  profile,
  image,
  user,
  debounceMs = 1000,
  hasUserInteracted,
  initialPolaroidId,
  source,
  referred_by,
  onGenerateRenderedImages,
}: UsePolaroidAutosaveParams): UsePolaroidAutosaveReturn {
  const [currentPolaroidId, setCurrentPolaroidId] = useState<string | null>(initialPolaroidId ?? null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  
  const createMutation = useCreatePolaroid();
  const updateMutation = useUpdatePolaroid();
  
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedProfileRef = useRef<string | null>(null);
  const lastSavedImageRef = useRef<string | null>(null);
  const hasCreatedInitialRef = useRef(!!initialPolaroidId);

  const profileString = JSON.stringify(profile);

  useEffect(() => {
    if (initialPolaroidId !== undefined) {
      setCurrentPolaroidId(initialPolaroidId);
      hasCreatedInitialRef.current = !!initialPolaroidId;
      lastSavedProfileRef.current = null;
      lastSavedImageRef.current = null;
    }
  }, [initialPolaroidId]);

  const generateStampRotation = useCallback(() => {
    return Math.round((Math.random() * 24 - 12) * 10) / 10;
  }, []);

  const performSave = useCallback(async () => {
    if (!user || isSavingRef.current || !hasUserInteracted) {
      return;
    }

    if (!currentPolaroidId && !image) {
      return;
    }

    if (
      currentPolaroidId &&
      profileString === lastSavedProfileRef.current &&
      image === lastSavedImageRef.current
    ) {
      return;
    }

    isSavingRef.current = true;
    setSyncStatus("saving");
    setError(null);

    try {
      if (currentPolaroidId) {
        const profileChanged = profileString !== lastSavedProfileRef.current;
        const updated = await updateMutation.mutateAsync({
          id: currentPolaroidId,
          params: {
            profile,
            imageDataUrl: image,
          },
        });
        setCurrentPolaroidId(updated.id);
        lastSavedProfileRef.current = profileString;
        lastSavedImageRef.current = image;
        
        if (profileChanged && onGenerateRenderedImages) {
          await onGenerateRenderedImages(updated.id);
        }
      } else {
        const profileWithRotation = {
          ...profile,
          stampRotation: profile.stampRotation ?? generateStampRotation(),
        };
        const newPolaroid = await createMutation.mutateAsync({
          profile: profileWithRotation,
          imageDataUrl: image,
          source,
          referred_by,
        });
        setCurrentPolaroidId(newPolaroid.id);
        hasCreatedInitialRef.current = true;
        lastSavedProfileRef.current = JSON.stringify(profileWithRotation);
        lastSavedImageRef.current = image;
        
        if (onGenerateRenderedImages) {
          await onGenerateRenderedImages(newPolaroid.id);
        }
      }

      setSyncStatus("saved");
      
      setTimeout(() => {
        setSyncStatus("idle");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save polaroid";
      setError(errorMessage);
      setSyncStatus("error");
      
      setTimeout(() => {
        setSyncStatus("idle");
        setError(null);
      }, 5000);
    } finally {
      isSavingRef.current = false;
    }
  }, [user, currentPolaroidId, profile, profileString, image, hasUserInteracted, source, referred_by, createMutation, updateMutation, generateStampRotation, onGenerateRenderedImages]);

  const forceSave = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    await performSave();
  }, [performSave]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user, debounceMs, performSave]);

  useEffect(() => {
    if (!user) {
      setCurrentPolaroidId(null);
      setSyncStatus("idle");
      setError(null);
      lastSavedProfileRef.current = null;
      lastSavedImageRef.current = null;
      hasCreatedInitialRef.current = false;
    }
  }, [user]);

  return {
    currentPolaroidId,
    syncStatus,
    error,
    forceSave,
  };
}

