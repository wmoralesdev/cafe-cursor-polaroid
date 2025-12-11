import { useState, useEffect } from "react";
import { usePolaroid } from "@/hooks/use-polaroids-query";

export function useSharedPolaroid() {
  const [sharedPolaroidId, setSharedPolaroidId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("p");
    }
    return null;
  });

  const { data: sharedPolaroid } = usePolaroid(sharedPolaroidId);

  // Update document title when viewing a shared polaroid
  useEffect(() => {
    const handle = sharedPolaroid?.profile?.handles?.[0]?.handle;
    if (handle) {
      const originalTitle = document.title;
      document.title = `Cafe Cursor – ${handle}'s card`;
      return () => {
        document.title = originalTitle;
      };
    }
  }, [sharedPolaroid]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSharedPolaroidId(params.get("p"));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCloseModal = () => {
    setSharedPolaroidId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("p");
    window.history.replaceState({}, "", url.toString());
  };

  return {
    sharedPolaroidId,
    setSharedPolaroidId,
    handleCloseModal,
  };
}








