interface LabelsProps {
  label: string | null;
  description: string | null;
  position: { x: number; y: number } | null;
}

export default function Labels({ label, description, position }: LabelsProps) {
  if (!label || !position) return null;

  return (
    <div
      className="pointer-events-none fixed z-20 flex flex-col items-center gap-1"
      style={{
        left: position.x,
        top: position.y - 40,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="rounded-lg border border-teal-400/30 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-sm font-semibold text-teal-300">{label}</p>
        {description && (
          <p className="text-xs text-teal-400/70">{description}</p>
        )}
      </div>
      <div className="h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-teal-400/30" />
    </div>
  );
}
