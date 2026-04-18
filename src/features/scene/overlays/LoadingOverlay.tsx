import { useProgress } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";

const MAX_WAIT_MS = 30_000;

export default function LoadingOverlay() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const dismissed = useRef(false);

  useEffect(() => {
    if (!active && progress === 100 && !dismissed.current) {
      dismissed.current = true;
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!dismissed.current) {
        dismissed.current = true;
        setVisible(false);
      }
    }, MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const done = !active && progress === 100;

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020611] transition-opacity duration-500 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-sky-200/80">
        Initializing station systems
      </p>

      <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(0,200,200,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 font-mono text-xs tabular-nums text-slate-400">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
