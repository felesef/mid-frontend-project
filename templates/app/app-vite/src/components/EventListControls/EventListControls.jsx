import styles from "./EventListControls.module.css";

export default function EventListControls({
  filterQuery,
  onFilterQueryChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <div className={styles.controls}>
      <label className={styles.field}>
        <span className={styles.label}>Search events</span>
        <input
          type="search"
          className={styles.input}
          placeholder="Name, venue, or category…"
          value={filterQuery}
          onChange={(e) => onFilterQueryChange(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Sort by</span>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </label>
    </div>
  );
}
