import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ordersApi } from "../../api/orders";
import { OrderStatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage } from "../../hooks/useAuth";
import { formatBRL } from "../../lib/money";

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const qc = useQueryClient();

  const order = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    document.title = "Pedido · Vitrine";
  }, []);

  const cancel = useMutation({
    mutationFn: () => ordersApi.cancel(id),
    onSuccess: () => {
      toast.success("Pedido cancelado");
      void qc.invalidateQueries({ queryKey: ["order", id] });
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (order.isLoading) return <Spinner />;
  if (!order.data) return <p className="text-muted">Pedido não encontrado.</p>;

  const o = order.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Pedido</h1>
          <p className="text-sm text-muted">{o.id}</p>
        </div>
        <OrderStatusBadge status={o.status} />
      </div>

      <ul className="space-y-2 rounded-[var(--radius-md)] bg-white p-4">
        {o.items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatBRL(item.lineTotalInCents)}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-1 text-sm">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatBRL(o.subtotalInCents)}</span>
        </p>
        <p className="flex justify-between text-muted">
          <span>Desconto</span>
          <span>- {formatBRL(o.discountInCents)}</span>
        </p>
        <p className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatBRL(o.totalInCents)}</span>
        </p>
      </div>

      {o.status === "PENDING_PAYMENT" && (
        <div className="flex flex-wrap gap-3">
          <Link to={`/pedidos/${o.id}/pagar`}>
            <Button>Pagar</Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
          >
            Cancelar pedido
          </Button>
        </div>
      )}
    </div>
  );
}
