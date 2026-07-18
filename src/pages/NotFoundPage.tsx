import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sand px-4 text-center">
      <h1 className="font-display text-4xl text-petrol">Página não encontrada</h1>
      <Link to="/">
        <Button>Voltar à Vitrine</Button>
      </Link>
    </div>
  );
}
