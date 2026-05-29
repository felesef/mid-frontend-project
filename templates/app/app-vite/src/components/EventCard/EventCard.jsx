import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./EventCard.module.css";

function formatAvailability(ticketsAvailable) {
  return ticketsAvailable === 0
    ? "Sold out"
    : `${ticketsAvailable} tickets left`;
}

export default function EventCard({ event }) {
  const soldOut = event.ticketsAvailable === 0;

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>
        <Link to={`/events/${event.id}`} className={styles.titleLink}>
          {event.name}
        </Link>
      </h2>
      <p className={styles.meta}>
        {event.date} at {event.time}
      </p>
      <p className={styles.meta}>
        {event.venue}, {event.city}
      </p>
      <p className={styles.meta}>{formatPrice(event.price)}</p>
      <p
        className={
          soldOut ? `${styles.meta} ${styles.soldOut}` : styles.meta
        }
      >
        {formatAvailability(event.ticketsAvailable)}
      </p>
      <span className={styles.badge}>{event.category}</span>
    </article>
  );
}
