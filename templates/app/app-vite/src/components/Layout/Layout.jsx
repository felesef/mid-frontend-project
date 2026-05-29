import { Link, Outlet } from "react-router-dom";
import hyfLogo from "../../assets/hyf.svg";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import styles from "./Layout.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className={styles.shell}>
      <header>
        <nav className={styles.nav}>
          <a
            href="https://www.hackyourfuture.dk/"
            target="_blank"
            className="link"
            rel="noreferrer"
          >
            <img
              src={hyfLogo}
              alt="HackYourFuture logo"
              className="logo"
              width={200}
              style={{ padding: "20px" }}
            />
          </a>
          <Link to="/events" className="link">
            Events
          </Link>
          <Link to="/cart" className="link">
            Cart{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>

          {user ? (
            <>
              <Link to="/account" className="link">
                Account
              </Link>
              <Link to="/orders" className="link">
                Orders
              </Link>
              <button type="button" onClick={logout} className={styles.navBtn}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">
                Login
              </Link>
              <Link to="/register" className="link">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p style={{ margin: 0 }}>HackYourFuture events app</p>
      </footer>
    </div>
  );
}
