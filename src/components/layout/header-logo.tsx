import { Link } from "react-router-dom";
import { CursorIcon } from "@/components/ui/cursor-icon";
import { useLanguage } from "@/hooks/use-language";

export function HeaderLogo() {
  const { t } = useLanguage();

  return (
    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div className="text-accent">
        <CursorIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold tracking-tight font-display text-fg">Cafe Cursor</span>
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-fg-muted">
          {t.shell.subtitle}
        </span>
      </div>
    </Link>
  );
}












