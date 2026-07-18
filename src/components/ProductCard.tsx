import { Link } from "react-router-dom";
import { formatBRL } from "../lib/money";
import { getProductImage } from "../lib/productImage";
import type { Product } from "../types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);

  return (
    <Link
      to={`/produtos/${product.id}`}
      className="group block overflow-hidden rounded-[var(--radius-md)] bg-white transition hover:-translate-y-0.5"
    >
      <div
        className="flex h-44 items-center justify-center text-3xl font-display font-semibold text-white/90"
        style={{ background: image.color }}
      >
        {image.initials}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-medium text-ink group-hover:text-petrol">{product.name}</h3>
        <p className="text-sm text-muted line-clamp-2">
          {product.description ?? "Produto na Vitrine"}
        </p>
        <p className="pt-1 text-base font-semibold tabular-nums text-petrol">
          {formatBRL(product.priceInCents)}
        </p>
      </div>
    </Link>
  );
}
