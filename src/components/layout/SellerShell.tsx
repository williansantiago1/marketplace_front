import { Link, NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? "text-coral" : "text-ink hover:text-petrol"}`;

export function SellerShell() {
  return (
    <div className="min-h-screen bg-sand">
      <div className="border-b border-cream bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Painel</p>
            <h1 className="font-display text-2xl text-petrol">Vendedor</h1>
          </div>
          <nav className="flex flex-wrap gap-4">
            <NavLink to="/vendedor" end className={linkClass}>
              Início
            </NavLink>
            <NavLink to="/vendedor/lojas" className={linkClass}>
              Lojas
            </NavLink>
            <NavLink to="/vendedor/produtos" className={linkClass}>
              Produtos
            </NavLink>
            <NavLink to="/vendedor/cupons" className={linkClass}>
              Cupons
            </NavLink>
            <NavLink to="/vendedor/pedidos" className={linkClass}>
              Pedidos
            </NavLink>
            <Link to="/" className="text-sm font-medium text-muted hover:text-petrol">
              Voltar à Vitrine
            </Link>
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
