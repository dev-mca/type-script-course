// Kompilieren: npx tsc -p lektionen/l01-erste-schritte/kompilieren
// Danach out/demo.js öffnen und mit dieser Datei vergleichen.

interface Product {
  name: string;
  priceInRappen: number;
}

enum Category {
  Haircut,
  Beard,
  Care,
}

function formatPrice(product: Product): string {
  const francs = product.priceInRappen / 100;
  return `${product.name}: CHF ${francs.toFixed(2)}`;
}

const cut: Product = { name: "Haarschnitt", priceInRappen: 4500 };
const category: Category = Category.Haircut;

console.log(formatPrice(cut), Category[category]);
