import styles from "./EventListControls.module.css";

export default function EventListControls({
  filterQuery,
  onFilterQueryChange,
  sortBy,
  onSortByChange,
  page,
  totalPages,
  onPageChange,
  disabled,
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
          disabled={disabled}
          onChange={(e) => onFilterQueryChange(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Sort by</span>
        <select
          className={styles.select}
          value={sortBy}
          disabled={disabled}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </label>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
