import React, { useState, useRef } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";
import { usePolaroidForm } from "@/hooks/use-polaroid-form";
import { useExportPolaroid } from "@/hooks/use-export-polaroid";
import { usePolaroidAutosave } from "@/hooks/use-polaroid-autosave";
import { ProfileFields } from "@/components/form/profile-fields";
import { PolaroidPreview } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { AuthOverlay } from "@/components/auth/auth-overlay";
import { Download, Maximize2, Move, Loader2, CheckCircle2, AlertCircle, Linkedin, Plus } from "lucide-react";
import { useUpdatePolaroid, useCreatePolaroid } from "@/hooks/use-polaroids-query";
import { XIcon } from "@/components/ui/x-icon";
import type { PolaroidRecord } from "@/lib/polaroids";

interface EditorSectionProps {
  initialPolaroid?: PolaroidRecord | null;
  onPolaroidChange?: (polaroid: PolaroidRecord | null) => void;
}

export function EditorSection({ initialPolaroid, onPolaroidChange }: EditorSectionProps) {
  const { t } = useLanguage();
  const { user, provider } = useAuth();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const isEditingExisting = !!initialPolaroid;
  
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
  } = useImagePicker({ initialImage: initialPolaroid?.image_url });
  
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
  const { ref: polaroidRef, exportImage, isExporting } = useExportPolaroid();
  const [isFlashing, setIsFlashing] = useState(false);
  
  const profile = watch("profile");
  
  const { currentPolaroidId, syncStatus, forceSave } = usePolaroidAutosave({
    profile,
    image,
    user: user || null,
    hasUserInteracted,
    initialPolaroidId: initialPolaroid?.id,
  });

  const updateMutation = useUpdatePolaroid();
  const createMutation = useCreatePolaroid();
  const [isSharing, setIsSharing] = useState(false);
  const [showExportChoice, setShowExportChoice] = useState(false);
  
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleExportClick = () => {
    if (!user || !currentPolaroidId) return;
    if (isEditingExisting) {
      setShowExportChoice(true);
    } else {
      performExport("overwrite");
    }
  };

  const performExport = async (mode: "overwrite" | "create-new") => {
    if (!user || !currentPolaroidId) {
      return;
    }

    setShowExportChoice(false);
    await forceSave();

    setIsFlashing(true);
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    const dataUrl = await exportImage();
    
    if (dataUrl) {
      try {
        if (mode === "overwrite") {
          await updateMutation.mutateAsync({
            id: currentPolaroidId,
            params: {
              imageDataUrl: dataUrl,
            },
          });
        } else {
          const newPolaroid = await createMutation.mutateAsync({
            profile: {
              ...profile,
              stampRotation: profile.stampRotation ?? generateStampRotation(),
            },
            imageDataUrl: dataUrl,
          });
          onPolaroidChange?.(newPolaroid);
        }
      } catch (err) {
        console.error("Failed to export polaroid", err);
      }
    }
    
    setTimeout(() => setIsFlashing(false), 300);
  };

  // Generate a random stamp rotation between -12 and 12 degrees
  function generateStampRotation(): number {
    return Math.round((Math.random() * 24 - 12) * 10) / 10;
  }

  const handleShare = async (socialProvider: "twitter" | "linkedin_oidc") => {
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
              is_published: true,
              provider: socialProvider === "twitter" ? "twitter" : "linkedin",
            },
          });
        } catch (err) {
          console.error("Failed to update polaroid", err);
        }
      }

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = new URL(baseUrl);
      shareUrl.searchParams.set("p", currentPolaroidId);
      const shareUrlString = shareUrl.toString();
      const shareText = `Check out my dev card: ${shareUrlString}`;

      if (socialProvider === "twitter") {
        const twitterIntentUrl = new URL("https://twitter.com/intent/tweet");
        twitterIntentUrl.searchParams.set("text", shareText);
        twitterIntentUrl.searchParams.set("url", shareUrlString);
        window.open(twitterIntentUrl.toString(), "_blank", "noopener,noreferrer");
      } else {
        const linkedInIntentUrl = new URL("https://www.linkedin.com/sharing/share-offsite");
        linkedInIntentUrl.searchParams.set("url", shareUrlString);
        window.open(linkedInIntentUrl.toString(), "_blank", "noopener,noreferrer");
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

          <div className={`relative w-full max-w-[340px] mx-auto ${!user ? "opacity-40" : ""}`}>
            <div 
              ref={tiltRef}
              className="relative w-full"
              style={{ perspective: "1000px" }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={handleMouseLeave}
            >

             <div 
               className="w-full transition-transform duration-200 ease-out"
               style={{
                 transform: isHovering 
                   ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` 
                   : "rotateX(0) rotateY(0) scale(1)",
                 transformStyle: "preserve-3d",
               }}
             >
               <PolaroidPreview
                 image={image}
                 profile={profile}
                 variant="preview"
                 onDrop={handleImageDrop}
                 onFileChange={handleImageFileChange}
                 clearImage={clearImage}
                 error={imageError}
                 zoom={zoom}
                 position={position}
               />
             </div>

             <div className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10" aria-hidden="true">
               <PolaroidPreview
                 ref={polaroidRef}
                 image={image}
                 profile={profile}
                 variant="export"
                 zoom={zoom}
                 position={position}
               />
             </div>
          </div>
          </div>
            
            <div className="mt-8 w-full max-w-sm space-y-6">
               {image && (
                  <div className="p-5 card-panel space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted">
                          <span className="flex items-center gap-1.5 font-body">
                            <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {t.editor.imageControls.zoom}
                          </span>
                          <span className="font-mono text-fg-muted">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="0.1" 
                          value={zoom} 
                          onChange={(e) => setZoom(parseFloat(e.target.value))} 
                          className="w-full h-1.5 bg-card-02 rounded-full appearance-none cursor-pointer accent-accent" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted">
                            <span className="flex items-center gap-1.5 font-body">
                              <Move className="w-3.5 h-3.5" strokeWidth={1.5} />
                              {t.editor.imageControls.panX}
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="-150" 
                            max="150" 
                            value={position.x} 
                            onChange={(e) => setPosition({...position, x: parseInt(e.target.value)})} 
                            className="w-full h-1.5 bg-card-02 rounded-full appearance-none cursor-pointer accent-accent" 
                          />
                        </div>
                         <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted">
                            <span className="flex items-center gap-1.5 font-body">
                              <Move className="w-3.5 h-3.5 rotate-90" strokeWidth={1.5} />
                              {t.editor.imageControls.panY}
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="-150" 
                            max="150" 
                            value={position.y} 
                            onChange={(e) => setPosition({...position, y: parseInt(e.target.value)})} 
                            className="w-full h-1.5 bg-card-02 rounded-full appearance-none cursor-pointer accent-accent" 
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-center">
                        <button 
                          type="button"
                          onClick={() => { setZoom(1); setPosition({x:0, y:0}); }}
                          className="text-xs font-medium text-fg-muted hover:text-accent transition-colors duration-150 underline underline-offset-2 decoration-1"
                        >
                          {t.editor.imageControls.reset}
                        </button>
                      </div>
                  </div>
               )}

               <div className="space-y-3">
                 {user && (
                   <div className="text-xs text-fg-muted font-body text-center mb-2">
                     {isEditingExisting ? (
                       <span>Editing existing card</span>
                     ) : (
                       <span>Creating new card</span>
                     )}
                   </div>
                 )}

                 {showExportChoice && (
                   <div className="p-4 card-panel border border-border rounded-sm space-y-3 animate-[fadeIn_0.2s_ease-out]">
                     <p className="text-sm text-fg font-body text-center">
                       What would you like to do?
                     </p>
                     <div className="flex gap-2">
                       <button
                         type="button"
                         onClick={() => performExport("overwrite")}
                         className="flex-1 py-2 px-3 bg-accent text-white rounded-sm font-medium text-sm hover:bg-accent/90 transition-colors"
                       >
                         Overwrite
                       </button>
                       <button
                         type="button"
                         onClick={() => performExport("create-new")}
                         className="flex-1 py-2 px-3 bg-card border border-border text-fg rounded-sm font-medium text-sm hover:bg-card-02 transition-colors"
                       >
                         <Plus className="w-3.5 h-3.5 inline mr-1" />
                         New card
                       </button>
                     </div>
                     <button
                       type="button"
                       onClick={() => setShowExportChoice(false)}
                       className="w-full text-xs text-fg-muted hover:text-fg transition-colors"
                     >
                       Cancel
                     </button>
                   </div>
                 )}

                 {!showExportChoice && (
                   <button 
                     type="button"
                     onClick={handleExportClick}
                     disabled={isExporting || !image || !user || !currentPolaroidId}
                     className="w-full py-4 px-8 bg-accent text-white rounded-sm font-semibold tracking-wide shadow-md hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md disabled:hover:scale-100 font-body"
                   >
                     <Download className={`w-5 h-5 ${isExporting ? "animate-bounce" : ""}`} strokeWidth={1.5} />
                     {isExporting ? t.editor.exportButton.exporting : t.editor.exportButton.default}
                   </button>
                 )}

                 {provider && currentPolaroidId && (
                   <>
                     {provider === "twitter" && (
                       <button
                         type="button"
                         onClick={() => handleShare("twitter")}
                         disabled={isSharing || isExporting || !image || !user || !currentPolaroidId}
                         className="w-full py-3 px-6 bg-card border border-border text-fg rounded-sm font-medium tracking-wide shadow-sm hover:bg-card-02 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:scale-100 font-body"
                       >
                         <XIcon className="w-4 h-4" />
                         <span>{isSharing ? "Opening X…" : "Share on X"}</span>
                       </button>
                     )}
                     {provider === "linkedin_oidc" && (
                       <button
                         type="button"
                         onClick={() => handleShare("linkedin_oidc")}
                         disabled={isSharing || isExporting || !image || !user || !currentPolaroidId}
                         className="w-full py-3 px-6 bg-card border border-border text-fg rounded-sm font-medium tracking-wide shadow-sm hover:bg-card-02 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:scale-100 font-body"
                       >
                         <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                         <span>{isSharing ? "Opening LinkedIn…" : "Share on LinkedIn"}</span>
                       </button>
                     )}
                   </>
                 )}
               </div>
            </div>
        </div>
      </div>
    </section>
  );
}
