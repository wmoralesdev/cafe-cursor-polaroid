import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { CursorIcon } from "@/components/ui/cursor-icon";
import { useAuth } from "@/hooks/use-auth";
import { useLikeNotifications, useMarkNotificationsRead } from "@/hooks/use-like-notifications";
import { Bell, Heart, Github, Linkedin } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { clsx } from "clsx";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: notificationsData } = useLikeNotifications(!!user);
  const markReadMutation = useMarkNotificationsRead();
  
  const locale = lang === "es" ? es : enUS;
  const notifications = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  const handleNotificationClick = (polaroidId: string) => {
    // Navigate to the polaroid using the existing modal system
    const url = new URL(window.location.href);
    url.searchParams.set("p", polaroidId);
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
    setShowNotifications(false);
  };

  const handleMarkAllRead = () => {
    markReadMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-accent selection:text-white bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="text-accent">
               <CursorIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight font-display text-fg">Cafe Cursor</span>
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-fg-muted">{t.shell.subtitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden gap-8 sm:flex">
              <a 
                href="#editor" 
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

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-fg-muted hover:text-fg transition-colors rounded-sm hover:bg-card-02"
                  aria-label={t.notifications.title}
                >
                  <Bell className="w-5 h-5" strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)} 
                    />
                    <div className="absolute right-0 mt-2 z-50 w-80 bg-card border border-border rounded-sm shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <h3 className="font-display font-semibold text-fg text-sm">
                          {t.notifications.title}
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            disabled={markReadMutation.isPending}
                            className="text-xs text-accent hover:underline font-body"
                          >
                            {t.notifications.markAllRead}
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <p className="text-fg-muted font-body text-sm">
                              {t.notifications.empty}
                            </p>
                          </div>
                        ) : (
                          <ul className="divide-y divide-border/50">
                            {notifications.map((notification) => (
                              <li key={notification.id}>
                                <button
                                  type="button"
                                  onClick={() => handleNotificationClick(notification.polaroid_id)}
                                  className={clsx(
                                    "w-full px-4 py-3 flex items-start gap-3 hover:bg-card-02 transition-colors text-left",
                                    !notification.read_at && "bg-accent/5"
                                  )}
                                >
                                  {notification.actor_avatar_url ? (
                                    <img
                                      src={notification.actor_avatar_url}
                                      alt={notification.actor_name || "User"}
                                      className="w-8 h-8 rounded-full flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                      <Heart className="w-4 h-4 text-accent" strokeWidth={1.5} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-body text-fg">
                                      <span className="font-semibold">{notification.actor_name || "Someone"}</span>
                                      {" "}
                                      <span className="text-fg-muted">{t.notifications.likedYourCard}</span>
                                    </p>
                                    <p className="text-xs text-fg-muted font-body mt-0.5">
                                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale })}
                                    </p>
                                  </div>
                                  {!notification.read_at && (
                                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <LanguageToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 mx-auto w-full max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-border py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono font-medium text-fg-muted tracking-wide">
            {t.shell.footer}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/wmoralesdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/wmoralesdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com/in/wmoralesdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
            <span className="text-border">·</span>
            <Link 
              to="/tech" 
              className="text-[11px] font-mono font-medium text-fg-muted hover:text-accent transition-colors tracking-wide"
            >
              {t.shell.nav.tech}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
