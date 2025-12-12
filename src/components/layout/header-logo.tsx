import { CursorIcon } from "@/components/ui/cursor-icon";
import { useLanguage } from "@/contexts/language-context";

export function HeaderLogo() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <div className="text-accent">
        <CursorIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold tracking-tight font-display text-fg">Cafe Cursor</span>
        <span className="text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-fg-muted">
          {t.shell.subtitle}
        </span>
      </div>
    </div>
  );
}











