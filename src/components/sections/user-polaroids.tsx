import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
import { useUserPolaroids, useDeletePolaroid } from "@/hooks/use-polaroids-query";
import type { PolaroidRecord } from "@/lib/polaroids";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface UserPolaroidsProps {
  onSelectPolaroid?: (polaroid: PolaroidRecord | null) => void;
  onAddNew?: () => void;
  activePolaroidId?: string | null;
}

function getUserDisplayInfo(polaroid: PolaroidRecord, userAvatarUrl?: string | null) {
  const firstHandle = polaroid.profile.handles[0];
  const handle = firstHandle ? `@${firstHandle.handle}` : "@user";
  const name = firstHandle?.handle || "You";
  
  const avatar = userAvatarUrl || (() => {
    const avatarSeed = firstHandle?.handle || polaroid.user_id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
  })();
  
  return { name, handle, avatar };
}

export function UserPolaroids({ onSelectPolaroid, onAddNew, activePolaroidId }: UserPolaroidsProps) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { data: polaroids = [], isLoading: loading, error } = useUserPolaroids();
  const deleteMutation = useDeletePolaroid();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const locale = lang === "es" ? es : enUS;
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const handleDeleteClick = (e: React.MouseEvent, polaroidId: string) => {
    e.stopPropagation();
    setConfirmDeleteId(polaroidId);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, polaroidId: string) => {
    e.stopPropagation();
    setDeletingId(polaroidId);
    setConfirmDeleteId(null);
    try {
      await deleteMutation.mutateAsync(polaroidId);
      if (activePolaroidId === polaroidId) {
        onSelectPolaroid?.(polaroids.find(p => p.id !== polaroidId) || null);
      }
    } catch (error) {
      console.error("Failed to delete polaroid:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  if (!user) {
    return null;
  }

  const errorMessage = error instanceof Error ? error.message : error ? "Failed to load polaroids" : null;

  return (
    <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg mb-2">
          {t.userPolaroids.title}
        </h2>
        <p className="text-fg-muted font-body text-sm md:text-base">
          {t.userPolaroids.subtitle}
        </p>
      </div>

      {user && onAddNew && (
        <div className="mb-6">
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-sm font-medium text-sm hover:bg-accent/90 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>{t.userPolaroids.newCard}</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-fg-muted font-body text-sm">Loading your cards...</p>
        </div>
      ) : errorMessage ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <p className="text-fg-muted font-body text-lg mb-2">Error loading cards</p>
          <p className="text-fg-muted font-body text-sm">{errorMessage}</p>
        </div>
      ) : polaroids.length === 0 ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <p className="text-fg-muted font-body text-lg mb-2">
            {t.userPolaroids.empty.title}
          </p>
          <p className="text-fg-muted font-body text-sm">
            {t.userPolaroids.empty.subtitle}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polaroids.map((polaroid) => {
            const { name, handle, avatar } = getUserDisplayInfo(polaroid, userAvatarUrl);
            const isActive = activePolaroidId === polaroid.id;
            return (
              <div
                key={polaroid.id}
                onClick={() => onSelectPolaroid?.(polaroid)}
                className={`card-panel p-4 rounded-sm shadow-sm transition-all duration-200 cursor-pointer relative ${
                  isActive 
                    ? "ring-2 ring-accent shadow-md" 
                    : "hover:shadow-md hover:ring-1 hover:ring-accent/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-10 h-10 rounded-full border-2 border-accent/20"
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
                    <button
                      onClick={(e) => handleDeleteClick(e, polaroid.id)}
                      disabled={deletingId === polaroid.id}
                      className="p-1.5 rounded-sm text-fg-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      aria-label={t.userPolaroids.delete}
                      title={t.userPolaroids.delete}
                    >
                      {deletingId === polaroid.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>
                {confirmDeleteId === polaroid.id && (
                  <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-sm flex items-center justify-center z-20 p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="card-panel p-4 rounded-sm max-w-xs w-full">
                      <p className="font-body text-fg mb-4 text-center">
                        {t.userPolaroids.deleteConfirm}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleConfirmDelete(e, polaroid.id)}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-sm font-medium text-sm hover:bg-red-600 transition-colors"
                        >
                          {t.userPolaroids.delete}
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="flex-1 px-4 py-2 bg-card-02 text-fg rounded-sm font-medium text-sm hover:bg-card-03 transition-colors"
                        >
                          {t.userPolaroids.cancel}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative pointer-events-none">
                  <PolaroidCard
                    image={polaroid.image_url || null}
                    profile={polaroid.profile}
                    variant="preview"
                    className="pointer-events-none"
                    zoom={1}
                    position={{ x: 0, y: 0 }}
                    source={polaroid.source}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

