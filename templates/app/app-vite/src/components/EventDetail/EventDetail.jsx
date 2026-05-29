import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api.js";
import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./EventDetail.module.css";

export default function EventDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setEvent(null);

      try {
        const response = await fetch(api(`/events/${id}`));

        if (response.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(`Could not load event (${response.status})`);
        }

        const data = await response.json();
        if (!cancelled) {
          setEvent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load event",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  useEffect(() => {
    setQuantity(1);
    setDescriptionExpanded(false);
  }, [event?.id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.status} role="status">
          Loading event…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox} role="alert">
          <p className={styles.errorText}>{error}</p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => setRetryCount((n) => n + 1)}
          >
            Try again
          </button>
        </div>
        <p className={styles.back}>
          <Link to="/events">← All events</Link>
        </p>
      </div>
    );
  }

  if (notFound || !event) {
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

  function handleAddToCart() {
    addItem(event, quantity);
    setCartMessage(
      `Added ${quantity} ticket${quantity === 1 ? "" : "s"} to your cart.`,
    );
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
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          {cartMessage && (
            <p className={styles.cartMessage} role="status">
              {cartMessage}{" "}
              <Link to="/cart">View cart</Link>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
