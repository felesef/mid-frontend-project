export function buildOrderPayload(cartItems) {
  const items = cartItems.map(({ eventId, name, price, quantity }) => ({
    eventId,
    name,
    price,
    quantity,
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    items,
    total,
    status: "confirmed",
  };
}
