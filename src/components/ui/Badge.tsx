import { cn } from "../../lib/cn";
import type { OrderStatus } from "../../types/order";

const statusClass: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-900",
  PAID: "bg-petrol/15 text-petrol",
  SHIPPED: "bg-sky-100 text-sky-900",
  DELIVERED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-cream text-muted",
  FAILED: "bg-coral/15 text-coral",
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  FAILED: "Falhou",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        statusClass[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
