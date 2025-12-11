import { useRef, useCallback, useState } from "react";
import { domToPng } from "modern-screenshot";

export function useOGImageGenerator() {
  const ogCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOGImage = useCallback(async (): Promise<string | null> => {
    if (!ogCardRef.current) {
      console.warn("OG card ref not available");
      return null;
    }

    setIsGenerating(true);

    try {
      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 200));

      const dataUrl = await domToPng(ogCardRef.current, {
        scale: 1, // 1200x630 is already the target size
        backgroundColor: "#0d0d0d",
        quality: 0.9,
      });

      return dataUrl;
    } catch (err) {
      console.error("Failed to generate OG image", err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    ogCardRef,
    isGenerating,
    generateOGImage,
  };
}








