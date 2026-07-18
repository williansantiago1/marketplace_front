import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-coral text-white hover:bg-[#d44f3f] disabled:opacity-50",
  secondary:
    "bg-petrol text-white hover:bg-[#0a332f] disabled:opacity-50",
  ghost:
    "bg-transparent text-ink hover:bg-cream disabled:opacity-50",
  danger:
    "bg-ink text-white hover:bg-black disabled:opacity-50",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold transition",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
