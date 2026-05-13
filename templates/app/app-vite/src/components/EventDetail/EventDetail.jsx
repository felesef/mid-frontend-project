// TODO: display at least date, time, venue, city, and description for one event
// TODO: use useParams() to get the event id from the URL
// TODO: fetch the event from GET /events/:id instead of using mock data
import styles from "./EventDetail.module.css";

export default function EventDetail() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>JavaScript: Modern Patterns Workshop</h1>

      <section className={styles.grid} aria-label="Event details">
        <p className={styles.row}>
          <span className={styles.label}>Date: </span>
          2026-05-03
        </p>
        <p className={styles.row}>
          <span className={styles.label}>Time: </span>
          10:00
        </p>
        <p className={styles.row}>
          <span className={styles.label}>Venue: </span>
          Founders House, Copenhagen
        </p>
      </section>

      <section aria-labelledby="event-desc-heading">
        <h2 id="event-desc-heading" className="visually-hidden">
          Description
        </h2>
        <p className={styles.body}>
          A hands-on full-day workshop covering modern JavaScript patterns:
          closures, async/await, Promises, modules, and functional techniques.
          Bring your laptop. Small group, individual coaching included.
        </p>
      </section>
    </div>
  );
}