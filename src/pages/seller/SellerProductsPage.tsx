import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { categoriesApi } from "../../api/categories";
import { productsApi } from "../../api/products";
import { storesApi } from "../../api/stores";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Spinner";
import { TextArea } from "../../components/ui/TextArea";
import { getErrorMessage } from "../../hooks/useAuth";
import { formatBRL, reaisToCents } from "../../lib/money";

export function SellerProductsPage() {
  const qc = useQueryClient();
  const [storeId, setStoreId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceReais, setPriceReais] = useState("99.90");
  const [stock, setStock] = useState(10);

  useEffect(() => {
    document.title = "Produtos · Painel";
  }, []);

  const stores = useQuery({
    queryKey: ["my-stores"],
    queryFn: () => storesApi.listMine(),
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  useEffect(() => {
    if (!storeId && stores.data?.[0]) setStoreId(stores.data[0].id);
  }, [stores.data, storeId]);

  useEffect(() => {
    if (!categoryId && categories.data?.[0]) setCategoryId(categories.data[0].id);
  }, [categories.data, categoryId]);

  const products = useQuery({
    queryKey: ["seller-products", storeId],
    queryFn: () => productsApi.list({ storeId, limit: 50 }),
    enabled: Boolean(storeId),
  });

  const create = useMutation({
    mutationFn: () =>
      productsApi.create({
        storeId,
        categoryId,
        name,
        description: description || undefined,
        priceInCents: reaisToCents(Number(priceReais.replace(",", "."))),
        stock,
      }),
    onSuccess: () => {
      toast.success("Produto salvo");
      setName("");
      setDescription("");
      void qc.invalidateQueries({ queryKey: ["seller-products", storeId] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productsApi.update(id, { isActive }),
    onSuccess: () => {
      toast.success("Produto salvo");
      void qc.invalidateQueries({ queryKey: ["seller-products", storeId] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (stores.isLoading) return <Spinner />;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="font-display text-3xl">Produtos</h2>
        <Select label="Loja" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
          {stores.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        {products.isLoading ? (
          <Spinner />
        ) : !products.data?.items.length ? (
          <EmptyState title="Nenhum produto nesta loja" />
        ) : (
          <ul className="space-y-2">
            {products.data.items.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white p-3"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted">
                    {formatBRL(p.priceInCents)} · estoque {p.stock}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() =>
                    toggleActive.mutate({ id: p.id, isActive: !p.isActive })
                  }
                >
                  {p.isActive ? "Desativar" : "Ativar"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        className="space-y-3 rounded-[var(--radius-md)] bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <h3 className="font-display text-2xl">Novo produto</h3>
        <Select
          label="Categoria"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextArea
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Preço (R$)"
          value={priceReais}
          onChange={(e) => setPriceReais(e.target.value)}
          required
        />
        <Input
          label="Estoque"
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
        <Button type="submit" disabled={create.isPending || !storeId}>
          Salvar produto
        </Button>
      </form>
    </div>
  );
}
