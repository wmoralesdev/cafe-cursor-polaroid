import { useState, useEffect } from "react";

// ============================================
// Animated Dot Grid Background
// ============================================
export function AnimatedBackground() {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPulse = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setPulses((prev) => [...prev.slice(-5), newPulse]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Static dot grid */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Pulse effects */}
      {pulses.map((pulse) => (
        <div
          key={pulse.id}
          className="absolute w-32 h-32 rounded-full border border-accent/40"
          style={{
            left: `${pulse.x}%`,
            top: `${pulse.y}%`,
            transform: "translate(-50%, -50%)",
            animation: "pulse-ring 3s ease-out forwards",
          }}
        />
      ))}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
