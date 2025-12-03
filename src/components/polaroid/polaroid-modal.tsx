import { useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { PolaroidPreview } from "./polaroid-card";
import { usePolaroid } from "@/hooks/use-polaroids-query";

interface PolaroidModalProps {
  polaroidId: string | null;
  onClose: () => void;
}

export function PolaroidModal({ polaroidId, onClose }: PolaroidModalProps) {
  const { data: polaroid, isLoading, error } = usePolaroid(polaroidId);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (polaroidId) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [polaroidId, onClose]);

  if (!polaroidId) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative bg-bg rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card hover:bg-card-02 text-fg-muted hover:text-fg transition-colors duration-150"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-accent" strokeWidth={1.5} />
              <p className="text-fg-muted font-body">Loading polaroid...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="w-8 h-8 text-accent" strokeWidth={1.5} />
              <p className="text-fg-muted font-body">Polaroid not found</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-accent text-white rounded-sm font-medium hover:bg-accent/90 transition-colors duration-150"
              >
                Close
              </button>
            </div>
          )}

          {polaroid && !isLoading && !error && (
            <div className="w-full flex flex-col items-center gap-6">
              <PolaroidPreview
                image={polaroid.image_url}
                profile={polaroid.profile}
                variant="preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

