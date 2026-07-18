import { Link } from "react-router-dom";
import { Button } from "./Button";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
};

export function EmptyState({ title, description, actionLabel, actionTo }: Props) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-cream bg-white/60 px-6 py-14 text-center">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6 inline-block">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
