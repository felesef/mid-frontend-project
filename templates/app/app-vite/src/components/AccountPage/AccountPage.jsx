import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Account</h1>

      <section className={styles.card}>
        <p className={styles.label}>Signed in as</p>
        <p className={styles.email}>{user.email}</p>
      </section>

      <nav className={styles.links} aria-label="Account navigation">
        <Link to="/orders" className={styles.link}>
          View your orders
        </Link>
        <Link to="/cart" className={styles.link}>
          View cart
        </Link>
      </nav>

      <button type="button" className={styles.signOut} onClick={logout}>
        Sign out
      </button>
    </div>
  );
}
