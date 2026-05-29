import EventCard from "../EventCard/EventCard.jsx";
import styles from "./EventList.module.css";

export default function EventList({ events, hasActiveFilter }) {
  if (events.length === 0) {
    return (
      <p className={styles.empty} role="status">
        {hasActiveFilter
          ? "No events match your search. Try a different keyword."
          : "No events to show right now."}
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <li key={event.id} className={styles.item}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}
