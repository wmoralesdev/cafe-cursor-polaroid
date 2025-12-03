import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("Error signing in with GitHub:", error);
      throw error;
    }
  };

  const signInWithTwitter = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: window.location.origin,
      },
    });
  
    if (error) {
      console.error("Error signing in with Twitter:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const getProvider = (): "twitter" | "github" | null => {
    if (!session?.user) return null;
    
    const provider = session.user.app_metadata?.provider;
    if (provider === "twitter" || provider === "github") {
      return provider;
    }
    
    const identities = session.user.identities || [];
    if (identities.length > 0) {
      const identityProvider = identities[0].provider;
      if (identityProvider === "twitter") return "twitter";
      if (identityProvider === "github") return "github";
    }
    
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        provider: getProvider(),
        signInWithGitHub,
        signInWithTwitter,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

