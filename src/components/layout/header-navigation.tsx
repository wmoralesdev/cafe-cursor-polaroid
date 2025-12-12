import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";

export function HeaderNavigation() {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Point to #editor when signed-in (editor exists), #join when signed-out (teaser exists)
  const devCardHref = user ? "#editor" : "#join";

  return (
    <nav className="hidden gap-8 sm:flex">
      <a 
        href={devCardHref} 
        className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
      >
        {t.shell.nav.devCard}
      </a>
      <a 
        href="#about" 
        className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
      >
        {t.shell.nav.about}
      </a>
      <Link 
        to="/tech" 
        className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
      >
        {t.shell.nav.tech}
      </Link>
    </nav>
  );
}












