import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ className, label, error, id, children, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-ink">{label}</span>}
      <select
        id={inputId}
        className={cn(
          "rounded-[var(--radius-md)] border border-cream bg-white px-3 py-2.5 outline-none focus:border-petrol",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-coral">{error}</span>}
    </label>
  );
}
