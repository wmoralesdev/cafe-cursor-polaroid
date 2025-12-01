export type CursorModel = string;
export type CursorFeature = "agent" | "tab" | "voice" | "browser" | "rules";
export type PlanTier = "free" | "pro" | "pro-plus" | "ultra" | "student";

export interface CursorProfile {
  primaryModel: CursorModel; // Coding Model
  secondaryModel: CursorModel; // Thinking Model
  favoriteFeature: CursorFeature;
  planTier: PlanTier;
  projectType: string; // "Building..."
  extras: string[]; // Optional tech tags
  isMaxMode: boolean;
}

export interface PolaroidFormValues {
  profiles: CursorProfile[];
}
