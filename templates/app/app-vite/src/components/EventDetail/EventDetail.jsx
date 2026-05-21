// TODO: display at least date, time, venue, city, and description for one event
// TODO: use useParams() to get the event id from the URL
// TODO: fetch the event from GET /events/:id instead of using mock data
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import events from "../../data/events.js";
import styles from "./EventDetail.module.css";

function formatPrice(price) {
  return price === 0 ? "Free" : `€${price}`;
}

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => String(e.id) === id);

  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  if (!event) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound} role="status">
          Event not found.
        </p>
        <Link to="/events">Back to events</Link>
      </div>
    );
  }

  const soldOut = event.ticketsAvailable === 0;
  const maxQuantity = soldOut ? 0 : event.ticketsAvailable;
  const lineTotal = event.price * quantity;

  function decreaseQuantity() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQuantity() {
    setQuantity((q) => Math.min(maxQuantity, q + 1));
  }

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link to="/events">← All events</Link>
      </p>

      <h1 className={styles.title}>{event.name}</h1>
      <span className={styles.badge}>{event.category}</span>

      <section className={styles.grid} aria-label="Event details">
        <p className={styles.row}>
          <span className={styles.label}>Date: </span>
          {event.date}
        </p>
        <p className={styles.row}>
          <span className={styles.label}>Time: </span>
          {event.time}
        </p>
        <p className={styles.row}>
          <span className={styles.label}>Venue: </span>
          {event.venue}, {event.city}
        </p>
        <p className={styles.row}>
          <span className={styles.label}>Price: </span>
          {formatPrice(event.price)}
        </p>
        <p className={styles.row}>
          <span className={styles.label}>Availability: </span>
          {soldOut ? (
            <span className={styles.soldOut}>Sold out</span>
          ) : (
            `${event.ticketsAvailable} of ${event.totalTickets} tickets left`
          )}
        </p>
      </section>

      <section aria-labelledby="event-desc-heading">
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={descriptionExpanded}
          aria-controls="event-description"
          onClick={() => setDescriptionExpanded((open) => !open)}
        >
          {descriptionExpanded ? "Hide description" : "Show description"}
        </button>
        {descriptionExpanded && (
          <p id="event-description" className={styles.body}>
            {event.description}
          </p>
        )}
      </section>

      {!soldOut && (
        <section className={styles.tickets} aria-label="Select ticket quantity">
          <h2 className={styles.ticketsHeading}>Tickets</h2>
          <div className={styles.quantityRow}>
            <button
              type="button"
              className={styles.quantityBtn}
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <label className={styles.quantityLabel}>
              Quantity
              <input
                type="number"
                className={styles.quantityInput}
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isNaN(next)) {
                    setQuantity(
                      Math.min(maxQuantity, Math.max(1, next)),
                    );
                  }
                }}
              />
            </label>
            <button
              type="button"
              className={styles.quantityBtn}
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className={styles.total}>
            {event.price === 0
              ? "Total: Free"
              : `Total: €${lineTotal} (${quantity} × ${formatPrice(event.price)})`}
          </p>
        </section>
      )}
    </div>
  );
}
