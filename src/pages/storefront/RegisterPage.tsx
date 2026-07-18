import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getErrorMessage, useAuth } from "../../hooks/useAuth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    document.title = "Cadastrar · Vitrine";
  }, []);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="font-display text-4xl">Criar conta</h1>
        <p className="mt-1 text-sm text-muted">
          Uma conta serve para comprar e, quando quiser, vender.
        </p>
      </div>
      <form
        className="space-y-4 rounded-[var(--radius-md)] bg-white p-6"
        onSubmit={handleSubmit(async (data) => {
          try {
            await registerUser({ ...data, role: "CUSTOMER" });
            navigate("/entrar");
          } catch (e) {
            toast.error(getErrorMessage(e));
          }
        })}
      >
        <Input label="Nome" error={errors.name?.message} {...register("name")} />
        <Input label="E-mail" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Senha"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Cadastrar
        </Button>
      </form>
      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link to="/entrar" className="font-semibold text-petrol">
          Entrar
        </Link>
      </p>
    </div>
  );
}
