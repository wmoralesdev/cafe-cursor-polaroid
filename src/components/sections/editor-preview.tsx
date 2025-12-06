import { useRef } from "react";
import { PolaroidPreview } from "@/components/polaroid/polaroid-card";
import { useEditorUIStore } from "@/stores/editor-ui-store";
import type { CursorProfile } from "@/types/form";

interface EditorPreviewProps {
  image: string | null;
  profile: CursorProfile;
  zoom: number;
  position: { x: number; y: number };
  imageError: string | null;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  source?: string;
  polaroidRef?: React.RefObject<HTMLDivElement | null>;
  user?: boolean;
}

export function EditorPreview({
  image,
  profile,
  zoom,
  position,
  imageError,
  onDrop,
  onFileChange,
  clearImage,
  source,
  polaroidRef,
  user = true,
}: EditorPreviewProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const tilt = useEditorUIStore((state) => state.tilt);
  const isHovering = useEditorUIStore((state) => state.isHovering);
  const setTilt = useEditorUIStore((state) => state.setTilt);
  const setIsHovering = useEditorUIStore((state) => state.setIsHovering);
  const resetTilt = useEditorUIStore((state) => state.resetTilt);

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
    resetTilt();
  };

  return (
    <div className={`relative w-full max-w-[340px] mx-auto ${!user ? "opacity-40" : ""}`}>
      <div 
        ref={tiltRef}
        className="relative w-full cursor-default"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onKeyDown={() => {}}
        role="img"
        aria-label="Polaroid card preview with 3D tilt effect"
        tabIndex={-1}
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
            onDrop={onDrop}
            onFileChange={onFileChange}
            clearImage={clearImage}
            error={imageError}
            zoom={zoom}
            position={position}
            source={source}
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
  );
}

