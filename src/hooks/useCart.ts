import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api/cart";
import { useAuth } from "./useAuth";

export function useCart() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.get(),
    enabled: isAuthenticated,
  });

  const itemCount =
    query.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return { ...query, itemCount };
}
