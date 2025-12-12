import { Bell } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useLikeNotifications, useMarkNotificationsRead } from "@/hooks/use-like-notifications";
import { useUIStore } from "@/stores/ui-store";
import { NotificationItem } from "./notification-item";

interface NotificationsDropdownProps {
  userId: string | null;
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const { t } = useLanguage();
  const showNotifications = useUIStore((state) => state.showNotifications);
  const toggleNotifications = useUIStore((state) => state.toggleNotifications);
  const setShowNotifications = useUIStore((state) => state.setShowNotifications);
  
  const { data: notificationsData } = useLikeNotifications(!!userId);
  const markReadMutation = useMarkNotificationsRead();
  
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

  if (!userId) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleNotifications}
        className="relative flex items-center justify-center w-9 h-9 text-fg-muted hover:text-accent transition-colors rounded-sm hover:bg-card-02/50 border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-1"
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
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
            aria-label="Close notifications"
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
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

