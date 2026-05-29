import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./OrderDetailPage.module.css";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadOrder() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setOrder(null);

      try {
        const response = await fetch(api(`/orders/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(`Could not load order (${response.status})`);
        }

        const data = await response.json();
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load order",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.status} role="status">
          Loading order…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.errorBox} role="alert">
          {error}
        </p>
        <Link to="/orders">Back to orders</Link>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className={styles.page}>
        <p className={styles.status} role="status">
          Order not found.
        </p>
        <Link to="/orders">Back to orders</Link>
      </div>
    );
  }

  const lineItems = Array.isArray(order.items) ? order.items : [];

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link to="/orders">← All orders</Link>
      </p>

      <h1 className={styles.heading}>Order #{order.id}</h1>
      <p className={styles.meta}>Status: {order.status ?? "pending"}</p>

      <section className={styles.items} aria-label="Order items">
        <h2 className={styles.itemsHeading}>Tickets</h2>
        {lineItems.length === 0 ? (
          <p className={styles.meta}>No line items recorded.</p>
        ) : (
          <ul className={styles.list}>
            {lineItems.map((item) => (
              <li key={item.eventId} className={styles.item}>
                <span className={styles.itemName}>
                  {item.name}
                  {item.eventId != null && (
                    <>
                      {" "}
                      <Link to={`/events/${item.eventId}`}>(event)</Link>
                    </>
                  )}
                </span>
                <span className={styles.itemQty}>× {item.quantity}</span>
                <span className={styles.itemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.total}>
          Total: {formatPrice(order.total ?? 0)}
        </p>
      </section>
    </div>
  );
}
