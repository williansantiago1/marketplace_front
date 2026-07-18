import { Link, NavLink, Outlet } from "react-router-dom";

export function AdminShell() {
  return (
    <div className="min-h-screen bg-sand">
      <div className="border-b border-cream bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-2xl text-petrol">Admin</h1>
          <nav className="flex gap-4 text-sm font-medium">
            <NavLink
              to="/admin/categorias"
              className={({ isActive }) =>
                isActive ? "text-coral" : "text-ink hover:text-petrol"
              }
            >
              Categorias
            </NavLink>
            <Link to="/" className="text-muted hover:text-petrol">
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
