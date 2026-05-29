import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./OrdersPage.module.css";

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(api("/orders"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Could not load orders (${response.status})`);
        }

        const data = await response.json();
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load orders",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Your orders</h1>

      {loading && (
        <p className={styles.status} role="status">
          Loading orders…
        </p>
      )}

      {!loading && error && (
        <p className={styles.errorBox} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className={styles.empty} role="status">
          You have no orders yet. Checkout will be available in Week 5.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id} className={styles.item}>
              <h2 className={styles.itemTitle}>Order #{order.id}</h2>
              <p className={styles.itemMeta}>
                Status: {order.status ?? "pending"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: "1rem" }}>
        <Link to="/account">Back to account</Link>
      </p>
    </div>
  );
}
