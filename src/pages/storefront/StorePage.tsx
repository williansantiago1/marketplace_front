import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { productsApi } from "../../api/products";
import { storesApi } from "../../api/stores";
import { ProductCard } from "../../components/ProductCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";

export function StorePage() {
  const { slug = "" } = useParams();

  const store = useQuery({
    queryKey: ["store", slug],
    queryFn: () => storesApi.getBySlug(slug),
    enabled: Boolean(slug),
  });

  const products = useQuery({
    queryKey: ["products", "store", store.data?.id],
    queryFn: () => productsApi.list({ storeId: store.data!.id, limit: 24 }),
    enabled: Boolean(store.data?.id),
  });

  useEffect(() => {
    if (store.data) document.title = `${store.data.name} · Vitrine`;
  }, [store.data]);

  if (store.isLoading) return <Spinner />;
  if (!store.data) return <p className="text-muted">Loja não encontrada.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-ink">{store.data.name}</h1>
        <p className="mt-2 max-w-2xl text-muted">
          {store.data.description ?? "Loja na Vitrine"}
        </p>
      </div>
      {products.isLoading ? (
        <Spinner />
      ) : !products.data?.items.length ? (
        <EmptyState title="Sem produtos nesta loja" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.data.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
