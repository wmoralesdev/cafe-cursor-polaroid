import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, Server, Palette, Camera, Share2, Printer, Zap, Globe, Code2, Layers, Heart, KeyRound, Save, Terminal, Copy, Check, FileCode, Sparkles, RefreshCw, FileText, Route, Calendar, BarChart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/hooks/use-theme";
import { CursorIcon } from "@/components/ui/cursor-icon";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { AppFooter } from "@/components/layout/app-footer";
import { CURSOR_PROMPT } from "@/constants/cursor-prompt";
import { clsx } from "clsx";

// Stack badges with their colors and icons
const techStack = [
  { name: "React 19", color: "#61DAFB", icon: Code2 },
  { name: "TypeScript", color: "#3178C6", icon: FileCode },
  { name: "Tailwind CSS 4", color: "#06B6D4", icon: Sparkles },
  { name: "Supabase", color: "#3ECF8E", icon: Database },
  { name: "Vite 7", color: "#646CFF", icon: Zap },
  { name: "React Query", color: "#FF4154", icon: RefreshCw },
  { name: "React Hook Form", color: "#EC5990", icon: FileText },
  { name: "React Router", color: "#CA4245", icon: Route },
  { name: "Lucide Icons", color: "#F56565", icon: Layers },
  { name: "date-fns", color: "#770C56", icon: Calendar },
  { name: "Vercel Analytics", color: "#000000", icon: BarChart },
];

// All 9 edge functions
const edgeFunctions = [
  { name: "create-polaroid", key: "createPolaroid" as const },
  { name: "get-polaroids", key: "getPolaroids" as const },
  { name: "get-polaroid-by-slug", key: "getPolaroidBySlug" as const },
  { name: "update-polaroid", key: "updatePolaroid" as const },
  { name: "delete-polaroid", key: "deletePolaroid" as const },
  { name: "post-polaroid", key: "postPolaroid" as const },
  { name: "toggle-polaroid-like", key: "toggleLike" as const },
  { name: "get-like-notifications", key: "getNotifications" as const },
  { name: "get-admin-polaroids", key: "getAdminPolaroids" as const },
];

