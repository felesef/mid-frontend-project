import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "../../utils/authFormValidation.js";
import styles from "../AuthForm/AuthForm.module.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setFieldErrors(errors);

    if (errors.email || errors.password || errors.confirmPassword) {
      return;
    }

    setSubmitting(true);
    try {
      await register(email.trim(), password);
      setFormSuccess("Account created. Redirecting…");
      navigate("/events");
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Register</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}
        {formSuccess && (
          <p className={styles.formSuccess} role="status">
            {formSuccess}
          </p>
        )}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            className={styles.input}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className={styles.fieldError}>{fieldErrors.email}</p>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            type="password"
            className={styles.input}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className={styles.fieldError}>{fieldErrors.password}</p>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Confirm password</span>
          <input
            type="password"
            className={styles.input}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {fieldErrors.confirmPassword && (
            <p className={styles.fieldError}>{fieldErrors.confirmPassword}</p>
          )}
        </label>

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
