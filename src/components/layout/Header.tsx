import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { Button } from "../ui/Button";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${isActive ? "text-coral" : "text-ink hover:text-petrol"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-cream/80 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-petrol">
          Vitrine
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/produtos" className={linkClass}>
            Produtos
          </NavLink>
          <NavLink to="/carrinho" className={linkClass}>
            Carrinho
            {isAuthenticated && itemCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] text-white transition">
                {itemCount}
              </span>
            )}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/pedidos" className={linkClass}>
              Pedidos
            </NavLink>
          )}
          {(user?.role === "SELLER" || user?.role === "ADMIN") && (
            <NavLink to="/vendedor" className={linkClass}>
              Painel
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin/categorias" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/entrar">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/cadastrar">
                <Button>Cadastrar</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-muted">{user?.name}</span>
              <Button variant="ghost" onClick={() => void logout()}>
                Sair
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-cream px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/produtos" onClick={() => setOpen(false)}>
              Produtos
            </Link>
            <Link to="/carrinho" onClick={() => setOpen(false)}>
              Carrinho ({itemCount})
            </Link>
            {isAuthenticated && (
              <Link to="/pedidos" onClick={() => setOpen(false)}>
                Pedidos
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link to="/entrar" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
                <Link to="/cadastrar" onClick={() => setOpen(false)}>
                  Cadastrar
                </Link>
              </>
            ) : (
              <button type="button" onClick={() => void logout()}>
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
