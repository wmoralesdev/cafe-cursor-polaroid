import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { LikeNotification } from "@/hooks/use-like-notifications";
import { clsx } from "clsx";

interface NotificationItemProps {
  notification: LikeNotification;
  onClick: (polaroidId: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;

  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(notification.polaroid_id)}
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
  );
}




