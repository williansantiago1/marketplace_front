import { useEffect } from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "/vendedor/lojas", title: "Lojas", desc: "Crie e edite suas bancas" },
  { to: "/vendedor/produtos", title: "Produtos", desc: "Cadastre o que vende" },
  { to: "/vendedor/cupons", title: "Cupons", desc: "Promoções da loja" },
  { to: "/vendedor/pedidos", title: "Pedidos", desc: "Acompanhe as vendas" },
];

export function SellerHomePage() {
  useEffect(() => {
    document.title = "Painel · Vitrine";
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl">Gerencie sua presença na Vitrine</h2>
        <p className="mt-1 text-muted">Sem dashboard inchado — só o que importa.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-[var(--radius-md)] bg-white p-5 transition hover:bg-cream/50"
          >
            <h3 className="font-display text-xl text-petrol">{link.title}</h3>
            <p className="mt-1 text-sm text-muted">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
