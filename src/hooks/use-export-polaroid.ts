import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";

export function useExportPolaroid() {
  const ref = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = useCallback(async () => {
    if (ref.current === null) {
      return;
    }

    setIsExporting(true);

    try {
      // Small delay to ensure images are fully rendered/loaded if needed
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2, // Better quality
      });

      const link = document.createElement("a");
      link.download = `polaroid-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export polaroid", err);
      // Ideally show a toast here
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    ref,
    isExporting,
    exportImage,
  };
}

