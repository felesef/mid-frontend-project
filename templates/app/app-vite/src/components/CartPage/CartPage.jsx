import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Cart</h1>
        <p className={styles.empty} role="status">
          Your cart is empty. Browse events and add tickets.
        </p>
        <p style={{ marginTop: "1rem" }}>
          <Link to="/events">Browse events</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Cart</h1>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.eventId} className={styles.item}>
            <div className={styles.itemHeader}>
              <h2 className={styles.itemName}>
                <Link to={`/events/${item.eventId}`}>{item.name}</Link>
              </h2>
              <p className={styles.itemPrice}>
                {formatPrice(item.price)} each
              </p>
            </div>
            <p className={styles.itemMeta}>{item.date}</p>

            <div className={styles.row}>
              <button
                type="button"
                className={styles.quantityBtn}
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
                onClick={() => updateQuantity(item.eventId, item.quantity - 1)}
              >
                −
              </button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button
                type="button"
                className={styles.quantityBtn}
                aria-label="Increase quantity"
                onClick={() => updateQuantity(item.eventId, item.quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeItem(item.eventId)}
              >
                Remove
              </button>
            </div>

            <p className={styles.itemPrice} style={{ marginTop: "0.5rem" }}>
              Line total: {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <section className={styles.summary} aria-label="Cart summary">
        <p className={styles.total}>
          {totalItems} ticket{totalItems === 1 ? "" : "s"} — Total:{" "}
          {formatPrice(totalPrice)}
        </p>
        <div className={styles.actions}>
          <Link to="/checkout" className={styles.primaryBtn}>
            Go to checkout
          </Link>
          <Link to="/events" className={styles.secondaryBtn}>
            Continue shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
