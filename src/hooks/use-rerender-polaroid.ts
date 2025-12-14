import { useCallback, useEffect, useState } from "react";
import { domToPng } from "modern-screenshot";
import { useUpdatePolaroid } from "@/hooks/use-polaroids-query";
import { useAuth } from "@/hooks/use-auth";
import type { PolaroidRecord } from "@/lib/polaroids";

interface UseRerenderPolaroidOptions {
  polaroid: PolaroidRecord | null;
  polaroidRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
}

/**
 * Hook to automatically re-render polaroids that were stored incorrectly
 * (when source_image_url === image_url, meaning no layout was applied)
 */
export function useRerenderPolaroid({ polaroid, polaroidRef, enabled = true }: UseRerenderPolaroidOptions) {
  const [isRerendering, setIsRerendering] = useState(false);
  const [hasRerendered, setHasRerendered] = useState(false);
  const updateMutation = useUpdatePolaroid();
  const { user } = useAuth();
  
  // Only allow re-rendering if user owns the polaroid
  const canRerender = polaroid && user && polaroid.user_id === user.id;

  const generateImageDataUrl = useCallback(async (): Promise<string | null> => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:44',message:'generateImageDataUrl called',data:{hasRef:!!polaroidRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (!polaroidRef.current) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:47',message:'Ref is null, aborting',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return null;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:52',message:'Calling domToPng',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const dataUrl = await domToPng(polaroidRef.current, {
        scale: 4,
        backgroundColor: "#ffffff",
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:59',message:'domToPng completed',data:{hasDataUrl:!!dataUrl,dataUrlLength:dataUrl?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return dataUrl;
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:63',message:'domToPng error',data:{error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error("Failed to generate polaroid image", err);
      return null;
    }
  }, [polaroidRef]);

  const needsRerender = !!polaroid?.source_image_url;

  // #region agent log
  useEffect(() => {
    if (polaroid) {
      const polaroidId = polaroid.id;
      const hasSourceImage = !!polaroid.source_image_url;
      const hasImageUrl = !!polaroid.image_url;
      const sourceImageUrl = polaroid.source_image_url?.substring(0, 50);
      const imageUrl = polaroid.image_url?.substring(0, 50);
      const urlsMatch = polaroid.source_image_url === polaroid.image_url;
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:39',message:'Detection check',data:{polaroidId,hasSourceImage,hasImageUrl,sourceImageUrl,imageUrl,urlsMatch,needsRerender,enabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
  }, [polaroid, needsRerender, enabled]);
  // #endregion

  const rerenderPolaroid = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:68',message:'rerenderPolaroid called',data:{hasPolaroid:!!polaroid,polaroidId:polaroid?.id,needsRerender,hasRerendered,isRerendering,hasRef:!!polaroidRef.current,canRerender},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    if (!polaroid || !needsRerender || hasRerendered || isRerendering || !polaroidRef.current || !canRerender) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:71',message:'rerenderPolaroid aborted',data:{reason:!polaroid?'no polaroid':!needsRerender?'no need':hasRerendered?'already rendered':isRerendering?'already rendering':!polaroidRef.current?'no ref':!canRerender?'not owner':'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      return;
    }

    setIsRerendering(true);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:76',message:'Starting render process',data:{polaroidId:polaroid.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    try {
      // Wait a bit for the component to render
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const dataUrl = await generateImageDataUrl();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:83',message:'Image generated, updating',data:{hasDataUrl:!!dataUrl,polaroidId:polaroid.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      if (dataUrl && polaroid.id) {
        await updateMutation.mutateAsync({
          id: polaroid.id,
          params: {
            imageDataUrl: dataUrl,
          },
        });
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:93',message:'Update mutation completed',data:{polaroidId:polaroid.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        setHasRerendered(true);
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:98',message:'Render process error',data:{error:err instanceof Error?err.message:String(err),polaroidId:polaroid.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.error("Failed to re-render polaroid:", err);
    } finally {
      setIsRerendering(false);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:104',message:'Render process finished',data:{polaroidId:polaroid.id,hasRerendered},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
    }
  }, [polaroid, needsRerender, hasRerendered, isRerendering, canRerender, generateImageDataUrl, updateMutation, polaroidRef]);

  useEffect(() => {
    // #region agent log
    const polaroidId = polaroid?.id;
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-rerender-polaroid.ts:110',message:'Effect trigger check',data:{enabled,needsRerender,hasRerendered,isRerendering,canRerender,polaroidId,willSchedule:enabled&&needsRerender&&!hasRerendered&&!isRerendering&&canRerender},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    if (enabled && needsRerender && !hasRerendered && !isRerendering && canRerender && polaroid) {
      // Delay to ensure component is mounted
      const timer = setTimeout(() => {
        rerenderPolaroid();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [enabled, needsRerender, hasRerendered, isRerendering, canRerender, rerenderPolaroid, polaroid]);

  return {
    isRerendering,
    needsRerender,
  };
}

