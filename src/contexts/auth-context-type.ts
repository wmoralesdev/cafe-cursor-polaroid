import type { User, Session } from "@supabase/supabase-js";

export type AuthProvider = "twitter" | "github" | null;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  provider: AuthProvider;
  signInWithGitHub: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
}

