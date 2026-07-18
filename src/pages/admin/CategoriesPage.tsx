import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { categoriesApi } from "../../api/categories";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage } from "../../hooks/useAuth";

export function CategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    document.title = "Categorias · Admin";
  }, []);

  const list = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const create = useMutation({
    mutationFn: () => categoriesApi.create({ name, slug }),
    onSuccess: () => {
      toast.success("Categoria criada");
      setName("");
      setSlug("");
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoriesApi.update(id, { name }),
    onSuccess: () => {
      toast.success("Categoria atualizada");
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (list.isLoading) return <Spinner />;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="font-display text-3xl">Categorias</h2>
        {!list.data?.length ? (
          <EmptyState title="Nenhuma categoria" />
        ) : (
          <ul className="space-y-2">
            {list.data.map((c) => (
              <li key={c.id} className="rounded-[var(--radius-md)] bg-white p-3">
                <Input
                  defaultValue={c.name}
                  onBlur={(e) => {
                    if (e.target.value !== c.name) {
                      update.mutate({ id: c.id, name: e.target.value });
                    }
                  }}
                />
                <p className="mt-1 text-xs text-muted">{c.slug}</p>
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
        <h3 className="font-display text-2xl">Nova categoria</h3>
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        <Button type="submit" disabled={create.isPending}>
          Criar
        </Button>
      </form>
    </div>
  );
}
