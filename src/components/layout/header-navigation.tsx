import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { NavDropdown } from "./nav-dropdown";

export function HeaderNavigation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  // Point to /new#editor when signed-in (editor exists), /new#join when signed-out (teaser exists)
  const devCardHref = user ? "/new#editor" : "/new#join";

  return (
    <nav className="hidden gap-6 sm:flex items-center">
      {/* Browse Dropdown */}
      <NavDropdown
        label={t.shell.nav.browse || "Browse"}
        items={[
          {
            label: t.shell.nav.gallery,
            to: "/",
            isActive: location.pathname === "/",
          },
          {
            label: t.shell.nav.new,
            to: "/new",
            isActive: location.pathname === "/new",
          },
        ]}
      />

      {/* Create Link */}
      <a 
        href={devCardHref}
        className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
      >
        {t.shell.nav.devCard}
      </a>

      {/* More Dropdown */}
      <NavDropdown
        label={t.shell.nav.more || "More"}
        items={[
          {
            label: t.shell.nav.about,
            href: "/#about",
          },
          {
            label: t.shell.nav.tech,
            to: "/tech",
            isActive: location.pathname === "/tech",
          },
          {
            label: t.shell.nav.links,
            to: "/links",
            isActive: location.pathname === "/links",
          },
        ]}
      />
    </nav>
  );
}












