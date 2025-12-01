import React, { useState } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";
import { usePolaroidForm } from "@/hooks/use-polaroid-form";
import { useExportPolaroid } from "@/hooks/use-export-polaroid";
import { ProfileArrayFields } from "@/components/form/profile-array-fields";
import { PolaroidPreview } from "@/components/polaroid/polaroid-card";
import { Download, Maximize2, Move } from "lucide-react";

export function EditorSection() {
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
  
  const { control, register, watch, errors, fields, append, remove } = usePolaroidForm();
  const { ref: polaroidRef, exportImage, isExporting } = useExportPolaroid();
  const [isFlashing, setIsFlashing] = useState(false);

  const profiles = watch("profiles");

  const handleExport = async () => {
    setIsFlashing(true);
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    await exportImage();
    
    setTimeout(() => setIsFlashing(false), 300);
  };

  return (
    <section id="editor" className="py-8 lg:min-h-[700px] flex flex-col justify-center mb-16 relative overflow-hidden">
      
      {/* Elegant Section Header */}
      <div className="max-w-7xl mx-auto w-full mb-8 relative z-10">
        <h1 className="font-display text-4xl font-semibold text-fg tracking-tight">
          Create Your Polaroid
        </h1>
        <p className="text-fg-muted font-body text-base mt-2">
          Capture your developer identity in a beautiful, shareable format.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10 max-w-7xl mx-auto w-full">
        {/* Form Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <ProfileArrayFields
            control={control}
            register={register}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
          />
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:h-full relative">
          
          {/* Animated Light Rays Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none -z-10 opacity-60">
             <div className="w-full h-full ray-gradient rounded-full mix-blend-soft-light" />
          </div>
          
          {/* Central Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gold/5 blur-[100px] rounded-full pointer-events-none -z-10" />

          <div className="relative w-full max-w-[340px] mx-auto">
            <div className="relative perspective-1000 w-full">
             {/* Flash Overlay */}
             <div 
               className={`absolute inset-0 bg-cream z-50 pointer-events-none transition-opacity duration-300 ease-out rounded-sm ${isFlashing ? 'opacity-90' : 'opacity-0'}`}
             />

             {/* Visible preview (Interactive) */}
             <div className="w-full">
               <PolaroidPreview
                 image={image}
                 profiles={profiles}
                 variant="preview"
                 onDrop={onDrop}
                 onFileChange={onFileChange}
                 clearImage={clearImage}
                 error={imageError}
                 zoom={zoom}
                 position={position}
               />
             </div>

             {/* Hidden export target at true size */}
             <div className="fixed -left-[9999px] top-0">
               <PolaroidPreview
                 ref={polaroidRef}
                 image={image}
                 profiles={profiles}
                 variant="export"
                 zoom={zoom}
                 position={position}
               />
             </div>
          </div>
          </div>
            
            <div className="mt-8 w-full max-w-sm space-y-6">
               {/* Image Controls */}
               {image && (
                  <div className="p-5 warm-panel space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted">
                          <span className="flex items-center gap-1.5 font-body">
                            <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            Zoom
                          </span>
                          <span className="font-mono text-fg-subtle">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="0.1" 
                          value={zoom} 
                          onChange={(e) => setZoom(parseFloat(e.target.value))} 
                          className="w-full h-1.5 bg-parchment rounded-full appearance-none cursor-pointer accent-gold" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted">
                            <span className="flex items-center gap-1.5 font-body">
                              <Move className="w-3.5 h-3.5" strokeWidth={1.5} />
                              Pan X
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="-150" 
                            max="150" 
                            value={position.x} 
                            onChange={(e) => setPosition({...position, x: parseInt(e.target.value)})} 
                            className="w-full h-1.5 bg-parchment rounded-full appearance-none cursor-pointer accent-gold" 
                          />
                        </div>
                         <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted">
                            <span className="flex items-center gap-1.5 font-body">
                              <Move className="w-3.5 h-3.5 rotate-90" strokeWidth={1.5} />
                              Pan Y
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="-150" 
                            max="150" 
                            value={position.y} 
                            onChange={(e) => setPosition({...position, y: parseInt(e.target.value)})} 
                            className="w-full h-1.5 bg-parchment rounded-full appearance-none cursor-pointer accent-gold" 
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-center">
                        <button 
                          onClick={() => { setZoom(1); setPosition({x:0, y:0}); }}
                          className="text-xs font-medium text-fg-muted hover:text-gold transition-colors duration-150 underline underline-offset-2 decoration-1"
                        >
                          Reset Adjustments
                        </button>
                      </div>
                  </div>
               )}

               <button 
                 onClick={handleExport}
                 disabled={isExporting || !image}
                 className="w-full py-4 px-8 bg-gold text-white rounded-sm font-semibold tracking-wide shadow-md hover:bg-gold-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md font-body"
               >
                 <Download className="w-5 h-5" strokeWidth={1.5} />
                 {isExporting ? "Generating..." : "Export Polaroid"}
               </button>
            </div>
        </div>
      </div>
    </section>
  );
}