// Code snippets for each edge function
const codeSnippets: Record<string, { lines: Array<{ text: string; color: string }> }> = {
  "create-polaroid": {
    lines: [
      { text: 'const { profile, imageDataUrl } = await req.json();', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: '// Upload source image to storage', color: "#6a9955" },
      { text: 'const blob = await fetch(imageDataUrl).then(r => r.blob());', color: "#d4d4d4" },
      { text: 'await supabase.storage.from("polaroids")', color: "#d4d4d4" },
      { text: '  .upload(sourceFilename, blob);', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: 'const { data } = await supabase', color: "#d4d4d4" },
      { text: '  .from("polaroids")', color: "#d4d4d4" },
      { text: '  .insert({ user_id, profile, source_image_url, image_url })', color: "#d4d4d4" },
      { text: '  .select().single();', color: "#d4d4d4" },
    ],
  },
  "get-polaroids": {
    lines: [
      { text: 'const { sort, maxOnly, limit } = params;', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: 'let query = supabase.from("polaroids")', color: "#d4d4d4" },
      { text: '  .select("*, likes:polaroid_likes(count)")', color: "#d4d4d4" },
      { text: '  .order(sort === "likes" ? "like_count" : "created_at")', color: "#d4d4d4" },
      { text: '  .limit(limit);', color: "#d4d4d4" },
    ],
  },
  "get-polaroid-by-slug": {
    lines: [
      { text: 'const { slug } = await req.json();', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: 'const { data } = await supabase', color: "#d4d4d4" },
      { text: '  .from("polaroids")', color: "#d4d4d4" },
      { text: '  .select("*, likes:polaroid_likes(count)")', color: "#d4d4d4" },
      { text: '  .eq("slug", slug).single();', color: "#d4d4d4" },
    ],
  },
  "update-polaroid": {
    lines: [
      { text: 'const { id, profile, imageDataUrl } = await req.json();', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: '// Delete old portrait if exists', color: "#6a9955" },
      { text: 'if (oldImageUrl !== sourceImageUrl) {', color: "#d4d4d4" },
      { text: '  await supabase.storage.from("polaroids").remove([oldPath]);', color: "#d4d4d4" },
      { text: '}', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: '// Upload new portrait image', color: "#6a9955" },
      { text: 'await supabase.storage.from("polaroids")', color: "#d4d4d4" },
      { text: '  .upload(filename, blob, { upsert: true });', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: 'const { data } = await supabase', color: "#d4d4d4" },
      { text: '  .from("polaroids")', color: "#d4d4d4" },
      { text: '  .update({ profile, image_url }).eq("id", id);', color: "#d4d4d4" },
    ],
  },
  "delete-polaroid": {
    lines: [
      { text: 'const { id } = await req.json();', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: '// Delete image from storage first', color: "#6a9955" },
      { text: 'await supabase.storage.from("polaroids").remove([path]);', color: "#d4d4d4" },
      { text: '// Then delete the record', color: "#6a9955" },
      { text: 'await supabase.from("polaroids").delete().eq("id", id);', color: "#d4d4d4" },
    ],
  },
  "post-polaroid": {
    lines: [
      { text: 'const formData = await req.formData();', color: "#d4d4d4" },
      { text: 'const file = formData.get("image") as File;', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: 'const { data } = await supabase.storage', color: "#d4d4d4" },
      { text: '  .from("polaroids")', color: "#d4d4d4" },
      { text: '  .upload(`${user.id}/${filename}`, file);', color: "#d4d4d4" },
    ],
  },
  "toggle-polaroid-like": {
    lines: [
      { text: 'const { polaroid_id } = await req.json();', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: '// Check if already liked', color: "#6a9955" },
      { text: 'const { data: existing } = await supabase', color: "#d4d4d4" },
      { text: '  .from("polaroid_likes")', color: "#d4d4d4" },
      { text: '  .select().match({ polaroid_id, user_id }).single();', color: "#d4d4d4" },
    ],
  },
  "get-like-notifications": {
    lines: [
      { text: 'const { data } = await supabase', color: "#d4d4d4" },
      { text: '  .from("like_notifications")', color: "#d4d4d4" },
      { text: '  .select("*, actor:profiles(name, avatar_url)")', color: "#d4d4d4" },
      { text: '  .eq("owner_id", user.id)', color: "#d4d4d4" },
      { text: '  .order("created_at", { ascending: false })', color: "#d4d4d4" },
      { text: '  .limit(20);', color: "#d4d4d4" },
    ],
  },
  "get-admin-polaroids": {
    lines: [
      { text: '// Admin-only: Check user role', color: "#6a9955" },
      { text: 'if (user.app_metadata.role !== "admin") {', color: "#d4d4d4" },
      { text: '  return new Response(JSON.stringify({ error: "Forbidden" }),', color: "#d4d4d4" },
      { text: '    { status: 403 });', color: "#d4d4d4" },
      { text: '}', color: "#d4d4d4" },
      { text: '', color: "" },
      { text: 'let query = supabase.from("polaroids")', color: "#d4d4d4" },
      { text: '  .select("*, profile->handles")', color: "#d4d4d4" },
      { text: '  .order(sortBy, { ascending: sortAsc });', color: "#d4d4d4" },
    ],
  },
};

