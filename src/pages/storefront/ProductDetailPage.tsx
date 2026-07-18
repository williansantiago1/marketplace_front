import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { cartApi } from "../../api/cart";
import { ordersApi } from "../../api/orders";
import { productsApi } from "../../api/products";
import { reviewsApi } from "../../api/reviews";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Spinner";
import { TextArea } from "../../components/ui/TextArea";
import { getErrorMessage, useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/cn";
import { formatBRL } from "../../lib/money";
import { getProductImage } from "../../lib/productImage";

export function ProductDetailPage() {
  const { id = "" } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [orderId, setOrderId] = useState("");

  const product = useQuery({
    queryKey: ["product", id],
    queryFn: async () => productsApi.getById(id),
    enabled: Boolean(id),
  });

  const reviews = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => reviewsApi.listByProduct(id),
    enabled: Boolean(id),
  });

  const myOrders = useQuery({
    queryKey: ["orders", "for-review", id],
    queryFn: async () => ordersApi.listMine(),
    enabled: isAuthenticated && Boolean(id),
  });

  const reviewableOrders = useMemo(() => {
    if (!myOrders.data) return [];
    return myOrders.data.filter(
      (order) =>
        order.status === "DELIVERED" &&
        order.items.some((item) => item.productId === id),
    );
  }, [myOrders.data, id]);

  useEffect(() => {
    if (reviewableOrders.length === 1) {
      setOrderId(reviewableOrders[0].id);
    }
  }, [reviewableOrders]);

  useEffect(() => {
    if (product.data) document.title = `${product.data.name} · Vitrine`;
  }, [product.data]);

  const addCart = useMutation({
    mutationFn: async () => cartApi.addItem(id, qty),
    onSuccess: () => {
      toast.success("Adicionado ao carrinho");
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const createReview = useMutation({
    mutationFn: async () =>
      reviewsApi.create({
        productId: id,
        orderId,
        rating,
        comment: comment || undefined,
      }),
    onSuccess: () => {
      toast.success("Avaliação enviada");
      setComment("");
      void qc.invalidateQueries({ queryKey: ["reviews", id] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (product.isLoading) return <Spinner />;
  if (!product.data) {
    return <p className="text-muted">Produto não encontrado.</p>;
  }

  const p = product.data;
  const image = getProductImage(p);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div
        className="flex min-h-80 items-center justify-center rounded-[var(--radius-md)] text-6xl font-display text-white/90"
        style={{ background: image.color }}
      >
        {image.initials}
      </div>

      <div className="space-y-5">
        <div>
          <h1 className="font-display text-4xl text-ink">{p.name}</h1>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-petrol">
            {formatBRL(p.priceInCents)}
          </p>
          <p className="mt-1 text-sm text-muted">{p.stock} em estoque</p>
        </div>
        <p className="text-muted">{p.description ?? "Sem descrição."}</p>
        {p.store && (
          <Link
            to={`/lojas/${p.store.slug}`}
            className="text-sm font-semibold text-petrol underline-offset-2 hover:underline"
          >
            Ver loja {p.store.name}
          </Link>
        )}

        <div className="flex items-end gap-3">
          <Input
            label="Quantidade"
            type="number"
            min={1}
            max={p.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-28"
          />
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/entrar");
                return;
              }
              addCart.mutate();
            }}
            disabled={addCart.isPending || p.stock < 1}
          >
            Adicionar ao carrinho
          </Button>
        </div>

        <section className="space-y-4 border-t border-cream pt-6">
          <h2 className="font-display text-2xl">Avaliações</h2>
          {reviews.data?.length ? (
            <ul className="space-y-3">
              {reviews.data.map((r) => (
                <li key={r.id} className="rounded-[var(--radius-md)] bg-white p-4">
                  <p className="text-sm font-semibold">
                    {r.user?.name ?? "Cliente"} · {r.rating}/5
                  </p>
                  {r.comment && <p className="mt-1 text-sm text-muted">{r.comment}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Ainda sem avaliações.</p>
          )}

          {isAuthenticated && (
            <form
              className="space-y-4 rounded-[var(--radius-md)] bg-cream/50 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!orderId) {
                  toast.error("Selecione um pedido entregue");
                  return;
                }
                createReview.mutate();
              }}
            >
              <p className="text-sm font-medium">Avaliar compra</p>

              {myOrders.isLoading ? (
                <Spinner />
              ) : reviewableOrders.length === 0 ? (
                <p className="text-sm text-muted">
                  Você só pode avaliar depois que o pedido deste produto for
                  marcado como entregue.
                </p>
              ) : (
                <>
                  <Select
                    label="Pedido"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  >
                    <option value="">Selecione o pedido</option>
                    {reviewableOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                        {formatBRL(order.totalInCents)}
                      </option>
                    ))}
                  </Select>

                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-ink">Nota</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-sm font-semibold transition",
                            rating === value
                              ? "bg-petrol text-white"
                              : "bg-white text-ink hover:bg-cream",
                          )}
                          aria-label={`Nota ${value}`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TextArea
                    label="Comentário"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="O que achou do produto?"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={createReview.isPending || !orderId}
                  >
                    Enviar avaliação
                  </Button>
                </>
              )}
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
