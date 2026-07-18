export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function reaisToCents(reais: number) {
  return Math.round(reais * 100);
}
