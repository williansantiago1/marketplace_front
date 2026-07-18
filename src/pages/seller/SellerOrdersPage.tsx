import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders";
import { storesApi } from "../../api/stores";
import { OrderStatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Spinner";
import { formatBRL } from "../../lib/money";

export function SellerOrdersPage() {
  const [storeId, setStoreId] = useState("");

  useEffect(() => {
    document.title = "Pedidos · Painel";
  }, []);

  const stores = useQuery({
    queryKey: ["my-stores"],
    queryFn: () => storesApi.listMine(),
  });

  useEffect(() => {
    if (!storeId && stores.data?.[0]) setStoreId(stores.data[0].id);
  }, [stores.data, storeId]);

  const orders = useQuery({
    queryKey: ["store-orders", storeId],
    queryFn: () => ordersApi.listByStore(storeId),
    enabled: Boolean(storeId),
  });

  if (stores.isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Pedidos da loja</h2>
      <Select label="Loja" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
        {stores.data?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>
      {orders.isLoading ? (
        <Spinner />
      ) : !orders.data?.length ? (
        <EmptyState title="Nenhum pedido nesta loja" />
      ) : (
        <ul className="space-y-2">
          {orders.data.map((order) => (
            <li key={order.id}>
              <Link
                to={`/pedidos/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white p-4"
              >
                <span className="text-sm">{order.id.slice(0, 8)}…</span>
                <OrderStatusBadge status={order.status} />
                <span className="font-semibold">{formatBRL(order.totalInCents)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
