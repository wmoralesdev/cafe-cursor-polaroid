import { useContext } from "react";
import { TrackingContext } from "@/contexts/tracking-context-value";

export function useTracking() {
  return useContext(TrackingContext);
}

