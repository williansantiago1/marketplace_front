import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cartApi } from "../../api/cart";
import { couponsApi } from "../../api/coupons";
import { ordersApi } from "../../api/orders";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage } from "../../hooks/useAuth";
import { formatBRL } from "../../lib/money";

export function CheckoutPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    document.title = "Checkout · Vitrine";
  }, []);

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.get(),
  });

  const items = cart.data?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceInCents * item.quantity,
    0,
  );

  const validate = useMutation({
    mutationFn: () =>
      couponsApi.validate({ code: couponCode, subtotalInCents: subtotal }),
    onSuccess: (data) => {
      setDiscount(data.discountInCents);
      toast.success("Cupom aplicado");
    },
    onError: (e) => {
      setDiscount(0);
      toast.error(getErrorMessage(e));
    },
  });

  const checkout = useMutation({
    mutationFn: () =>
      ordersApi.checkout(couponCode ? { couponCode } : {}),
    onSuccess: (orders) => {
      toast.success("Pedido realizado");
      void qc.invalidateQueries({ queryKey: ["cart"] });
      void qc.invalidateQueries({ queryKey: ["orders"] });
      if (orders.length === 1) navigate(`/pedidos/${orders[0].id}`);
      else navigate("/pedidos");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (cart.isLoading) return <Spinner />;
  if (!items.length) {
    return (
      <EmptyState
        title="Nada para finalizar"
        actionLabel="Ver produtos"
        actionTo="/produtos"
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h1 className="font-display text-4xl">Checkout</h1>
      <ul className="space-y-2 rounded-[var(--radius-md)] bg-white p-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span className="tabular-nums">
              {formatBRL(item.product.priceInCents * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Input
          placeholder="Cupom"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
        <Button
          variant="secondary"
          onClick={() => validate.mutate()}
          disabled={!couponCode || validate.isPending}
        >
          Validar
        </Button>
      </div>

      <div className="space-y-1 text-sm">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </p>
        <p className="flex justify-between text-muted">
          <span>Desconto</span>
          <span>- {formatBRL(discount)}</span>
        </p>
        <p className="flex justify-between text-lg font-semibold">
          <span>Total estimado</span>
          <span>{formatBRL(Math.max(0, subtotal - discount))}</span>
        </p>
      </div>

      <Button
        className="w-full"
        onClick={() => checkout.mutate()}
        disabled={checkout.isPending}
      >
        Confirmar pedido
      </Button>
    </div>
  );
}
