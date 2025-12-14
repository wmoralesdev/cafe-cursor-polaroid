import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { NavDropdown } from "./nav-dropdown";

export function HeaderNavigation() {
  const { t } = useLanguage();
  const location = useLocation();

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












