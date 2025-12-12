import { useState, useEffect, type ReactNode } from "react";
import { TrackingContext } from "./tracking-context-value";

export type SourceType = "event" | "x" | "github" | "shared" | "direct";

const STORAGE_KEY = "polaroid-tracking";

function determineSource(utmSource: string | null, ref: string | null, referrer: string): SourceType {
  // Priority 1: Event source (highest priority)
  if (utmSource === "event") {
    return "event";
  }
  
  // Priority 2: Referral from another user
  if (ref) {
    return "shared";
  }
  
  // Priority 3: Check UTM source for social platforms
  if (utmSource === "x" || utmSource === "twitter") {
    return "x";
  }
  
  if (utmSource === "github") {
    return "github";
  }
  
  // Priority 4: Check document referrer
  const lowerReferrer = referrer.toLowerCase();
  if (lowerReferrer.includes("twitter.com") || lowerReferrer.includes("x.com")) {
    return "x";
  }
  
  if (lowerReferrer.includes("github.com")) {
    return "github";
  }
  
  // Default: direct visit
  return "direct";
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<SourceType>("direct");
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [utmSource, setUtmSource] = useState<string | null>(null);

  useEffect(() => {
    // Always parse URL parameters first (they take priority over localStorage)
    const params = new URLSearchParams(window.location.search);
    const urlUtmSource = params.get("utm_source");
    const urlRef = params.get("ref");
    const documentReferrer = document.referrer || "";

    // Determine source from current URL/referrer
    const determinedSource = determineSource(urlUtmSource, urlRef, documentReferrer);
    
    // Use a callback to batch state updates
    const updateTracking = () => {
      // If we have URL params or referrer, use them (overrides localStorage)
      if (urlUtmSource || urlRef || documentReferrer) {
        setSource(determinedSource);
        setReferredBy(urlRef);
        setUtmSource(urlUtmSource);

        // Store in localStorage for persistence across auth redirects
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            source: determinedSource,
            referredBy: urlRef,
            utmSource: urlUtmSource,
          })
        );
      } else {
        // If no URL params or referrer, try loading from localStorage (for persistence across auth redirects)
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setSource(parsed.source || "direct");
            setReferredBy(parsed.referredBy || null);
            setUtmSource(parsed.utmSource || null);
            return;
          } catch {
            // Invalid stored data, fall through to default
          }
        }

        // Default fallback
        setSource("direct");
        setReferredBy(null);
        setUtmSource(null);
      }
    };
    
    // Use setTimeout to defer state updates outside the effect
    const timeoutId = setTimeout(updateTracking, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <TrackingContext.Provider value={{ source, referredBy, utmSource }}>
      {children}
    </TrackingContext.Provider>
  );
}


