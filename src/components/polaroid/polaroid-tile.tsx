import React from "react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Trash2, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
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

function getUserDisplayInfo(polaroid: PolaroidRecord, userAvatarUrl?: string | null) {
  const firstHandle = polaroid.profile.handles[0];
  const handle = firstHandle ? `@${firstHandle.handle}` : "@user";
  const name = firstHandle?.handle || "User";
  
  // Use provided avatar URL for user variant (current user), or deterministic avatar for public
  const avatar = userAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstHandle?.handle || polaroid.user_id)}`;
  
  return { name, handle, avatar };
}

export function PolaroidTile({
  polaroid,
  variant = "public",
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
  userAvatarUrl,
  className,
  width,
}: PolaroidTileProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;
  const { name, handle, avatar } = getUserDisplayInfo(polaroid, userAvatarUrl);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={clsx(
        "relative group rounded-sm transition-all duration-200",
        // Base styles for the tile container
        variant === "user" 
          ? "card-panel p-4 shadow-sm hover:shadow-md hover:ring-1 hover:ring-accent/30" 
          : "bg-transparent", // Public variant might be simpler or styled by parent
        isSelected && variant === "user" ? "ring-2 ring-accent shadow-md" : "",
        className
      )}
      style={width ? { width } : undefined}
    >
      {/* Click target for selection */}
      <button
        type="button"
        onClick={onSelect}
        className="absolute inset-0 z-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-1"
        aria-label={`View card by ${handle}`}
      />

      {/* Header Info */}
      <div className={clsx(
        "relative z-10 flex items-center gap-3 mb-3 pb-3",
        variant === "user" ? "border-b border-border/50" : "hidden" // Only show header in user variant for now, or customize for public
      )}>
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full border-2 border-accent/20 bg-card"
        />
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-fg text-sm truncate">
            {name}
          </p>
          <p className="font-mono text-xs text-fg-muted truncate">
            {handle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-muted font-body whitespace-nowrap">
            {formatDistanceToNow(new Date(polaroid.created_at), { addSuffix: true, locale })}
          </span>
          {variant === "user" && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-sm text-fg-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
      </div>

      {/* Public Variant Content Overlay (Bottom) */}
      {variant === "public" && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-linear-to-t from-black/80 via-black/40 to-transparent pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between pointer-events-none">
           <div className="text-white">
             <p className="font-mono text-xs font-medium">@{polaroid.profile.handles[0]?.handle || "user"}</p>
             <p className="text-[10px] opacity-80">{formatDistanceToNow(new Date(polaroid.created_at), { addSuffix: true, locale })}</p>
           </div>
           {/* Placeholder for likes if we had them passed in */}
           {/* <div className="flex items-center gap-1 text-white/90">
             <Heart className="w-3.5 h-3.5 fill-white/20" />
             <span className="text-xs font-mono">0</span>
           </div> */}
        </div>
      )}

      {/* Polaroid Preview */}
      <div className={clsx(
        "relative z-10 pointer-events-none transition-transform duration-300",
        variant === "public" ? "group-hover:scale-[1.02]" : ""
      )}>
        <PolaroidCard
          image={polaroid.source_image_url || polaroid.image_url || null}
          profile={polaroid.profile}
          variant="preview"
          className="pointer-events-none shadow-sm"
          zoom={1}
          position={{ x: 0, y: 0 }}
          source={polaroid.source}
        />
      </div>
      
      {children}
    </div>
  );
}
