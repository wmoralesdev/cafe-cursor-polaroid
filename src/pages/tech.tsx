import { Link } from "react-router-dom";
import { ArrowLeft, Database, Server, Palette, Camera, Share2, Printer, Zap, Globe, Code2, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { CursorIcon } from "@/components/ui/cursor-icon";

// Stack badges with their colors
const techStack = [
  { name: "React 19", color: "#61DAFB", icon: "⚛️" },
  { name: "TypeScript", color: "#3178C6", icon: "📘" },
  { name: "Tailwind CSS 4", color: "#06B6D4", icon: "🎨" },
  { name: "Supabase", color: "#3ECF8E", icon: "⚡" },
  { name: "Vite", color: "#646CFF", icon: "⚡" },
  { name: "React Query", color: "#FF4154", icon: "🔄" },
];

const features = [
  {
    icon: Camera,
    title: "Image Capture",
    description: "Drop or upload your photo, adjust zoom and pan for the perfect crop within the polaroid frame.",
  },
  {
    icon: Palette,
    title: "Theme System",
    description: "5 unique polaroid themes (Classic, Vintage, Noir, Neon, Minimal) with themed stamps and tape strips.",
  },
  {
    icon: Database,
    title: "Real-time Sync",
    description: "Auto-save to Supabase with optimistic updates. Your cards sync across devices instantly.",
  },
  {
    icon: Printer,
    title: "Print-Ready Export",
    description: "White background preserved for physical printing. Export at high resolution for perfect prints.",
  },
  {
    icon: Share2,
    title: "Social Sharing",
    description: "Share your card on X or copy a direct link. Each card gets a unique shareable URL.",
  },
  {
    icon: Globe,
    title: "i18n Ready",
    description: "Full English and Spanish support with easy extensibility for more languages.",
  },
];

function ArchitectureDiagram() {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Connection lines - SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Animated flowing lines */}
        <path
          d="M 200 80 Q 400 80 400 160"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="animate-[dash_2s_linear_infinite]"
        />
        <path
          d="M 600 80 Q 400 80 400 160"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="animate-[dash_2s_linear_infinite_reverse]"
        />
        <path
          d="M 400 220 L 400 280"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="animate-[dash_2s_linear_infinite]"
        />
      </svg>

      <div className="relative z-10 grid grid-cols-3 gap-6">
        {/* Top row - Client */}
        <div className="col-span-3 flex justify-center gap-8">
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Code2 className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">React App</div>
            <div className="text-xs text-fg-muted">TypeScript + Vite</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Palette className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">Tailwind 4</div>
            <div className="text-xs text-fg-muted">CSS Variables</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Layers className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">React Query</div>
            <div className="text-xs text-fg-muted">Server State</div>
          </div>
        </div>

        {/* Middle - Edge Functions */}
        <div className="col-span-3 flex justify-center my-8">
          <div className="card-panel p-6 text-center border-accent/30 border-2 min-w-[200px]">
            <Server className="w-10 h-10 mx-auto mb-3 text-accent" strokeWidth={1.5} />
            <div className="text-base font-semibold text-fg">Edge Functions</div>
            <div className="text-xs text-fg-muted mt-1">Deno Runtime · Global Edge</div>
            <div className="flex gap-2 justify-center mt-3 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">create-polaroid</span>
              <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">get-polaroids</span>
              <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">update-polaroid</span>
            </div>
          </div>
        </div>

        {/* Bottom row - Database & Storage */}
        <div className="col-span-3 flex justify-center gap-8">
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Database className="w-8 h-8 mx-auto mb-2 text-[#3ECF8E]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">PostgreSQL</div>
            <div className="text-xs text-fg-muted">Row Level Security</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Zap className="w-8 h-8 mx-auto mb-2 text-[#3ECF8E]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">Realtime</div>
            <div className="text-xs text-fg-muted">Live Updates</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Camera className="w-8 h-8 mx-auto mb-2 text-[#3ECF8E]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">Storage</div>
            <div className="text-xs text-fg-muted">CDN-backed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { num: 1, title: "Create", desc: "Fill your profile, pick a theme, upload a photo" },
    { num: 2, title: "Preview", desc: "See live preview with 3D tilt effect" },
    { num: 3, title: "Export", desc: "Download high-res PNG for printing" },
    { num: 4, title: "Share", desc: "Post to X or share via unique link" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 py-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-2">
              {step.num}
            </div>
            <div className="text-sm font-semibold text-fg">{step.title}</div>
            <div className="text-xs text-fg-muted max-w-[120px]">{step.desc}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-accent/60 to-accent/20 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

export function TechPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-medium">{lang === "es" ? "Volver" : "Back"}</span>
          </Link>
          <div className="flex items-center gap-2">
            <CursorIcon className="w-5 h-5" />
            <span className="font-display font-semibold text-fg">Cafe Cursor</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-fg mb-4 tracking-tight">
            {lang === "es" ? "Bajo el capó" : "Under the Hood"}
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto font-body">
            {lang === "es" 
              ? "Una mirada técnica a cómo construimos la experiencia de tarjetas de Cafe Cursor."
              : "A technical look at how we built the Cafe Cursor card experience."
            }
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {lang === "es" ? "Stack Tecnológico" : "Tech Stack"}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="card-panel px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform"
                style={{ borderColor: `${tech.color}30` }}
              >
                <span className="text-lg">{tech.icon}</span>
                <span className="font-medium text-fg text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* User Flow */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {lang === "es" ? "Flujo del Usuario" : "User Flow"}
          </h2>
          <div className="card-panel p-6">
            <FlowDiagram />
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {lang === "es" ? "Arquitectura" : "Architecture"}
          </h2>
          <div className="card-panel p-6 overflow-x-auto">
            <ArchitectureDiagram />
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-8 text-center">
            {lang === "es" ? "Características Técnicas" : "Technical Features"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-panel p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-fg mb-2">{feature.title}</h3>
                <p className="text-sm text-fg-muted font-body leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Print Pipeline */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {lang === "es" ? "Pipeline de Impresión" : "Print Pipeline"}
          </h2>
          <div className="card-panel p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-card-02 flex items-center justify-center">
                  <Code2 className="w-7 h-7 text-fg-muted" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">DOM Render</div>
                <div className="text-xs text-fg-muted mt-1">React component with white bg</div>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-card-02 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-fg-muted" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">Screenshot</div>
                <div className="text-xs text-fg-muted mt-1">html-to-image capture</div>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-card-02 flex items-center justify-center">
                  <Database className="w-7 h-7 text-fg-muted" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">Storage</div>
                <div className="text-xs text-fg-muted mt-1">Supabase CDN upload</div>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                  <Printer className="w-7 h-7 text-accent" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">Print Ready</div>
                <div className="text-xs text-fg-muted mt-1">340×510px @ 2x DPI</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-panel p-8 max-w-lg mx-auto">
            <CursorIcon className="w-10 h-10 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-fg mb-3">
              {lang === "es" ? "¿Listo para crear tu tarjeta?" : "Ready to create your card?"}
            </h2>
            <p className="text-sm text-fg-muted mb-6 font-body">
              {lang === "es" 
                ? "Únete a la comunidad de Cafe Cursor y comparte tu setup."
                : "Join the Cafe Cursor community and share your setup."
              }
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-sm font-medium hover:bg-accent/90 transition-colors"
            >
              {lang === "es" ? "Crear mi tarjeta" : "Create my card"}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 text-center text-sm text-fg-muted">
        <p>Made with love by Walter — Cursor Ambassador for El Salvador</p>
      </footer>
    </div>
  );
}


