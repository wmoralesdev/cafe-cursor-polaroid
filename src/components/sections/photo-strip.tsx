import { clsx } from "clsx";
import { useLanguage } from "@/hooks/use-language";
import { SectionHeader } from "@/components/ui/section-header";

type CommunityPhoto = {
  src: string;
  alt: string;
  label?: string;
  colSpanClass: string;
  rowSpanClass?: string;
  tiltClass?: string;
  accent?: boolean;
};

const communityPhotos: CommunityPhoto[] = [
  {
    src: "/community/5.jpg",
    alt: "Cafe Cursor polaroid wall of setups",
    label: "San Salvador, El Salvador",
    colSpanClass: "md:col-span-5",
    rowSpanClass: "md:row-span-2",
    tiltClass: "md:-rotate-1",
    accent: true,
  },
  {
    src: "/community/2.jpg",
    alt: "Developers collaborating at a Cafe Cursor session",
    label: "Buenos Aires, Argentina",
    colSpanClass: "md:col-span-7",
    rowSpanClass: "md:row-span-2",
    tiltClass: "md:rotate-1",
    accent: true,
  },
  {
    src: "/community/1.jpg",
    alt: "Cafe Cursor meetup group photo",
    label: "Beijing, China",
    colSpanClass: "md:col-span-4",
  },
  {
    src: "/community/3.jpg",
    alt: "Cafe Cursor coworking moment",
    label: "Chiang Mai, Thailand",
    colSpanClass: "md:col-span-4",
  },
  {
    src: "/community/4.jpg",
    alt: "Cafe Cursor check-in desk",
    label: "Mexico City, Mexico",
    colSpanClass: "md:col-span-4",
  },
];

export function PhotoStrip() {
  const { t } = useLanguage();
  
  return (
    <section className="w-full py-12 overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4">
        <SectionHeader className="mb-8" title={t.showcase.title} subtitle={t.showcase.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[220px] md:auto-rows-[200px]">
          {communityPhotos.map((photo) => (
            <figure
              key={photo.src}
              className={clsx(
                "relative group overflow-hidden rounded-sm card-panel bg-card shadow-sm transform-gpu",
                photo.colSpanClass,
                photo.rowSpanClass,
                photo.tiltClass,
                photo.accent ? "shadow-md" : null
              )}
            >
            <div
              className={clsx(
                "absolute inset-0 mix-blend-multiply z-10 pointer-events-none",
                photo.accent ? "bg-accent/12" : "bg-card/10"
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-fg/30 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {photo.label ? (
              <figcaption className="absolute bottom-4 left-4 right-4 z-20">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-card/90 text-fg backdrop-blur-sm shadow-sm tracking-wide">
                  {photo.label}
                </span>
              </figcaption>
            ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

