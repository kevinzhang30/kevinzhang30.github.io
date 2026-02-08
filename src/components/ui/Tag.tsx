import { cn } from "../../lib/cn";

export default function Tag({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "primary";
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "primary"
          ? "bg-primary-50 text-primary-700"
          : "bg-gray-100 text-gray-600",
      )}
    >
      {label}
    </span>
  );
}
