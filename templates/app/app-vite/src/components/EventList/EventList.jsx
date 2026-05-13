import EventCard from "../EventCard/EventCard.jsx";
import events from "../../data/events.js";

// TODO: split each event below into its own EventCard component
// TODO: render EventCard with `.map()` and pass each event as props (Week 2)
// TODO: add a "Buy ticket" button to each event card
// TODO: replace the mock data import with a fetch call to GET /events

export default function EventList() {
  return (
    <>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>
              {event.date} at {event.time}
            </p>
            <p>
              {event.venue}, {event.city}
            </p>
            <p>{event.category}</p>
            <p>{event.price === 0 ? "Free" : `€${event.price}`}</p>
            <p>
              {event.ticketsAvailable === 0
                ? "Sold out"
                : `${event.ticketsAvailable} tickets left`}
            </p>
          </li>
        ))}
      </ul>

      <section style={{ marginTop: "2rem" }} aria-label="Single-event card layout">
        <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
          One event as a reusable card (Week 1 — hardcoded JSX)
        </h2>
        <EventCard />
      </section>
    </>
  );
}
