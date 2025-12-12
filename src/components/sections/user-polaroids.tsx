import { useAuth } from "@/hooks/use-auth";
import { PolaroidTile } from "@/components/polaroid/polaroid-tile";
import { useLanguage } from "@/contexts/language-context";
import { useUserPolaroids, useDeletePolaroid } from "@/hooks/use-polaroids-query";
import { useUIStore } from "@/stores/ui-store";
import { usePolaroidStore } from "@/stores/polaroid-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Loader2 } from "lucide-react";

export function UserPolaroids() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: polaroids = [], isLoading: loading, error } = useUserPolaroids(!!user);
  const deleteMutation = useDeletePolaroid();
  const deletingId = useUIStore((state) => state.deletingId);
  const setDeletingId = useUIStore((state) => state.setDeletingId);
  const confirmDeleteId = useUIStore((state) => state.confirmDeleteId);
  const setConfirmDeleteId = useUIStore((state) => state.setConfirmDeleteId);
  const activePolaroidId = usePolaroidStore((state) => state.activePolaroid?.id || null);
  const handleSelectPolaroid = usePolaroidStore((state) => state.handleSelectPolaroid);
  
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const handleDeleteClick = (polaroidId: string) => {
    setConfirmDeleteId(polaroidId);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, polaroidId: string) => {
    e.stopPropagation();
    setDeletingId(polaroidId);
    setConfirmDeleteId(null);
    try {
      await deleteMutation.mutateAsync(polaroidId);
      if (activePolaroidId === polaroidId) {
        handleSelectPolaroid(polaroids.find(p => p.id !== polaroidId) || null);
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
    <section className="w-full py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <SectionHeader className="mb-8" title={t.userPolaroids.title} subtitle={t.userPolaroids.subtitle} />

        {loading ? (
          <div className="glass-panel-inner p-12 rounded-sm text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-fg-muted font-body text-sm">Loading your cards...</p>
          </div>
        ) : errorMessage ? (
          <div className="glass-panel-inner p-12 rounded-sm text-center">
            <p className="text-fg-muted font-body text-lg mb-2">Error loading cards</p>
            <p className="text-fg-muted font-body text-sm">{errorMessage}</p>
          </div>
        ) : polaroids.length === 0 ? (
          <div className="glass-panel-inner p-12 rounded-sm text-center">
            <p className="text-fg-muted font-body text-lg mb-2">
              {t.userPolaroids.empty.title}
            </p>
            <p className="text-fg-muted font-body text-sm">{t.userPolaroids.empty.subtitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polaroids.map((polaroid) => {
              return (
                <PolaroidTile
                  key={polaroid.id}
                  polaroid={polaroid}
                  variant="user"
                  userAvatarUrl={userAvatarUrl}
                  isSelected={activePolaroidId === polaroid.id}
                  onSelect={() => handleSelectPolaroid(polaroid)}
                  onDelete={() => handleDeleteClick(polaroid.id)}
                  isDeleting={deletingId === polaroid.id}
                >
                  {confirmDeleteId === polaroid.id && (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: Stop propagation for overlay
                    <div
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-sm flex items-center justify-center z-20 p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="card-panel p-4 rounded-sm max-w-xs w-full bg-card shadow-lg border border-border">
                        <p className="font-body text-fg mb-4 text-center text-sm">
                          {t.userPolaroids.deleteConfirm}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleConfirmDelete(e, polaroid.id)}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-sm font-medium text-sm hover:bg-red-600 transition-colors"
                          >
                            {t.userPolaroids.delete}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            className="flex-1 px-4 py-2 bg-card-02 text-fg rounded-sm font-medium text-sm hover:bg-card-03 transition-colors"
                          >
                            {t.userPolaroids.cancel}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </PolaroidTile>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

