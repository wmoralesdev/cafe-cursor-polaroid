import { useRef, useState, useCallback } from "react";
import { domToPng } from "modern-screenshot";

export function useExportPolaroid() {
  const ref = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const generateImageDataUrl = useCallback(async (): Promise<string | null> => {
    if (ref.current === null) {
      return null;
    }

    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await domToPng(ref.current, {
        scale: 4,
        backgroundColor: "#ffffff",
      });

      return dataUrl;
    } catch (err) {
      console.error("Failed to generate polaroid image", err);
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportImage = useCallback(async (): Promise<string | null> => {
    const dataUrl = await generateImageDataUrl();
    
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = `polaroid-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }

    return dataUrl;
  }, [generateImageDataUrl]);

  return {
    ref,
    isExporting,
    exportImage,
    generateImageDataUrl,
  };
}




