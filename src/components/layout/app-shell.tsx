import { LanguageToggle } from "@/components/ui/language-toggle";
import { useAuth } from "@/hooks/use-auth";
import { HeaderLogo } from "./header-logo";
import { HeaderNavigation } from "./header-navigation";
import { NotificationsDropdown } from "./notifications-dropdown";
import { AppFooter } from "./app-footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-accent selection:text-white bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <HeaderLogo />
          <div className="flex items-center gap-4 sm:gap-6">
            <HeaderNavigation />
            <NotificationsDropdown userId={user?.id || null} />
            {user && (
              <button
                type="button"
                onClick={signOut}
                className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body"
              >
                Logout
              </button>
            )}
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 mx-auto w-full max-w-7xl">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
