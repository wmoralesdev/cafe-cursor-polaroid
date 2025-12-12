import { useEffect, useMemo, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const meta = useMemo(() => (user?.user_metadata ?? {}) as Record<string, unknown>, [user?.user_metadata]);
  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    (typeof meta.avatarUrl === "string" && meta.avatarUrl) ||
    null;

  const displayName = useMemo(() => {
    const maybe =
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      (typeof meta.user_name === "string" && meta.user_name) ||
      (typeof meta.preferred_username === "string" && meta.preferred_username) ||
      user?.email ||
      "User";
    return maybe;
  }, [meta, user?.email]);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-sm text-fg-muted hover:text-accent hover:bg-card-02/50 transition-all duration-150 border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-1"
        aria-label="Account menu"
        title="Account"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
        ) : initials ? (
          <span className="w-6 h-6 rounded-full bg-card-02 text-fg text-xs font-mono font-semibold flex items-center justify-center">
            {initials}
          </span>
        ) : (
          <User className="w-4 h-4" strokeWidth={1.5} />
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Close account menu"
          />
          <div className="absolute right-0 mt-2 z-50 w-56 bg-card border border-border rounded-sm shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-fg font-body truncate">{displayName}</p>
              {user.email ? <p className="text-xs text-fg-muted font-mono truncate">{user.email}</p> : null}
            </div>
            <div className="p-2">
              <button
                type="button"
                onClick={signOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-fg hover:bg-card-02 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



