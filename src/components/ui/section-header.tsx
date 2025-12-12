import type { ReactNode, ElementType } from "react";
import { clsx } from "clsx";

type SectionHeaderProps = {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  as?: ElementType;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeader({
  kicker,
  title,
  subtitle,
  as: TitleTag = "h2",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <div className={clsx("max-w-2xl", className)}>
      {kicker ? <div className="mb-2">{kicker}</div> : null}
      <TitleTag
        className={clsx(
          "font-display text-3xl md:text-4xl font-semibold text-fg tracking-tight leading-tight",
          titleClassName
        )}
      >
        {title}
      </TitleTag>
      {subtitle ? (
        <p className={clsx("text-fg-muted font-body text-lg mt-3 max-w-xl leading-relaxed", subtitleClassName)}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}


