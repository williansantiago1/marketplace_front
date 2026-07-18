import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getErrorMessage, useAuth } from "../../hooks/useAuth";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    document.title = "Entrar · Vitrine";
  }, []);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="font-display text-4xl">Entrar</h1>
        <p className="mt-1 text-sm text-muted">
          Use as contas do seed ou a sua.
        </p>
      </div>
      <form
        className="space-y-4 rounded-[var(--radius-md)] bg-white p-6"
        onSubmit={handleSubmit(async (data) => {
          try {
            await login(data.email, data.password);
            navigate("/");
          } catch (e) {
            toast.error(getErrorMessage(e));
          }
        })}
      >
        <Input label="E-mail" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Senha"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Entrar
        </Button>
      </form>
      <p className="text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link to="/cadastrar" className="font-semibold text-petrol">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
