function StartOverlay({ label, isReady, onStart }) {
  return (
    <div className="start-overlay">
      <button
        type="button"
        className="start-overlay__button"
        onClick={onStart}
        disabled={!isReady}
      >
        <span className="start-overlay__icon" aria-hidden="true">
          {isReady ? '▶' : ''}
        </span>
        <span className="start-overlay__label">
          {isReady ? label : 'Warming up the engine…'}
        </span>
      </button>
    </div>
  )
}

export default StartOverlay
