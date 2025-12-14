import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface NavDropdownItem {
  label: string;
  href?: string;
  to?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  className?: string;
}

export function NavDropdown({ label, items, className }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150); // Small delay to allow moving to dropdown menu
  };

  const linkClassName = "block w-full text-left px-3 py-2 text-sm font-medium text-fg-muted hover:text-accent hover:bg-card-02 transition-colors font-body";

  return (
    <div
      className={clsx("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={clsx(
          "flex items-center gap-1 text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body",
          open && "text-accent"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={clsx("w-4 h-4 transition-transform duration-150", open && "rotate-180")} strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 z-50 min-w-[160px] bg-card border border-border rounded-sm shadow-lg overflow-hidden">
          <div className="p-1">
            {items.map((item) => {
              const isActive = item.isActive;
              const key = item.href || item.to || item.label;
              const content = (
                <span className={clsx(linkClassName, isActive && "text-accent bg-card-02")}>
                  {item.label}
                </span>
              );

              if (item.href) {
                return (
                  <a
                    key={key}
                    href={item.href}
                    onClick={() => {
                      item.onClick?.();
                    }}
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              if (item.to) {
                return (
                  <Link
                    key={key}
                    to={item.to}
                    onClick={() => {
                      item.onClick?.();
                    }}
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                  }}
                  className="block w-full"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
