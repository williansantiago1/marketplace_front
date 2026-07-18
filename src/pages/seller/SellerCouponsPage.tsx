import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { couponsApi } from "../../api/coupons";
import { storesApi } from "../../api/stores";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage } from "../../hooks/useAuth";

export function SellerCouponsPage() {
  const qc = useQueryClient();
  const [storeId, setStoreId] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState(50);

  useEffect(() => {
    document.title = "Cupons · Painel";
  }, []);

  const stores = useQuery({
    queryKey: ["my-stores"],
    queryFn: () => storesApi.listMine(),
  });

  useEffect(() => {
    if (!storeId && stores.data?.[0]) setStoreId(stores.data[0].id);
  }, [stores.data, storeId]);

  const coupons = useQuery({
    queryKey: ["coupons", storeId],
    queryFn: () => couponsApi.listByStore(storeId),
    enabled: Boolean(storeId),
  });

  const create = useMutation({
    mutationFn: () =>
      couponsApi.create({
        code,
        type,
        value,
        storeId,
        maxUses,
      }),
    onSuccess: () => {
      toast.success("Cupom criado");
      setCode("");
      void qc.invalidateQueries({ queryKey: ["coupons", storeId] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (stores.isLoading) return <Spinner />;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="font-display text-3xl">Cupons</h2>
        <Select label="Loja" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
          {stores.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        {coupons.isLoading ? (
          <Spinner />
        ) : !coupons.data?.length ? (
          <EmptyState title="Nenhum cupom" />
        ) : (
          <ul className="space-y-2">
            {coupons.data.map((c) => (
              <li key={c.id} className="rounded-[var(--radius-md)] bg-white p-3">
                <p className="font-semibold">{c.code}</p>
                <p className="text-sm text-muted">
                  {c.type} · {c.value} · usos {c.usedCount}/{c.maxUses ?? "∞"}
                </p>
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
        <h3 className="font-display text-2xl">Novo cupom</h3>
        <Input label="Código" value={code} onChange={(e) => setCode(e.target.value)} required />
        <Select
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value as "PERCENT" | "FIXED")}
        >
          <option value="PERCENT">Percentual</option>
          <option value="FIXED">Valor fixo (centavos)</option>
        </Select>
        <Input
          label="Valor"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <Input
          label="Máx. usos"
          type="number"
          value={maxUses}
          onChange={(e) => setMaxUses(Number(e.target.value))}
        />
        <Button type="submit" disabled={create.isPending}>
          Criar cupom
        </Button>
      </form>
    </div>
  );
}
