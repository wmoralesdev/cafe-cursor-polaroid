import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";
import { usePolaroidForm, getDefaultProfile } from "@/hooks/use-polaroid-form";
import { useExportPolaroid } from "@/hooks/use-export-polaroid";
import { useOGImageGenerator } from "@/hooks/use-og-image-generator";
import { usePolaroidAutosave } from "@/hooks/use-polaroid-autosave";
import { ProfileFields } from "@/components/form/profile-fields";
import { EditorPreview } from "./editor-preview";
import { EditorActions } from "./editor-actions";
import { OGCard } from "@/components/polaroid/og-card";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useTracking } from "@/contexts/tracking-context";
import { AuthOverlay } from "@/components/auth/auth-overlay";
import { Loader2, CheckCircle2, AlertCircle, ChevronUp } from "lucide-react";
import { useUpdatePolaroid, useCreatePolaroid } from "@/hooks/use-polaroids-query";
import { useEditorUIStore } from "@/stores/editor-ui-store";
import { useUIStore } from "@/stores/ui-store";
import { usePolaroidStore } from "@/stores/polaroid-store";
import { SectionHeader } from "@/components/ui/section-header";
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
  
  const { t, lang } = useLanguage();
  const { user, provider } = useAuth();
  const { source, referredBy } = useTracking();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const isEditingExisting = !!initialPolaroid;
  
  useEffect(() => {
    if (initialPolaroid && onPolaroidChange) {
      const storePolaroid = usePolaroidStore.getState().activePolaroid;
      if (storePolaroid?.id !== initialPolaroid?.id) {
        usePolaroidStore.getState().setActivePolaroid(initialPolaroid);
      }
    }
  }, [initialPolaroid, onPolaroidChange]);
  
  const initialImage = (initialPolaroid?.source_image_url && initialPolaroid.source_image_url.trim() !== "")
    ? initialPolaroid.source_image_url
    : (initialPolaroid?.image_url && initialPolaroid.image_url.trim() !== "")
    ? initialPolaroid.image_url
    : null;
  
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
  } = useImagePicker({ initialImage });
  
  const { control, register, watch, errors, handleFields, appendHandle, removeHandle, reset } = usePolaroidForm({
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
  
  const updateMutation = useUpdatePolaroid();
  const createMutation = useCreatePolaroid();
  const setIsSharing = useEditorUIStore((state) => state.setIsSharing);
  const setShareCopied = useEditorUIStore((state) => state.setShareCopied);
  
  const { ref: polaroidRef, exportImage, isExporting, generateImageDataUrl } = useExportPolaroid();
  const { ogCardRef, generateOGImage } = useOGImageGenerator();

  const generateRenderedImages = useCallback(async (polaroidId: string) => {
    if (!polaroidRef.current) return;
    
    try {
      const dataUrl = await generateImageDataUrl();
      if (dataUrl) {
        await updateMutation.mutateAsync({
          id: polaroidId,
          params: {
            imageDataUrl: dataUrl,
          },
        });
      }
    } catch (err) {
      console.error("Failed to generate rendered images:", err);
    }
  }, [generateImageDataUrl, updateMutation, polaroidRef]);

  const { currentPolaroidId, syncStatus, forceSave } = usePolaroidAutosave({
    profile,
    image,
    user: user || null,
    hasUserInteracted,
    initialPolaroidId: initialPolaroid?.id,
    source,
    referred_by: referredBy,
    onGenerateRenderedImages: generateRenderedImages,
  });

  const handleExportClick = async () => {
    if (!user || !image) return;
    
    await forceSave();
    await exportImage();
  };

  const handleNewCard = async () => {
    if (!user) return;
    
    // Save current polaroid if it exists
    if (currentPolaroidId) {
      await forceSave();
    }
    
    // Reset form to default values
    reset({ profile: getDefaultProfile() });
    
    // Clear image
    clearImage();
    
    // Reset store state
    usePolaroidStore.getState().setActivePolaroid(null);
    usePolaroidStore.getState().incrementEditorKey();
    setHasUserInteracted(false);
    
    // Notify parent if needed
    onPolaroidChange?.(null);
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
      
      // Generate both the polaroid export and OG image
      const [dataUrl, ogImageDataUrl] = await Promise.all([
        exportImage(),
        generateOGImage(),
      ]);
      
      if (currentPolaroidId) {
        try {
          await updateMutation.mutateAsync({
            id: currentPolaroidId,
            params: {
              imageDataUrl: dataUrl || undefined,
              ogImageDataUrl: ogImageDataUrl || undefined,
              provider: socialProvider === "twitter" ? "twitter" : "github",
            },
          });
        } catch (err) {
          console.error("Failed to update polaroid", err);
        }
      }

      // Get the slug from the active polaroid for a cleaner share URL
      const activePolaroid = usePolaroidStore.getState().activePolaroid;
      const slug = activePolaroid?.slug;
      
      // Use slug-based URL if available, otherwise fall back to ID
      const shareUrlString = slug 
        ? `${window.location.origin}/c/${slug}`
        : `${window.location.origin}/?p=${currentPolaroidId}&ref=${user.id}`;
      
      const shareText = `Check out my @cursor_ai dev card!`;

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
    <section id="editor" className="w-full py-12 overflow-hidden">
      {/* Hidden OG Card for capture */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px", pointerEvents: "none" }}>
        <OGCard
          ref={ogCardRef}
          profile={profile}
          imageUrl={image}
          lang={lang}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <SectionHeader
            as="h1"
            className="animate-[fadeInUp_0.6s_ease-out_forwards]"
            title={t.editor.title}
            subtitle={t.editor.subtitle}
          />
        </div>

        {/* Adaptive layout: render each major block ONCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Preview (mobile first, desktop right) */}
          <div id="editor-preview" className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center gap-6 relative animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
            {isLoadingInitial ? (
              <div className="w-full h-[510px] bg-card rounded-sm shadow-polaroid flex flex-col items-center justify-center gap-4 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-accent" strokeWidth={1.5} />
                <span className="text-sm text-fg-muted font-body">{t.editor.loading || "Loading your card..."}</span>
              </div>
            ) : (
              <div className="w-full lg:sticky lg:top-24">
                <div className="glass-panel p-5 sm:p-6 flex flex-col items-center" style={{ backgroundColor: "unset", background: "unset" }}>
                  {user && (
                    <div className="w-full max-w-[340px] mb-6 flex flex-col gap-2">
                      {/* Sync status indicator */}
                      <div
                        className={`flex items-center justify-center gap-2 text-xs font-medium h-5 transition-opacity duration-200 ${
                          syncStatus !== "idle" ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {syncStatus === "saving" && (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-fg-muted" strokeWidth={1.5} />
                            <span className="text-fg-muted">{t.editor.syncStatus.saving}</span>
                          </>
                        )}
                        {syncStatus === "saved" && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" strokeWidth={1.5} />
                            <span className="text-green-600">{t.editor.syncStatus.saved}</span>
                          </>
                        )}
                        {syncStatus === "error" && (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" strokeWidth={1.5} />
                            <span className="text-red-500">{t.editor.syncStatus.error}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

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
                    onNewCardRequested={handleNewCard}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form (mobile second, desktop left) */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col gap-6 animate-[fadeInUp_0.6s_ease-out_0.1s_forwards] opacity-0 relative">
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
        </div>
      </div>

      {/* Floating button to scroll to preview (mobile only) */}
      <button
        type="button"
        onClick={() => {
          const previewElement = document.getElementById("editor-preview");
          if (previewElement) {
            previewElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
        aria-label={t.form.viewPreview}
      >
        <ChevronUp className="w-6 h-6" strokeWidth={2} />
      </button>
    </section>
  );
}
