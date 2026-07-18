import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { categoriesApi } from "../../api/categories";
import { productsApi } from "../../api/products";
import { ProductCard } from "../../components/ProductCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Produtos · Vitrine";
  }, []);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const products = useQuery({
    queryKey: ["products", { search, categoryId, page }],
    queryFn: () =>
      productsApi.list({
        page,
        limit: 12,
        search: search || undefined,
        categoryId: categoryId || undefined,
      }),
  });

  const totalPages = products.data
    ? Math.max(1, Math.ceil(products.data.total / products.data.limit))
    : 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-ink">Produtos</h1>
        <p className="mt-1 text-muted">Explore o que as lojas estão oferecendo</p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Select
          value={categoryId}
          onChange={(e) => {
            setPage(1);
            setCategoryId(e.target.value);
          }}
        >
          <option value="">Todas as categorias</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {products.isLoading ? (
        <Spinner />
      ) : !products.data?.items.length ? (
        <EmptyState
          title="Nada por aqui"
          description="Tente outro termo ou categoria."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
