import React, { useState, useRef } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";
import { usePolaroidForm } from "@/hooks/use-polaroid-form";
import { useExportPolaroid } from "@/hooks/use-export-polaroid";
import { ProfileFields } from "@/components/form/profile-fields";
import { PolaroidPreview } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { AuthOverlay } from "@/components/auth/auth-overlay";
import { Download, Maximize2, Move, Coffee } from "lucide-react";

function FloatingBean({ delay, x, size }: { delay: number; x: number; size: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div 
      className={`absolute pointer-events-none ${sizeClass} text-accent/20`}
      style={{
        left: `${x}%`,
        top: "10%",
        animation: `drift 20s ease-in-out ${delay}s infinite`,
      }}
    >
      <Coffee className="w-full h-full" strokeWidth={1.5} />
    </div>
  );
}

export function EditorSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
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
  } = useImagePicker();
  
  const { control, register, watch, errors, handleFields, appendHandle, removeHandle } = usePolaroidForm();
  const { ref: polaroidRef, exportImage, isExporting } = useExportPolaroid();
  const [isFlashing, setIsFlashing] = useState(false);
  
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

  const profile = watch("profile");

  const handleExport = async () => {
    if (!user) {
      return;
    }

    setIsFlashing(true);
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    await exportImage();
    
    setTimeout(() => setIsFlashing(false), 300);
  };

  return (
    <section id="editor" className="py-8 lg:min-h-[700px] flex flex-col justify-center mb-16 relative overflow-hidden">
      <FloatingBean delay={0} x={5} size="sm" />
      <FloatingBean delay={3} x={15} size="md" />
      <FloatingBean delay={7} x={85} size="sm" />
      <FloatingBean delay={10} x={92} size="md" />
      
      <div 
        className="absolute top-20 right-[5%] w-24 h-24 rounded-full border-2 border-accent/5 opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 30%, transparent 50%, rgba(245, 78, 0, 0.03) 70%, transparent 90%)",
        }}
      />
      
      <div className="max-w-7xl mx-auto w-full mb-12 relative z-10 animate-[fadeInUp_0.6s_ease-out_forwards]">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-fg tracking-tight leading-tight">
            {t.editor.title}
          </h1>
          <p className="text-fg-muted font-body text-lg mt-3 max-w-xl leading-relaxed">
            {t.editor.subtitle}
          </p>
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
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:h-full relative animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
          <div 
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] pointer-events-none -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,78,0,0.08)_0%,transparent_70%)] animate-[spotlight_15s_ease-in-out_infinite]"
          />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/[0.03] blur-[80px] rounded-full pointer-events-none -z-10" />

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
               className={`absolute inset-0 bg-card z-50 pointer-events-none transition-opacity duration-300 ease-out rounded-sm ${isFlashing ? 'opacity-90' : 'opacity-0'}`}
             />

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
                 onDrop={onDrop}
                 onFileChange={onFileChange}
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

               <button 
                 type="button"
                 onClick={handleExport}
                 disabled={isExporting || !image || !user}
                 className="w-full py-4 px-8 bg-accent text-white rounded-sm font-semibold tracking-wide shadow-md hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md disabled:hover:scale-100 font-body"
               >
                 <Download className={`w-5 h-5 ${isExporting ? "animate-bounce" : ""}`} strokeWidth={1.5} />
                 {isExporting ? t.editor.exportButton.exporting : t.editor.exportButton.default}
               </button>
            </div>
        </div>
      </div>
    </section>
  );
}
