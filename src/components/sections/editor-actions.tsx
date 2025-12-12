import { Download, Maximize2, Move, Github, Plus, Share2 } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { useLanguage } from "@/contexts/language-context";
import { useEditorUIStore } from "@/stores/editor-ui-store";
import { useUIStore } from "@/stores/ui-store";

interface EditorActionsProps {
  image: string | null;
  zoom: number;
  position: { x: number; y: number };
  setZoom: (zoom: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  isExporting: boolean;
  user: boolean;
  isEditingExisting: boolean;
  currentPolaroidId: string | null;
  provider?: string | null;
  onExport: () => void;
  onCopyShareLink: () => void;
  onShare: (provider: "twitter" | "github") => void;
  onNewCardOverwrite: () => void;
  onNewCardCreate: () => void;
}

export function EditorActions({
  image,
  zoom,
  position,
  setZoom,
  setPosition,
  isExporting,
  user,
  isEditingExisting,
  currentPolaroidId,
  provider,
  onExport,
  onCopyShareLink,
  onShare,
  onNewCardOverwrite,
  onNewCardCreate,
}: EditorActionsProps) {
  const { t } = useLanguage();
  const shareCopied = useEditorUIStore((state) => state.shareCopied);
  const isSharing = useEditorUIStore((state) => state.isSharing);
  const showNewCardChoice = useUIStore((state) => state.showNewCardChoice);
  const setShowNewCardChoice = useUIStore((state) => state.setShowNewCardChoice);

  return (
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
              <span>{t.editor.cardStatus.editing}</span>
            ) : (
              <span>{t.editor.cardStatus.creating}</span>
            )}
          </div>
        )}

        {showNewCardChoice && (
          <div className="p-4 card-panel border border-border rounded-sm space-y-3 animate-[fadeIn_0.2s_ease-out]">
            <p className="text-sm text-fg font-body text-center">
              {t.editor.exportChoice.title}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onNewCardOverwrite}
                className="flex-1 py-2 px-3 bg-accent text-white rounded-sm font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                {t.editor.exportChoice.overwrite}
              </button>
              <button
                type="button"
                onClick={onNewCardCreate}
                className="flex-1 py-2 px-3 bg-card border border-border text-fg rounded-sm font-medium text-sm hover:bg-card-02 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" />
                {t.editor.exportChoice.newCard}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowNewCardChoice(false)}
              className="w-full text-xs text-fg-muted hover:text-fg transition-colors"
            >
              {t.editor.exportChoice.cancel}
            </button>
          </div>
        )}

        {!showNewCardChoice && (
          <>
            <button 
              type="button"
              onClick={onExport}
              disabled={isExporting || !image || !user}
              className="w-full py-4 px-8 bg-accent text-white rounded-sm font-semibold tracking-wide shadow-md hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md disabled:hover:scale-100 font-body"
            >
              <Download className={`w-5 h-5 ${isExporting ? "animate-bounce" : ""}`} strokeWidth={1.5} />
              {isExporting ? t.editor.exportButton.exporting : t.editor.exportButton.default}
            </button>
            {user && currentPolaroidId && (
              <button
                type="button"
                onClick={onCopyShareLink}
                className="w-full py-3 px-6 bg-card border border-border text-fg rounded-sm font-medium tracking-wide shadow-sm hover:bg-card-02 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:scale-100 font-body"
              >
                <Share2 className="w-4 h-4" strokeWidth={1.5} />
                <span>{shareCopied ? t.editor.share.copied : t.editor.share.link}</span>
              </button>
            )}
          </>
        )}

        {provider && currentPolaroidId && (
          <>
            {provider === "twitter" && (
              <button
                type="button"
                onClick={() => onShare("twitter")}
                disabled={isSharing || isExporting || !image || !user || !currentPolaroidId}
                className="w-full py-3 px-6 bg-card border border-border text-fg rounded-sm font-medium tracking-wide shadow-sm hover:bg-card-02 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:scale-100 font-body"
              >
                <XIcon className="w-4 h-4" />
                <span>{isSharing ? t.editor.share.openingX : t.editor.share.onX}</span>
              </button>
            )}
            {provider === "github" && (
              <button
                type="button"
                onClick={() => onShare("github")}
                disabled={isSharing || isExporting || !image || !user || !currentPolaroidId}
                className="w-full py-3 px-6 bg-card border border-border text-fg rounded-sm font-medium tracking-wide shadow-sm hover:bg-card-02 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:scale-100 font-body"
              >
                <Github className="w-4 h-4" strokeWidth={1.5} />
                <span>{isSharing ? t.editor.share.openingGitHub : t.editor.share.onGitHub}</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}











