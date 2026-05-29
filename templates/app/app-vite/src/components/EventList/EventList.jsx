import EventCard from "../EventCard/EventCard.jsx";
import styles from "./EventList.module.css";


// TODO: split each event below into its own EventCard component
// TODO: render EventCard with `.map()` and pass each event as props (Week 2)
// TODO: add a "Buy ticket" button to each event card
// TODO: replace the mock data import with a fetch call to GET /events

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
