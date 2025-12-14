import { useEffect, useState, useRef, useMemo } from "react";
import { useRerenderPolaroid } from "@/hooks/use-rerender-polaroid";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import type { PolaroidRecord } from "@/lib/polaroids";

interface PolaroidRerenderQueueProps {
  polaroids: PolaroidRecord[];
  enabled?: boolean;
}

/**
 * Component that processes polaroids needing re-rendering in a queue
 * to avoid overwhelming the browser with simultaneous renders
 */
export function PolaroidRerenderQueue({ polaroids, enabled = true }: PolaroidRerenderQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const processedIdsRef = useRef<Set<string>>(new Set());
  const polaroidRef = useRef<HTMLDivElement>(null);

  // Filter polaroids that need re-rendering (all polaroids with source_image_url)
  // Filter based on index instead of accessing ref during render
  const needsRerender = useMemo(() => {
    return polaroids.filter((p) => p.source_image_url);
  }, [polaroids]);

  // Get current polaroid based on index (items before currentIndex are considered processed)
  const currentPolaroid = needsRerender[currentIndex] || null;

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'polaroid-rerender-queue.tsx:28',message:'Queue state check',data:{totalPolaroids:polaroids.length,needsRerenderCount:needsRerender.length,currentIndex,processedCount:processedIdsRef.current.size,enabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }, [polaroids.length, needsRerender.length, currentIndex, enabled]);
  // #endregion

  // #region agent log
  useEffect(() => {
    if (needsRerender.length > 0) {
      needsRerender.forEach((p, idx) => {
        fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'polaroid-rerender-queue.tsx:35',message:'Polaroid in queue',data:{index:idx,polaroidId:p.id,sourceImageUrl:p.source_image_url?.substring(0,50),imageUrl:p.image_url?.substring(0,50),urlsMatch:p.source_image_url===p.image_url,isCurrent:idx===currentIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      });
    }
  }, [needsRerender, currentIndex]);
  // #endregion

  // #region agent log
  useEffect(() => {
    const polaroidId = currentPolaroid?.id;
    const hasCurrent = !!currentPolaroid;
    const isEnabled = enabled && hasCurrent;
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'polaroid-rerender-queue.tsx:47',message:'Current polaroid selected',data:{currentPolaroidId:polaroidId,hasCurrentPolaroid:hasCurrent,enabled:isEnabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }, [currentPolaroid, enabled]);
  // #endregion

  const { isRerendering } = useRerenderPolaroid({
    polaroid: currentPolaroid,
    polaroidRef,
    enabled: enabled && !!currentPolaroid,
  });

  // Move to next polaroid when current one finishes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'polaroid-rerender-queue.tsx:50',message:'Queue advance check',data:{hasCurrentPolaroid:!!currentPolaroid,isRerendering,currentPolaroidId:currentPolaroid?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (currentPolaroid && !isRerendering) {
      // Mark as processed in ref (not state to avoid setState in effect)
      processedIdsRef.current.add(currentPolaroid.id);
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'polaroid-rerender-queue.tsx:66',message:'Marking polaroid as processed',data:{polaroidId:currentPolaroid.id,willAdvance:currentIndex<needsRerender.length-1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      // Move to next after a short delay
      const timer = setTimeout(() => {
        if (currentIndex < needsRerender.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 2000); // Wait 2 seconds between renders

      return () => clearTimeout(timer);
    }
  }, [currentPolaroid, isRerendering, currentIndex, needsRerender.length]);

  // Reset index when polaroids change significantly
  useEffect(() => {
    if (needsRerender.length > 0 && currentIndex >= needsRerender.length) {
      processedIdsRef.current.clear();
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setCurrentIndex(0);
      }, 0);
    }
  }, [currentIndex, needsRerender.length]);

  // #region agent log
  useEffect(() => {
    if (currentPolaroid) {
      const polaroidId = currentPolaroid.id;
      const hasRef = !!polaroidRef.current;
      const hasImage = !!currentPolaroid.source_image_url;
      fetch('http://127.0.0.1:7243/ingest/3b85e886-5738-4958-929a-efd54a8f8262',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'polaroid-rerender-queue.tsx:92',message:'Rendering polaroid card',data:{polaroidId,hasRef,hasImage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
  }, [currentPolaroid]);
  // #endregion

  // Render current polaroid invisibly for capture
  if (!currentPolaroid) return null;

  return (
    <div style={{ position: "absolute", left: "-9999px", top: "-9999px", pointerEvents: "none", width: "340px", height: "459px" }}>
      <PolaroidCard
        ref={polaroidRef}
        image={currentPolaroid.source_image_url}
        profile={currentPolaroid.profile}
        variant="export"
        source={currentPolaroid.source}
        zoom={currentPolaroid.profile.imageZoom ?? 1}
        position={currentPolaroid.profile.imagePosition ?? { x: 0, y: 0 }}
      />
    </div>
  );
}
