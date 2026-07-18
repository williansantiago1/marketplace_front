import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders";
import { OrderStatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { formatBRL } from "../../lib/money";

export function OrdersPage() {
  useEffect(() => {
    document.title = "Pedidos · Vitrine";
  }, []);

  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.listMine(),
  });

  if (orders.isLoading) return <Spinner />;
  if (!orders.data?.length) {
    return (
      <EmptyState
        title="Nenhum pedido ainda"
        actionLabel="Ir às compras"
        actionTo="/produtos"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Meus pedidos</h1>
      <ul className="space-y-3">
        {orders.data.map((order) => (
          <li key={order.id}>
            <Link
              to={`/pedidos/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white p-4 transition hover:bg-cream/40"
            >
              <div>
                <p className="font-medium">
                  Pedido {order.id.slice(0, 8)}…
                </p>
                <p className="text-sm text-muted">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="font-semibold tabular-nums">
                  {formatBRL(order.totalInCents)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