function CodeViewer() {
  const [activeFunction, setActiveFunction] = useState("create-polaroid");
  const snippet = codeSnippets[activeFunction];

  return (
    <div className="border-t border-border/50 pt-6">
      {/* Function tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {edgeFunctions.map((fn) => (
          <button
            key={fn.name}
            type="button"
            onClick={() => setActiveFunction(fn.name)}
            className={clsx(
              "px-3 py-1.5 text-xs font-mono rounded-sm transition-all",
              activeFunction === fn.name
                ? "bg-accent text-white"
                : "bg-card-02 text-fg-muted hover:text-fg hover:bg-card-02/80"
            )}
          >
            {fn.name}
          </button>
        ))}
      </div>

      {/* Code display */}
      <div className="flex items-center gap-2 mb-3">
        <Code2 className="w-4 h-4 text-accent" strokeWidth={1.5} />
        <span className="text-xs font-mono text-fg-muted">{activeFunction}/index.ts</span>
      </div>
      <div className="bg-[#1a1a1a] rounded-sm p-4 overflow-x-auto text-[13px] leading-relaxed">
        <pre className="font-mono">
          <code>
            <span className="text-[#c586c0]">import</span>
            <span className="text-[#d4d4d4]">{" { createClient } "}</span>
            <span className="text-[#c586c0]">from</span>
            <span className="text-[#ce9178]"> "@supabase/supabase-js"</span>
            <span className="text-[#d4d4d4]">;</span>
            {"\n\n"}
            <span className="text-[#569cd6]">Deno</span>
            <span className="text-[#d4d4d4]">.serve(</span>
            <span className="text-[#c586c0]">async</span>
            <span className="text-[#d4d4d4]"> (</span>
            <span className="text-[#9cdcfe]">req</span>
            <span className="text-[#d4d4d4]">) </span>
            <span className="text-[#c586c0]">{"=>"}</span>
            <span className="text-[#d4d4d4]"> {"{"}</span>
            {"\n"}
            {snippet.lines.map((line, i) => (
              <span key={`${line.text}-${i}`}>
                <span className="text-[#d4d4d4]">{"  "}</span>
                <span style={{ color: line.color }}>{line.text}</span>
                {"\n"}
              </span>
            ))}
            <span className="text-[#d4d4d4]">{"})"}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

function ArchitectureDiagram({ t }: { t: ReturnType<typeof useLanguage>["t"] }) {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Connection lines - SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} aria-label="Architecture diagram connections">
        <title>Architecture diagram connections</title>
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
        <div className="col-span-3 flex justify-center gap-8 flex-wrap">
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Code2 className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">{t.tech.arch.reactApp}</div>
            <div className="text-xs text-fg-muted">{t.tech.arch.reactAppDesc}</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Palette className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">{t.tech.arch.tailwind}</div>
            <div className="text-xs text-fg-muted">{t.tech.arch.tailwindDesc}</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Layers className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">{t.tech.arch.reactQuery}</div>
            <div className="text-xs text-fg-muted">{t.tech.arch.reactQueryDesc}</div>
          </div>
        </div>

        {/* Middle - Edge Functions */}
        <div className="col-span-3 flex justify-center my-8">
          <div className="card-panel p-6 text-center border-accent/30 border-2 min-w-[200px] max-w-[400px]">
            <Server className="w-10 h-10 mx-auto mb-3 text-accent" strokeWidth={1.5} />
            <div className="text-base font-semibold text-fg">{t.tech.arch.edgeFunctions}</div>
            <div className="text-xs text-fg-muted mt-1">{t.tech.arch.edgeFunctionsDesc}</div>
            <div className="flex gap-2 justify-center mt-3 flex-wrap">
              {edgeFunctions.slice(0, 4).map((fn) => (
                <span key={fn.name} className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">{fn.name}</span>
              ))}
            </div>
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              {edgeFunctions.slice(4).map((fn) => (
                <span key={fn.name} className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">{fn.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row - Database & Storage */}
        <div className="col-span-3 flex justify-center gap-8 flex-wrap">
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Database className="w-8 h-8 mx-auto mb-2 text-[#3ECF8E]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">{t.tech.arch.postgres}</div>
            <div className="text-xs text-fg-muted">{t.tech.arch.postgresDesc}</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Zap className="w-8 h-8 mx-auto mb-2 text-[#3ECF8E]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">{t.tech.arch.realtime}</div>
            <div className="text-xs text-fg-muted">{t.tech.arch.realtimeDesc}</div>
          </div>
          <div className="card-panel p-4 text-center min-w-[140px]">
            <Camera className="w-8 h-8 mx-auto mb-2 text-[#3ECF8E]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-fg">{t.tech.arch.storage}</div>
            <div className="text-xs text-fg-muted">{t.tech.arch.storageDesc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { num: 1, title: "Create & Autosave", desc: "Fill profile, upload photo. Auto-saves to database" },
    { num: 2, title: "Generate Portrait", desc: "Automatically generates portrait image after creation" },
    { num: 3, title: "Preview", desc: "See live preview with 3D tilt effect" },
    { num: 4, title: "Export", desc: "Download high-res PNG for printing" },
    { num: 5, title: "Share", desc: "Post to X or share link. Generates OG image" },
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

function CopyPromptButton() {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CURSOR_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(
        "absolute top-4 right-4 px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 flex items-center gap-2",
        copied
          ? "bg-green-600 text-white"
          : "bg-accent text-white hover:bg-accent/90"
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" strokeWidth={1.5} />
          <span>{t.tech.cursorPrompt.copied}</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" strokeWidth={1.5} />
          <span>{t.tech.cursorPrompt.copy}</span>
        </>
      )}
    </button>
  );
}

export function TechPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Features with translations - now including likes, oauth, autosave
  const features = [
    { icon: Camera, ...t.tech.features.imageCapture },
    { icon: Palette, ...t.tech.features.themeSystem },
    { icon: Database, ...t.tech.features.realtimeSync },
    { icon: Printer, ...t.tech.features.printExport },
    { icon: Share2, ...t.tech.features.socialSharing },
    { icon: Globe, ...t.tech.features.i18n },
    { icon: Heart, ...t.tech.features.likes },
    { icon: KeyRound, ...t.tech.features.oauth },
    { icon: Save, ...t.tech.features.autosave },
  ];

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
            <span className="text-sm font-medium">{t.tech.back}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CursorIcon className="w-5 h-5" />
              <span className="font-display font-semibold text-fg">Cafe Cursor</span>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-fg mb-4 tracking-tight">
            {t.tech.title}
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto font-body">
            {t.tech.subtitle}
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {t.tech.sections.techStack}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => {
              const IconComponent = tech.icon;
              // Vercel Analytics: white in dark mode, black in light mode
              const iconColor = tech.name === "Vercel Analytics" 
                ? (theme === "dark" ? "#ffffff" : "#000000")
                : tech.color;
              return (
                <div
                  key={tech.name}
                  className="card-panel px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ borderColor: `${tech.color}30` }}
                >
                  <IconComponent className="w-4 h-4" strokeWidth={1.5} style={{ color: iconColor }} />
                  <span className="font-medium text-fg text-sm">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* User Flow */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {t.tech.sections.userFlow}
          </h2>
          <div className="card-panel p-6">
            <FlowDiagram />
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {t.tech.sections.architecture}
          </h2>
          <div className="card-panel p-6 overflow-x-auto">
            <ArchitectureDiagram t={t} />
          </div>
        </section>

        {/* Edge Functions */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {t.tech.sections.edgeFunctions}
          </h2>
          <div className="card-panel p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {edgeFunctions.map((fn) => (
                <div key={fn.name} className="flex items-start gap-3 p-3 rounded-sm bg-card-02/50">
                  <Terminal className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <code className="text-sm font-mono text-fg font-medium">{fn.name}</code>
                    <p className="text-xs text-fg-muted mt-1">{t.tech.edgeFns[fn.key]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <CodeViewer />
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-8 text-center">
            {t.tech.sections.features}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-panel p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-fg mb-2">{feature.title}</h3>
                <p className="text-sm text-fg-muted font-body leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Print Pipeline */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {t.tech.sections.printPipeline}
          </h2>
          <div className="card-panel p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-card-02 flex items-center justify-center">
                  <Code2 className="w-7 h-7 text-fg-muted" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">{t.tech.print.domRender.title}</div>
                <div className="text-xs text-fg-muted mt-1">{t.tech.print.domRender.desc}</div>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-card-02 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-fg-muted" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">{t.tech.print.screenshot.title}</div>
                <div className="text-xs text-fg-muted mt-1">{t.tech.print.screenshot.desc}</div>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-card-02 flex items-center justify-center">
                  <Database className="w-7 h-7 text-fg-muted" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">{t.tech.print.storage.title}</div>
                <div className="text-xs text-fg-muted mt-1">{t.tech.print.storage.desc}</div>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                  <Printer className="w-7 h-7 text-accent" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-fg">{t.tech.print.printReady.title}</div>
                <div className="text-xs text-fg-muted mt-1">{t.tech.print.printReady.desc}</div>
              </div>
            </div>
            
            {/* Detailed explanation */}
            <div className="border-t border-border/50 pt-6 mt-6">
              <h3 className="font-display text-lg font-semibold text-fg mb-4 text-center">
                {t.tech.print.details.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-fg">{t.tech.print.details.step1.title}</h4>
                  <p className="text-xs text-fg-muted leading-relaxed">{t.tech.print.details.step1.desc}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-fg">{t.tech.print.details.step2.title}</h4>
                  <p className="text-xs text-fg-muted leading-relaxed">{t.tech.print.details.step2.desc}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-fg">{t.tech.print.details.step3.title}</h4>
                  <p className="text-xs text-fg-muted leading-relaxed">{t.tech.print.details.step3.desc}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-fg">{t.tech.print.details.step4.title}</h4>
                  <p className="text-xs text-fg-muted leading-relaxed">{t.tech.print.details.step4.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cursor Prompt */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-fg mb-6 text-center">
            {t.tech.sections.cursorPrompt}
          </h2>
          <div className="card-panel p-6">
            <p className="text-sm text-fg-muted mb-4 text-center font-body">
              {t.tech.cursorPrompt.description}
            </p>
            <div className="relative">
              <div className="bg-[#1a1a1a] rounded-sm p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                <pre className="text-[11px] leading-relaxed font-mono text-[#d4d4d4] whitespace-pre-wrap">
                  <code>{CURSOR_PROMPT}</code>
                </pre>
              </div>
              <CopyPromptButton />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-panel p-8 max-w-lg mx-auto">
            <CursorIcon className="w-10 h-10 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-fg mb-3">
              {t.tech.cta.title}
            </h2>
            <p className="text-sm text-fg-muted mb-6 font-body">
              {t.tech.cta.subtitle}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-sm font-medium hover:bg-accent/90 transition-colors"
            >
              {t.tech.cta.button}
            </Link>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
