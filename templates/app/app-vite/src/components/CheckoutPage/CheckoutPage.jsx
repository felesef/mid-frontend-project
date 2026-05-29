import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { buildOrderPayload } from "../../utils/buildOrderPayload.js";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  if (!user) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Checkout</h1>
        <p className={`${styles.message} ${styles.warning}`} role="alert">
          You must be logged in to checkout.{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>{" "}
          or{" "}
          <Link to="/register" className={styles.link}>
            create an account
          </Link>
          .
        </p>
      </div>
    );
  }

  if (placedOrderId) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Checkout</h1>
        <p className={`${styles.message} ${styles.success}`} role="status">
          Order #{placedOrderId} placed successfully. Your cart has been
          cleared.
        </p>
        <p>
          <Link to={`/orders/${placedOrderId}`}>View order</Link>
          {" · "}
          <Link to="/orders">All orders</Link>
          {" · "}
          <Link to="/events">Browse events</Link>
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Checkout</h1>
        <p className={`${styles.message} ${styles.info}`} role="status">
          Your cart is empty. <Link to="/events">Browse events</Link> to add
          tickets.
        </p>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(api("/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildOrderPayload(items, user.id)),
      });

      if (!response.ok) {
        throw new Error(`Could not place order (${response.status})`);
      }

      const order = await response.json();
      clearCart();
      setPlacedOrderId(order.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not place order",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Checkout</h1>

      <p className={`${styles.message} ${styles.info}`}>
        Signed in as <strong>{user.email}</strong>.
      </p>

      <section className={styles.summary} aria-label="Order summary">
        <h2 className={styles.summaryHeading}>Order summary</h2>
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.eventId} className={styles.summaryItem}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className={styles.total}>Total: {formatPrice(totalPrice)}</p>
      </section>

      {error && (
        <p className={`${styles.message} ${styles.error}`} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryBtn}
          disabled={submitting}
          onClick={handlePlaceOrder}
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
        <Link to="/cart" className={styles.secondaryLink}>
          Back to cart
        </Link>
      </div>
    </div>
  );
}
