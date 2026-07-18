import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ordersApi } from "../../api/orders";
import { paymentsApi } from "../../api/payments";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage } from "../../hooks/useAuth";
import { formatBRL } from "../../lib/money";

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pedidos/${orderId}`,
      },
      redirect: "if_required",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Falha no pagamento");
      return;
    }
    toast.success("Pagamento enviado");
    navigate(`/pedidos/${orderId}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        Pagar agora
      </Button>
    </form>
  );
}

export function PaymentPage() {
  const { id = "" } = useParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const order = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    document.title = "Pagamento · Vitrine";
  }, []);

  useEffect(() => {
    if (!order.data || order.data.status !== "PENDING_PAYMENT") return;
    let cancelled = false;
    paymentsApi
      .create(id)
      .then((payment) => {
        if (!cancelled) setClientSecret(payment.clientSecret);
      })
      .catch((e) => {
        if (!cancelled) setPayError(getErrorMessage(e));
      });
    return () => {
      cancelled = true;
    };
  }, [order.data, id]);

  const stripePromise = useMemo(
    () => (pk && !pk.includes("replace") ? loadStripe(pk) : null),
    [],
  );

  if (order.isLoading) return <Spinner />;
  if (!order.data) return <p className="text-muted">Pedido não encontrado.</p>;
  if (order.data.status !== "PENDING_PAYMENT") {
    return (
      <div className="space-y-3">
        <p>Este pedido não está aguardando pagamento.</p>
        <Link to={`/pedidos/${id}`} className="text-petrol underline">
          Voltar ao pedido
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-4xl">Pagamento</h1>
        <p className="mt-1 text-lg font-semibold text-petrol">
          {formatBRL(order.data.totalInCents)}
        </p>
      </div>

      {payError && (
        <p className="rounded-[var(--radius-md)] bg-coral/10 p-4 text-sm text-coral">
          {payError}
          <span className="mt-2 block text-muted">
            Configure STRIPE na API e VITE_STRIPE_PUBLISHABLE_KEY no front.
          </span>
        </p>
      )}

      {!stripePromise && !payError && (
        <p className="text-sm text-muted">
          Defina VITE_STRIPE_PUBLISHABLE_KEY (pk_test) no .env do front.
        </p>
      )}

      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm orderId={id} />
        </Elements>
      )}

      {order.data.status === "PENDING_PAYMENT" && !clientSecret && !payError && (
        <Spinner />
      )}
    </div>
  );
}
