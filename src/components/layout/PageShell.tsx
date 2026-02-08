import { cn } from "../../lib/cn";

export default function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto max-w-5xl animate-fade-in px-6 pt-24 pb-24 md:pb-12",
        className,
      )}
    >
      {children}
    </main>
  );
}
