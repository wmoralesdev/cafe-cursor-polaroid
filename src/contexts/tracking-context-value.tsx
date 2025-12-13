import { createContext } from "react";

export type SourceType = "event" | "x" | "github" | "shared" | "direct";

interface TrackingContextType {
  source: SourceType;
  referredBy: string | null;
  utmSource: string | null;
}

export const TrackingContext = createContext<TrackingContextType>({
  source: "direct",
  referredBy: null,
  utmSource: null,
});



