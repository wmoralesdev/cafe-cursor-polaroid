export type CursorModel = string;
export type CursorFeature = "agent" | "tab" | "voice" | "browser" | "rules";
export type PlanTier = "free" | "pro" | "pro-plus" | "ultra" | "student";
export type CursorTenure = "day-1" | "2023" | "2024" | "2025" | "recently";
export type SocialPlatform = "x" | "linkedin";
export type PolaroidTheme = "classic" | "minimal" | "web" | "sakura" | "tokyo" | "cyberpunk" | "matrix";

export interface HandleEntry {
  handle: string;
  platform: SocialPlatform;
}

export interface CursorProfile {
  handles: HandleEntry[];
  primaryModel: CursorModel;
  secondaryModel: CursorModel;
  favoriteFeature: CursorFeature;
  planTier: PlanTier;
  projectType: string;
  extras: string[];
  isMaxMode: boolean;
  cursorSince: CursorTenure;
  stampRotation?: number;
  generatedAt?: string; // ISO date string (YYYY-MM-DD)
  polaroidTheme?: PolaroidTheme;
}

export interface PolaroidFormValues {
  profile: CursorProfile;
}
