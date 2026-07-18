import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { storesApi } from "../../api/stores";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { TextArea } from "../../components/ui/TextArea";
import { getErrorMessage } from "../../hooks/useAuth";

export function SellerStoresPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    document.title = "Lojas · Painel";
  }, []);

  const stores = useQuery({
    queryKey: ["my-stores"],
    queryFn: () => storesApi.listMine(),
  });

  const create = useMutation({
    mutationFn: () => storesApi.create({ name, slug, description: description || undefined }),
    onSuccess: () => {
      toast.success("Loja criada");
      setName("");
      setSlug("");
      setDescription("");
      void qc.invalidateQueries({ queryKey: ["my-stores"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) =>
      storesApi.update(id, { description }),
    onSuccess: () => {
      toast.success("Loja atualizada");
      void qc.invalidateQueries({ queryKey: ["my-stores"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (stores.isLoading) return <Spinner />;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="font-display text-3xl">Minhas lojas</h2>
        {!stores.data?.length ? (
          <EmptyState title="Nenhuma loja ainda" description="Crie a primeira ao lado." />
        ) : (
          <ul className="space-y-3">
            {stores.data.map((store) => (
              <li key={store.id} className="rounded-[var(--radius-md)] bg-white p-4">
                <p className="font-semibold">{store.name}</p>
                <p className="text-sm text-muted">/{store.slug}</p>
                <TextArea
                  className="mt-3"
                  defaultValue={store.description ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (store.description ?? "")) {
                      update.mutate({ id: store.id, description: e.target.value });
                    }
                  }}
                />
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
        <h3 className="font-display text-2xl">Nova loja</h3>
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="minha-loja"
          required
        />
        <TextArea
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" disabled={create.isPending}>
          Criar loja
        </Button>
      </form>
    </div>
  );
}
