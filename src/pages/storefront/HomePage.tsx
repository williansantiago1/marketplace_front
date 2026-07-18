import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { productsApi } from "../../api/products";
import { ProductCard } from "../../components/ProductCard";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { getErrorMessage, useAuth } from "../../hooks/useAuth";

export function HomePage() {
  const { user, isAuthenticated, becomeSeller } = useAuth();
  const navigate = useNavigate();
  const [startingSell, setStartingSell] = useState(false);
  const canSell = user?.role === "SELLER" || user?.role === "ADMIN";

  useEffect(() => {
    document.title = "Vitrine";
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => productsApi.list({ limit: 8 }),
  });

  async function handleWantToSell() {
    if (!isAuthenticated) {
      navigate("/cadastrar");
      return;
    }
    if (canSell) {
      navigate("/vendedor");
      return;
    }
    try {
      setStartingSell(true);
      await becomeSeller();
      navigate("/vendedor");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setStartingSell(false);
    }
  }

  return (
    <div className="space-y-14">
      <section className="relative -mx-4 overflow-hidden bg-petrol px-4 py-20 text-sand md:mx-0 md:rounded-[var(--radius-md)] md:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #e85d4c 0%, transparent 40%), radial-gradient(circle at 80% 60%, #efe8dc 0%, transparent 35%)",
          }}
        />
        <div className="relative max-w-xl space-y-5">
          <p className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Vitrine
          </p>
          <h1 className="font-display text-3xl leading-tight md:text-4xl">
            O que é bom encontra quem procura.
          </h1>
          <p className="text-base text-sand/85">
            Um marketplace simples: lojas reais, preços claros e checkout sem drama.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/produtos">
              <Button className="bg-coral hover:bg-[#d44f3f]">Ver produtos</Button>
            </Link>
            {canSell ? (
              <Link to="/vendedor">
                <Button
                  variant="ghost"
                  className="border border-sand/30 text-sand hover:bg-white/10"
                >
                  Ir ao painel
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                className="border border-sand/30 text-sand hover:bg-white/10"
                disabled={startingSell}
                onClick={() => void handleWantToSell()}
              >
                {startingSell ? "Abrindo..." : "Quero vender"}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-ink">Em destaque</h2>
            <p className="text-sm text-muted">Seleção fresca das bancas</p>
          </div>
          <Link to="/produtos" className="text-sm font-semibold text-petrol">
            Ver tudo
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data?.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
