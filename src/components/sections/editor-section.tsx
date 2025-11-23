import React, { useState } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";
import { usePolaroidForm } from "@/hooks/use-polaroid-form";
import { useExportPolaroid } from "@/hooks/use-export-polaroid";
import { ProfileArrayFields } from "@/components/form/profile-array-fields";
import { PolaroidPreview } from "@/components/polaroid/polaroid-card";
import { Download, AlertTriangle, Maximize2, Move } from "lucide-react";

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
    // Short delay to let the flash start before heavy export task (if synchronous)
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    await exportImage();
    
    setTimeout(() => setIsFlashing(false), 300);
  };

  return (
    <section id="editor" className="py-4 lg:min-h-[700px] flex flex-col justify-center mb-24">
      
      {/* Brutalist Header */}
      <div className="max-w-7xl mx-auto w-full mb-6 border-b-4 border-black pb-4 flex items-center justify-between bg-accent/5 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         <div className="flex items-center gap-3">
             <div className="bg-black text-accent p-1">
                 <AlertTriangle className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black tracking-tighter uppercase text-fg">
               Polaroid Generator <span className="bg-black text-white px-2 py-0.5 text-sm ml-2">V2.0</span>
             </h1>
         </div>
         <div className="hidden sm:block font-mono text-xs font-bold uppercase tracking-widest opacity-60">
            System Status: Online
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-8">
        {/* Form Column - Compact Layout */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Form Fields */}
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
        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:h-full">
          <div className="relative w-full max-w-[420px] mx-auto">
            {/* Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 blur-[60px] rounded-full pointer-events-none -z-10" />

            <div className="relative perspective-1000 w-full">
             {/* Flash Overlay */}
             <div 
               className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300 ease-out rounded-sm ${isFlashing ? 'opacity-80' : 'opacity-0'}`}
             />

             {/* Visible preview (Interactive) */}
             <div className="w-full">
               <PolaroidPreview
                 image={image}
                 profiles={profiles}
                 variant="preview"
                 className="shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)]"
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
                  <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3"/> Zoom</span>
                          <span className="font-mono opacity-60">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="0.1" 
                          value={zoom} 
                          onChange={(e) => setZoom(parseFloat(e.target.value))} 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black border border-black" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Move className="w-3 h-3"/> Pan X</span>
                          </div>
                          <input 
                            type="range" 
                            min="-150" 
                            max="150" 
                            value={position.x} 
                            onChange={(e) => setPosition({...position, x: parseInt(e.target.value)})} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black border border-black" 
                          />
                        </div>
                         <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Move className="w-3 h-3 rotate-90"/> Pan Y</span>
                          </div>
                          <input 
                            type="range" 
                            min="-150" 
                            max="150" 
                            value={position.y} 
                            onChange={(e) => setPosition({...position, y: parseInt(e.target.value)})} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black border border-black" 
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-center">
                        <button 
                          onClick={() => { setZoom(1); setPosition({x:0, y:0}); }}
                          className="text-[10px] font-bold uppercase tracking-widest underline hover:text-accent"
                        >
                          Reset Adjustments
                        </button>
                      </div>
                  </div>
               )}

               <button 
                 onClick={handleExport}
                 disabled={isExporting || !image}
                 className="w-full py-4 bg-accent text-white rounded-none font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 active:shadow-none active:translate-y-[8px] active:translate-x-[8px]"
               >
                 <Download className="w-6 h-6" />
                 {isExporting ? "GENERATING..." : "EXPORT ARTIFACT"}
               </button>
            </div>
        </div>
      </div>
    </section>
  );
}
