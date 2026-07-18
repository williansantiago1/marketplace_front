import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cartApi } from "../../api/cart";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage } from "../../hooks/useAuth";
import { formatBRL } from "../../lib/money";

export function CartPage() {
  const qc = useQueryClient();
  useEffect(() => {
    document.title = "Carrinho · Vitrine";
  }, []);

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.get(),
  });

  const update = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateItem(id, quantity),
    onSuccess: () => {
      toast.success("Carrinho atualizado");
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => cartApi.removeItem(id),
    onSuccess: () => {
      toast.success("Carrinho atualizado");
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (cart.isLoading) return <Spinner />;
  const items = cart.data?.items ?? [];
  if (!items.length) {
    return (
      <EmptyState
        title="Carrinho vazio"
        description="Escolha algo gostoso na Vitrine."
        actionLabel="Ver produtos"
        actionTo="/produtos"
      />
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceInCents * item.quantity,
    0,
  );

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">Carrinho</h1>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-3 rounded-[var(--radius-md)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted">
                {formatBRL(item.product.priceInCents)} cada
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-8 w-8 rounded border border-cream"
                onClick={() =>
                  update.mutate({
                    id: item.id,
                    quantity: Math.max(1, item.quantity - 1),
                  })
                }
              >
                -
              </button>
              <span className="tabular-nums">{item.quantity}</span>
              <button
                type="button"
                className="h-8 w-8 rounded border border-cream"
                onClick={() =>
                  update.mutate({ id: item.id, quantity: item.quantity + 1 })
                }
              >
                +
              </button>
              <Button variant="ghost" onClick={() => remove.mutate(item.id)}>
                Remover
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream pt-6">
        <p className="text-lg font-semibold">
          Subtotal: {formatBRL(subtotal)}
        </p>
        <Link to="/checkout">
          <Button>Finalizar</Button>
        </Link>
      </div>
    </div>
  );
}
