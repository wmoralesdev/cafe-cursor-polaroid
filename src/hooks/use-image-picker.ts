import { useCallback, useState, useEffect } from "react";

interface UseImagePickerOptions {
  initialImage?: string | null;
}

const MAX_IMAGE_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB target

function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Scale down if larger than max dimension
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try JPEG first with decreasing quality until under size limit
      let quality = JPEG_QUALITY;
      let result = canvas.toDataURL("image/jpeg", quality);
      
      while (result.length > MAX_FILE_SIZE && quality > 0.3) {
        quality -= 0.1;
        result = canvas.toDataURL("image/jpeg", quality);
      }

      resolve(result);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

export function useImagePicker(options: UseImagePickerOptions = {}) {
  const [image, setImage] = useState<string | null>(options.initialImage ?? null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Hydrate from initial image when it changes (e.g., loading an existing polaroid)
  useEffect(() => {
    if (options.initialImage !== undefined) {
      setImage(options.initialImage);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [options.initialImage]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      try {
        const compressed = await compressImage(rawDataUrl);
        setImage(compressed);
        setError(null);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      } catch {
        setError("Failed to process image");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    },
    [processFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const clearImage = useCallback(() => {
    setImage(null);
    setError(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    image,
    error,
    zoom,
    position,
    setZoom,
    setPosition,
    onDrop,
    onFileChange,
    clearImage,
  };
}
