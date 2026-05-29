import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();

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

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Checkout</h1>
      <p className={`${styles.message} ${styles.info}`}>
        Signed in as <strong>{user.email}</strong>. Cart total:{" "}
        {formatPrice(totalPrice)} ({items.length} event
        {items.length === 1 ? "" : "s"}).
      </p>
      <p className={`${styles.message} ${styles.info}`}>
        Placing orders is coming in Week 5. For now, review your cart on the{" "}
        <Link to="/cart">cart page</Link>.
      </p>
    </div>
  );
}
