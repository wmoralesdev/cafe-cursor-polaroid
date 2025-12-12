import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Trash2, Loader2, Heart } from "lucide-react";
import { clsx } from "clsx";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useTogglePolaroidLike } from "@/hooks/use-polaroids-query";
import type { PolaroidRecord } from "@/lib/polaroids";

interface PolaroidTileProps {
  polaroid: PolaroidRecord;
  variant?: "user" | "public";
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  userAvatarUrl?: string | null;
  className?: string;
  width?: number | string;
  children?: React.ReactNode;
}

export function PolaroidTile({
  polaroid,
  variant = "public",
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
  className,
  width,
  children,
}: PolaroidTileProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;
  const firstHandle = polaroid.profile.handles[0];
  const handle = firstHandle ? `@${firstHandle.handle}` : "@user";
  const { user } = useAuth();
  const toggleLike = useTogglePolaroidLike();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicking(false);
    if (user) {
      toggleLike.mutate(polaroid.id);
    }
  };

  return (
    <div
      className={clsx(
        "relative group rounded-sm transition-all duration-200",
        // Base styles for the tile container
        variant === "user" 
          ? "bg-transparent border-2 border-transparent hover:border-accent" 
          : "bg-transparent border-2 border-transparent hover:border-accent", // Public variant might be simpler or styled by parent
        isSelected && variant === "user" ? "ring-2 ring-accent shadow-md" : "",
        className
      )}
      style={width ? { width } : undefined}
      onClick={() => {
        onSelect?.();
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isClicking) {
          setIsHovered(false);
        }
      }}
    >

      {/* Public Variant Content Overlay (Bottom) */}
      {variant === "public" && (
        <div 
          className={clsx(
            "absolute bottom-0 left-0 right-0 z-20 p-3 bg-linear-to-t from-black/80 via-black/40 to-transparent pt-12 transition-opacity duration-200 flex items-end justify-between",
            (isHovered || isClicking) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={(e) => {
          // Prevent bubbling to container when clicking inside overlay
          if ((e.target as HTMLElement).tagName === 'BUTTON') {
            e.stopPropagation();
          }
          }}
        >
           <div className="text-white pointer-events-none">
             <p className="font-mono text-xs font-medium">@{polaroid.profile.handles[0]?.handle || "user"}</p>
             <p className="text-[10px] opacity-80">{formatDistanceToNow(new Date(polaroid.created_at), { addSuffix: true, locale })}</p>
           </div>
           {user && (
             <button
               type="button"
              onMouseDown={(e) => {
                 setIsClicking(true);
                handleLike(e);
               }}
               onMouseUp={() => {
                 // Don't clear isClicking here - let handleLike do it
               }}
               onMouseLeave={() => {
                 // Only clear if we're not in the middle of a click
                 if (!isClicking) {
                   setIsClicking(false);
                 }
               }}
               style={{ pointerEvents: 'auto', zIndex: 30 }}
               className={clsx(
                 "flex items-center gap-2 text-white transition-all px-3 py-2 rounded-full backdrop-blur-sm border",
                 polaroid.viewer_has_liked 
                   ? "bg-red-500/90 border-red-400/50 hover:bg-red-500 shadow-lg" 
                   : "bg-white/20 border-white/30 hover:bg-white/30 shadow-md"
               )}
               aria-label={polaroid.viewer_has_liked ? t.community.likes.likedBy : t.community.likes.like}
             >
               <Heart 
                 className={clsx(
                   "w-4 h-4 transition-all",
                   polaroid.viewer_has_liked ? "fill-white text-white" : "fill-white/80 text-white"
                 )} 
               />
               <span className="text-sm font-mono font-semibold">{polaroid.like_count || 0}</span>
             </button>
           )}
        </div>
      )}

      {/* User Variant Content Overlay (Bottom) */}
      {variant === "user" && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-linear-to-t from-black/80 via-black/40 to-transparent pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between">
           <div className="text-white pointer-events-none">
             <p className="text-[10px] opacity-80">{formatDistanceToNow(new Date(polaroid.created_at), { addSuffix: true, locale })}</p>
           </div>
           {onDelete && (
             <button
               type="button"
               onClick={handleDelete}
               disabled={isDeleting}
               className="flex items-center gap-2 text-white transition-all pointer-events-auto px-3 py-2 rounded-full bg-red-500/90 border border-red-400/50 hover:bg-red-500 shadow-lg backdrop-blur-sm disabled:opacity-50"
               aria-label={t.userPolaroids.delete}
               title={t.userPolaroids.delete}
             >
               {isDeleting ? (
                 <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
               ) : (
                 <Trash2 className="w-4 h-4" strokeWidth={1.5} />
               )}
             </button>
           )}
        </div>
      )}

      {/* Polaroid Preview */}
      <div className={clsx(
        "relative z-10 pointer-events-none transition-transform duration-300",
        variant === "public" || variant === "user" ? "group-hover:scale-[1.02]" : ""
      )}>
        {polaroid.image_url ? (
          <img
            src={polaroid.image_url}
            alt={`Polaroid by ${handle}`}
            className="w-full h-auto shadow-sm rounded-sm"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-card-01 rounded-sm flex items-center justify-center text-fg-muted">
            <span className="text-sm">No image</span>
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
}


