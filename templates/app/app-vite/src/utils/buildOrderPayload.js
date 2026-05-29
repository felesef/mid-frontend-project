export function buildOrderPayload(cartItems, userId) {
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
    userId,
    items,
    total,
    status: "confirmed",
  };
}
