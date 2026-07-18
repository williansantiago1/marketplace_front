import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, label, error, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-ink">{label}</span>}
      <input
        id={inputId}
        className={cn(
          "rounded-[var(--radius-md)] border border-cream bg-white px-3 py-2.5 outline-none focus:border-petrol",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-coral">{error}</span>}
    </label>
  );
}
