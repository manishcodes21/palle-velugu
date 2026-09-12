function ListeningCounter({ count, label }) {
  return (
    <div className="counter" role="status">
      <span className="counter__dot" aria-hidden="true" />
      <span className="counter__count">{count}</span>
      <span className="counter__label">{label}</span>
    </div>
  )
}

export default ListeningCounter
