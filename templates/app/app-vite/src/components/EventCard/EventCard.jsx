import styles from "./EventCard.module.css";

export default function EventCard() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>React Copenhagen Conference 2026</h2>
      <p className={styles.meta}>2026-04-15 at 09:00</p>
      <p className={styles.meta}>Copenhagen Concert Hall, Copenhagen</p>
      <p className={styles.meta}>€149</p>
      <p className={styles.meta}>Sold out</p>
      <span className={styles.badge}>Conference</span>
    </article>
  );
}
