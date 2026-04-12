export default function SpaceSectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="font-mono text-2xl font-semibold tracking-tight text-teal-400 drop-shadow-[0_0_6px_rgba(0,131,143,0.4)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
