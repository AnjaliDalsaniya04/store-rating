export default function StarRating({ value, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`stars ${readOnly ? "readonly" : ""}`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? "filled" : ""}
          onClick={() => !readOnly && onChange && onChange(n)}
          disabled={readOnly}
        >
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}