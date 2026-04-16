export default function SpaceTag({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-400">
      {label}
    </span>
  );
}
