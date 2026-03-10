export function generateHashtags(product: string) {
  return [
    "#shopping",
    "#shoplocal",
    "#bestdeal",
    `#${product.replace(" ", "")}`
  ];
}
