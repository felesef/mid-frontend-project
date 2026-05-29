import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "cart";

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(event, quantity) {
    if (!event || quantity < 1) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.eventId === event.id);

      if (existing) {
        const nextQuantity = Math.min(
          existing.quantity + quantity,
          event.ticketsAvailable,
        );
        return prev.map((item) =>
          item.eventId === event.id
            ? { ...item, quantity: nextQuantity }
            : item,
        );
      }

      return [
        ...prev,
        {
          eventId: event.id,
          name: event.name,
          price: event.price,
          date: event.date,
          quantity: Math.min(quantity, event.ticketsAvailable),
        },
      ];
    });
  }

  function updateQuantity(eventId, quantity) {
    if (quantity <= 0) {
      removeItem(eventId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.eventId === eventId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeItem(eventId) {
    setItems((prev) => prev.filter((item) => item.eventId !== eventId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
