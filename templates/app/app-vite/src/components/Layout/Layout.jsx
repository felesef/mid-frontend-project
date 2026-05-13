import { Link, Outlet } from "react-router-dom";
import hyfLogo from "../../assets/hyf.svg";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Layout.module.css";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <header>
        <nav
          style={{
            width: "100%",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 20px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://www.hackyourfuture.dk/"
            target="_blank"
            className="link"
          >
            <img
              src={hyfLogo}
              alt="HackYourFuture logo"
              className="logo"
              width={200}
              style={{ padding: "20px" }}
            />
          </a>
          {/* Navigation links go here — e.g. link to event list, cart, login */}
          <Link to="/events" className="link">
            Events
          </Link>
          <Link to="/events/detail" className="link">
            Sample event
          </Link>

          {user && (
            <>
              <span>{user.email}</span>
              <button onClick={logout}>Sign out</button>
            </>
          )}

          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Footer content goes here */}
      <footer className={styles.footer}>
        <p style={{ margin: 0 }}>
          Event app layout — header, main, and footer ready for cart, auth, and
          more navigation later.
        </p>
      </footer>
    </div>
  );
}
