import { useCallback, useEffect, useState } from "react";
import api from "../../api.js";
import EventList from "../EventList/EventList.jsx";
import EventListControls from "../EventListControls/EventListControls.jsx";
import styles from "./EventsPage.module.css";

const PAGE_LIMIT = 5;

function buildEventsUrl({ page, sortBy, filterQuery }) {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(PAGE_LIMIT),
    _sort: sortBy,
    _order: "asc",
  });

  const q = filterQuery.trim();
  if (q) {
    params.set("q", q);
  }

  return api(`/events?${params.toString()}`);
}

export default function EventsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        buildEventsUrl({ page, sortBy, filterQuery }),
      );

      if (!response.ok) {
        throw new Error(`Could not load events (${response.status})`);
      }

      const data = await response.json();
      const count = Number(response.headers.get("X-Total-Count") ?? data.length);

      setEvents(Array.isArray(data) ? data : []);
      setTotalCount(count);
    } catch (err) {
      setEvents([]);
      setTotalCount(0);
      setError(err instanceof Error ? err.message : "Could not load events");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, filterQuery, retryCount]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function handleFilterQueryChange(value) {
    setFilterQuery(value);
    setPage(1);
  }

  function handleSortByChange(value) {
    setSortBy(value);
    setPage(1);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Events</h1>

      <EventListControls
        filterQuery={filterQuery}
        onFilterQueryChange={handleFilterQueryChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading}
      />

      {loading && (
        <p className={styles.status} role="status">
          Loading events…
        </p>
      )}

      {!loading && error && (
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
      )}

      {!loading && !error && (
        <EventList
          events={events}
          hasActiveFilter={filterQuery.trim() !== ""}
        />
      )}
    </div>
  );
}
