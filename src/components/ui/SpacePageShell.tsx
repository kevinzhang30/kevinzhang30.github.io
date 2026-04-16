import { useState, useEffect } from "react";
import { cn } from "../../lib/cn";

export default function SpacePageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [showScanline, setShowScanline] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Brief scanline flash on mount
    const scanTimer = setTimeout(() => setShowScanline(false), 300);
    const contentTimer = setTimeout(() => setContentVisible(true), 100);
    return () => {
      clearTimeout(scanTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <main
      className={cn(
        "relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-24 md:pb-12",
        className,
      )}
    >
      {/* Scanline flash effect */}
      {showScanline && (
        <div className="pointer-events-none fixed inset-0 z-50 animate-pulse bg-[repeating-linear-gradient(0deg,rgba(0,200,200,0.06),rgba(0,200,200,0.06)_2px,transparent_2px,transparent_4px)]" />
      )}

      <div
        className={cn(
          "rounded-xl border border-teal-500/20 bg-gray-900/60 p-8 shadow-[0_0_15px_rgba(0,131,143,0.15)] transition-all duration-500",
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        )}
      >
        {children}
      </div>
    </main>
  );
}
