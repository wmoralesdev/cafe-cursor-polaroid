import type React from "react";
import { useState, useEffect } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";
import { usePolaroidForm } from "@/hooks/use-polaroid-form";
import { useExportPolaroid } from "@/hooks/use-export-polaroid";
import { usePolaroidAutosave } from "@/hooks/use-polaroid-autosave";
import { ProfileFields } from "@/components/form/profile-fields";
import { EditorPreview } from "./editor-preview";
import { EditorActions } from "./editor-actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useTracking } from "@/contexts/tracking-context";
import { AuthOverlay } from "@/components/auth/auth-overlay";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useUpdatePolaroid, useCreatePolaroid } from "@/hooks/use-polaroids-query";
import { useEditorUIStore } from "@/stores/editor-ui-store";
import { useUIStore } from "@/stores/ui-store";
import { usePolaroidStore } from "@/stores/polaroid-store";
import type { PolaroidRecord } from "@/lib/polaroids";
import type { CursorProfile } from "@/types/form";

interface EditorSectionProps {
  initialPolaroid?: PolaroidRecord | null;
  onPolaroidChange?: (polaroid: PolaroidRecord | null) => void;
}

export function EditorSection({ initialPolaroid, onPolaroidChange }: EditorSectionProps) {
  // Get values from store
  const newCardRequested = usePolaroidStore((state) => state.newCardRequested);
  const isLoadingInitial = usePolaroidStore((state) => state.isLoadingInitial);
  const handleNewCardHandled = usePolaroidStore((state) => state.handleNewCardHandled);
  
  const { t } = useLanguage();
  const { user, provider } = useAuth();
  const { source, referredBy } = useTracking();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const isEditingExisting = !!initialPolaroid;
  
  // Sync store with prop changes
  useEffect(() => {
    if (initialPolaroid && onPolaroidChange) {
      // Store is source of truth, but sync if prop changes externally
      const storePolaroid = usePolaroidStore.getState().activePolaroid;
      if (storePolaroid?.id !== initialPolaroid?.id) {
        usePolaroidStore.getState().setActivePolaroid(initialPolaroid);
      }
    }
  }, [initialPolaroid, onPolaroidChange]);
  
  const { 
    image, 
    error: imageError, 
    zoom,
    position,
    setZoom,
    setPosition,
    onDrop, 
    onFileChange, 
    clearImage 
  } = useImagePicker({ initialImage: initialPolaroid?.source_image_url || initialPolaroid?.image_url });
  
  const { control, register, watch, errors, handleFields, appendHandle, removeHandle } = usePolaroidForm({
    initialProfile: initialPolaroid?.profile,
  });
  
  const handleInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };
  
  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleInteraction();
    onDrop(e);
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInteraction();
    onFileChange(e);
  };
  const profile = watch("profile");
  
  const { currentPolaroidId, syncStatus, forceSave } = usePolaroidAutosave({
    profile,
    image,
    user: user || null,
    hasUserInteracted,
    initialPolaroidId: initialPolaroid?.id,
    source,
    referred_by: referredBy,
  });

  const updateMutation = useUpdatePolaroid();
  const createMutation = useCreatePolaroid();
  const setIsSharing = useEditorUIStore((state) => state.setIsSharing);
  const setShareCopied = useEditorUIStore((state) => state.setShareCopied);
  
  const { ref: polaroidRef, exportImage, isExporting } = useExportPolaroid();


  const handleExportClick = async () => {
    if (!user || !image) return;
    
    await forceSave();
    await exportImage();
  };

  function generateStampRotation(): number {
    return Math.round((Math.random() * 24 - 12) * 10) / 10;
  }

  const handleNewCardOverwrite = async () => {
    if (!user || !currentPolaroidId) return;
    
    setShowNewCardChoice(false);
    
    const defaultProfile: CursorProfile = {
      handles: [{ handle: "", platform: "x" }],
      primaryModel: "composer-1",
      secondaryModel: "gpt-5.1",
      favoriteFeature: "agent",
      planTier: "pro",
      projectType: "",
      extras: [],
      isMaxMode: false,
      cursorSince: "2024",
      stampRotation: generateStampRotation(),
      generatedAt: new Date().toISOString().split("T")[0],
    };
    
    try {
      const updated = await updateMutation.mutateAsync({
        id: currentPolaroidId,
        params: {
          profile: defaultProfile,
          imageDataUrl: null,
        },
      });
      clearImage();
      usePolaroidStore.getState().setActivePolaroid(updated);
      onPolaroidChange?.(updated);
    } catch (err) {
      console.error("Failed to overwrite polaroid", err);
    }
  };

  const handleNewCardCreate = async () => {
    if (!user || !image) return;
    
    setShowNewCardChoice(false);
    await forceSave();
    
    try {
      const newPolaroid = await createMutation.mutateAsync({
        profile: {
          ...profile,
          stampRotation: profile.stampRotation ?? generateStampRotation(),
        },
        imageDataUrl: image,
        source,
        referred_by: referredBy,
      });
      usePolaroidStore.getState().setActivePolaroid(newPolaroid);
      onPolaroidChange?.(newPolaroid);
    } catch (err) {
      console.error("Failed to create new polaroid", err);
    }
  };

  const setShowNewCardChoice = useUIStore((state) => state.setShowNewCardChoice);
  
  useEffect(() => {
    if (newCardRequested && isEditingExisting && currentPolaroidId) {
      setShowNewCardChoice(true);
      handleNewCardHandled();
    } else if (!newCardRequested) {
      setShowNewCardChoice(false);
    }
  }, [newCardRequested, isEditingExisting, currentPolaroidId, handleNewCardHandled, setShowNewCardChoice]);

  const handleCopyShareLink = async () => {
    if (!user || !currentPolaroidId) {
      return;
    }

    try {
      await forceSave();
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = new URL(baseUrl);
      shareUrl.searchParams.set("ref", user.id);
      const shareUrlString = shareUrl.toString();
      
      await navigator.clipboard.writeText(shareUrlString);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy share link", err);
    }
  };

  const handleShare = async (socialProvider: "twitter" | "github") => {
    if (!user || !currentPolaroidId || !image) {
      return;
    }

    setIsSharing(true);

    try {
      await forceSave();
      const dataUrl = await exportImage();
      
      if (dataUrl && currentPolaroidId) {
        try {
          await updateMutation.mutateAsync({
            id: currentPolaroidId,
            params: {
              imageDataUrl: dataUrl,
              provider: socialProvider === "twitter" ? "twitter" : "github",
            },
          });
        } catch (err) {
          console.error("Failed to update polaroid", err);
        }
      }

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = new URL(baseUrl);
      shareUrl.searchParams.set("p", currentPolaroidId);
      shareUrl.searchParams.set("ref", user.id);
      const shareUrlString = shareUrl.toString();
      const shareText = `Check out my dev card: ${shareUrlString}`;

      if (socialProvider === "twitter") {
        const twitterIntentUrl = new URL("https://twitter.com/intent/tweet");
        twitterIntentUrl.searchParams.set("text", shareText);
        twitterIntentUrl.searchParams.set("url", shareUrlString);
        window.open(twitterIntentUrl.toString(), "_blank", "noopener,noreferrer");
      } else {
        // GitHub doesn't have a share intent URL, so we'll just copy to clipboard
        await navigator.clipboard.writeText(shareUrlString);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to share polaroid", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <section id="editor" className="py-8 lg:min-h-[700px] flex flex-col justify-center mb-16 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto w-full mb-12 relative z-10 animate-[fadeInUp_0.6s_ease-out_forwards]">
        <div className="max-w-2xl flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-fg tracking-tight leading-tight">
              {t.editor.title}
            </h1>
            <p className="text-fg-muted font-body text-lg mt-3 max-w-xl leading-relaxed">
              {t.editor.subtitle}
            </p>
          </div>
          {user && syncStatus !== "idle" && (
            <div className="flex items-center gap-2 text-xs font-medium text-fg-muted mt-2">
              {syncStatus === "saving" && (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                  <span>{t.editor.syncStatus.saving}</span>
                </>
              )}
              {syncStatus === "saved" && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                  <span className="text-accent">{t.editor.syncStatus.saved}</span>
                </>
              )}
              {syncStatus === "error" && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                  <span className="text-accent">{t.editor.syncStatus.error}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-6 flex flex-col gap-6 animate-[fadeInUp_0.6s_ease-out_0.1s_forwards] opacity-0 relative">
          {!user && <AuthOverlay />}
          <div className={user ? "" : "pointer-events-none opacity-40"}>
            <ProfileFields
              control={control}
              register={register}
              errors={errors}
              handleFields={handleFields}
              appendHandle={appendHandle}
              removeHandle={removeHandle}
              onInteraction={handleInteraction}
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:h-full relative animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
          {isLoadingInitial ? (
            <div className="w-full h-[510px] bg-card rounded-sm shadow-polaroid flex flex-col items-center justify-center gap-4 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin text-accent" strokeWidth={1.5} />
              <span className="text-sm text-fg-muted font-body">{t.editor.loading || "Loading your card..."}</span>
            </div>
          ) : (
            <>
              <EditorPreview
                image={image}
                profile={profile}
                zoom={zoom}
                position={position}
                imageError={imageError}
                onDrop={handleImageDrop}
                onFileChange={handleImageFileChange}
                clearImage={clearImage}
                source={source}
                polaroidRef={polaroidRef}
                user={!!user}
              />
              <EditorActions
                image={image}
                zoom={zoom}
                position={position}
                setZoom={setZoom}
                setPosition={setPosition}
                isExporting={isExporting}
                user={!!user}
                isEditingExisting={isEditingExisting}
                currentPolaroidId={currentPolaroidId}
                provider={provider || null}
                onExport={handleExportClick}
                onCopyShareLink={handleCopyShareLink}
                onShare={handleShare}
                onNewCardOverwrite={handleNewCardOverwrite}
                onNewCardCreate={handleNewCardCreate}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
