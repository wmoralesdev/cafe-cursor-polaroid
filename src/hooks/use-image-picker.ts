import { useCallback, useState, useEffect } from "react";

interface UseImagePickerOptions {
  initialImage?: string | null;
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
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setError(null);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
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
