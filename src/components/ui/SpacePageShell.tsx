import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import { getDestinationByRoute } from "../../features/scene/config";
import { usePanelVisibility } from "../../features/scene/panelVisibility";

const DEFAULT_ACCENT = "#7acfff";

export default function SpacePageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [showScanline, setShowScanline] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const { hidden: panelHidden, setHidden: setPanelHidden } = usePanelVisibility();
  const { pathname } = useLocation();
  const accent = getDestinationByRoute(pathname)?.accent ?? DEFAULT_ACCENT;

  useEffect(() => {
    const scanTimer = setTimeout(() => setShowScanline(false), 300);
    const contentTimer = setTimeout(() => setContentVisible(true), 100);
    return () => {
      clearTimeout(scanTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setPanelHidden(!panelHidden)}
        aria-label={panelHidden ? "Show panel" : "Hide panel"}
        className="fixed top-6 right-6 z-40 flex items-center gap-2 rounded-full border bg-gray-950/80 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] backdrop-blur-md transition-all hover:bg-gray-900/90"
        style={{
          color: accent,
          borderColor: `${accent}55`,
          boxShadow: `0 0 14px ${accent}25`,
        }}
      >
        {panelHidden ? (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        )}
        {panelHidden ? "Show" : "Hide"}
      </button>

      <main
        className={cn(
          "relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-24 md:pb-12 transition-opacity duration-300",
          panelHidden && "pointer-events-none opacity-0",
          className,
        )}
      >
        {showScanline && (
          <div className="pointer-events-none fixed inset-0 z-50 animate-pulse bg-[repeating-linear-gradient(0deg,rgba(0,200,200,0.06),rgba(0,200,200,0.06)_2px,transparent_2px,transparent_4px)]" />
        )}

        <div
          className={cn(
            "rounded-xl border border-teal-500/20 bg-gray-950/90 p-8 shadow-[0_0_15px_rgba(0,131,143,0.15)] backdrop-blur-md transition-all duration-500",
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
}
