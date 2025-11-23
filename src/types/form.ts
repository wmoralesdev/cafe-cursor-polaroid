export type Platform = "github" | "x" | "instagram";

export interface Profile {
  platform: Platform;
  handle: string;
  techStack: string[];
}

export interface PolaroidFormValues {
  profiles: Profile[];
}

