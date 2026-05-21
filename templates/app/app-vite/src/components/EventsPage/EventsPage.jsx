import { useMemo, useState } from "react";
import events from "../../data/events.js";
import EventList from "../EventList/EventList.jsx";
import EventListControls from "../EventListControls/EventListControls.jsx";
import styles from "./EventsPage.module.css";

function filterEvents(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter(
    (event) =>
      event.name.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q),
  );
}

function sortEvents(list, sortBy) {
  const sorted = [...list];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "price":
      return sorted.sort((a, b) => a.price - b.price);
    case "date":
    default:
      return sorted.sort((a, b) => a.date.localeCompare(b.date));
  }
}

export default function EventsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const visibleEvents = useMemo(
    () => sortEvents(filterEvents(events, filterQuery), sortBy),
    [filterQuery, sortBy],
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Events</h1>

      <EventListControls
        filterQuery={filterQuery}
        onFilterQueryChange={setFilterQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <EventList events={visibleEvents} hasActiveFilter={filterQuery.trim() !== ""} />
    </div>
  );
}
