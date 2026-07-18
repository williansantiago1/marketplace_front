import type { Product } from "../types/catalog";

const palette = ["#0B3D3A", "#E85D4C", "#2F5D50", "#C45C26", "#3D5A80"];

export function getProductImage(product: Product) {
  const idx =
    product.name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    palette.length;
  return {
    color: palette[idx],
    initials: product.name.slice(0, 2).toUpperCase(),
  };
}
