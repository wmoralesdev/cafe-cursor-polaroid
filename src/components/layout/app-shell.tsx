import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { HeaderLogo } from "./header-logo";
import { HeaderNavigation } from "./header-navigation";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserMenu } from "./user-menu";
import { AppFooter } from "./app-footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-accent selection:text-white bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <HeaderLogo />
          <div className="flex items-center gap-3 sm:gap-4">
            <HeaderNavigation />
            <NotificationsDropdown userId={user?.id || null} />
            <UserMenu />
            <ThemeToggle />
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
