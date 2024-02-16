import { Decimal } from "@prisma/client/runtime/library";

export function _calculateCart(
  items: {
    quantity: number;
    unitPrice: Decimal;
    variantId: string;
  }[],
) {
  let total = new Decimal(0);
  const mappedItems = items.map(({ unitPrice, quantity, variantId }) => {
    const subtotal = unitPrice.mul(quantity);
    total = total.add(subtotal);

    return {
      subtotal,
      quantity,
      variantId,
    };
  });

  return {
    subtotal: total,
    cartItems: mappedItems,
  };
}
