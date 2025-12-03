import type { CursorFeature, PlanTier, CursorTenure } from "@/types/form";

export const CURSOR_MODELS: { id: string; label: string }[] = [
  // GPT-5 Series
  { id: "gpt-5", label: "GPT-5" },
  { id: "gpt-5-high", label: "GPT-5 High" },
  { id: "gpt-5-high-fast", label: "GPT-5 High Fast" },
  { id: "gpt-5-low", label: "GPT-5 Low" },
  { id: "gpt-5-low-fast", label: "GPT-5 Low Fast" },
  { id: "gpt-5-fast", label: "GPT-5 Fast" },
  { id: "gpt-5-medium", label: "GPT-5 Medium" },
  { id: "gpt-5-medium-fast", label: "GPT-5 Medium Fast" },
  { id: "gpt-5-mini", label: "GPT-5 Mini" },
  { id: "gpt-5-nano", label: "GPT-5 Nano" },
  { id: "gpt-5-pro", label: "GPT-5 Pro" },
  
  // GPT-5 Codex
  { id: "gpt-5-codex", label: "GPT-5 Codex" },
  { id: "gpt-5-codex-high", label: "GPT-5 Codex High" },
  { id: "gpt-5-codex-fast", label: "GPT-5 Codex Fast" },
  { id: "gpt-5-codex-high-fast", label: "GPT-5 Codex High Fast" },

  // GPT-5.1 Series
  { id: "gpt-5.1", label: "GPT-5.1" },
  { id: "gpt-5.1-high", label: "GPT-5.1 High" },
  { id: "gpt-5.1-high-fast", label: "GPT-5.1 High Fast" },
  { id: "gpt-5.1-low", label: "GPT-5.1 Low" },
  { id: "gpt-5.1-low-fast", label: "GPT-5.1 Low Fast" },
  { id: "gpt-5.1-fast", label: "GPT-5.1 Fast" },
  
  // GPT-5.1 Codex
  { id: "gpt-5.1-codex", label: "GPT-5.1 Codex" },
  { id: "gpt-5.1-codex-fast", label: "GPT-5.1 Codex Fast" },
  { id: "gpt-5.1-codex-high", label: "GPT-5.1 Codex High" },
  { id: "gpt-5.1-codex-high-fast", label: "GPT-5.1 Codex High Fast" },
  { id: "gpt-5.1-codex-low", label: "GPT-5.1 Codex Low" },
  { id: "gpt-5.1-codex-low-fast", label: "GPT-5.1 Codex Low Fast" },
  { id: "gpt-5.1-codex-mini", label: "GPT-5.1 Codex Mini" },
  { id: "gpt-5.1-codex-mini-high", label: "GPT-5.1 Codex Mini High" },
  { id: "gpt-5.1-codex-mini-low", label: "GPT-5.1 Codex Mini Low" },

  // GPT-4 / Others
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "composer-1", label: "Composer 1" },

  // Anthropic
  { id: "opus-4.5", label: "Opus 4.5" },
  { id: "opus-4.1", label: "Opus 4.1" },
  { id: "opus-4", label: "Opus 4" },
  { id: "sonnet-4.5", label: "Sonnet 4.5" },
  { id: "sonnet-4", label: "Sonnet 4" },
  { id: "sonnet-4-1m", label: "Sonnet 4 1M" },
  { id: "haiku-4.5", label: "Haiku 4.5" },

  // Google
  { id: "gemini-3-pro", label: "Gemini 3 Pro" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },

  // xAI
  { id: "grok-code", label: "Grok Code" },
  { id: "grok-4", label: "Grok 4" },
  { id: "grok-4-fast", label: "Grok 4 Fast" },

  // DeepSeek
  { id: "deepseek-r1", label: "DeepSeek R1" },
  { id: "deepseek-v3.1", label: "DeepSeek V3.1" },

  // OpenAI o-series
  { id: "o3", label: "o3" },
  { id: "o3-pro", label: "o3 Pro" },
];

export const CURSOR_FEATURES: { id: CursorFeature; label: string }[] = [
  { id: "agent", label: "Agent Mode" },
  { id: "tab", label: "Tab" },
  { id: "voice", label: "Voice Input" },
  { id: "browser", label: "Browser" },
  { id: "rules", label: "Rules" },
];

export const PLAN_TIERS: { id: PlanTier; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
  { id: "pro-plus", label: "Pro+" },
  { id: "ultra", label: "Ultra" },
  { id: "student", label: "Student" },
];

export const TECH_EXTRAS = [
  "React", "Next.js", "TypeScript", "Python", "Rust", "Go", 
  "Tailwind", "Supabase", "Postgres", "Swift", "Kotlin", "Svelte", "Vue",
  "LangChain", "Pydantic AI", "Vercel", "Cloudflare", "Stripe", "Turso",
  "Bun", "Deno", "Hono", "Astro", "Solid", "Qwik"
];

export const CURSOR_TENURES: { id: CursorTenure; label: string }[] = [
  { id: "day-1", label: "Day 1" },
  { id: "2023", label: "2023" },
  { id: "2024", label: "2024" },
  { id: "2025", label: "2025" },
  { id: "recently", label: "Recently" },
];
