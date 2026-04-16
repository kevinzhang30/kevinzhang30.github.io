import { cn } from "../../lib/cn";

export default function SpaceCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-teal-500/20 bg-gray-900/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-[0_4px_24px_rgba(0,131,143,0.25)] hover:bg-gray-900/90",
        className,
      )}
    >
      {/* Teal accent on top edge — widens on hover */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent transition-all duration-300 group-hover:left-2 group-hover:right-2 group-hover:via-teal-400/70" />
      {children}
    </div>
  );
}
