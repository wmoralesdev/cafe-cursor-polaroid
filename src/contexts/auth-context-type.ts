import type { User, Session } from "@supabase/supabase-js";

export type AuthProvider = "twitter" | "linkedin_oidc" | null;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  provider: AuthProvider;
  signInWithLinkedIn: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
}

