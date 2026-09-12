import { cleanTrackTitle, formatTime } from '../utils/format'

function PlayerCard({
  track,
  progress,
  isPlaying,
  isBuffering,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  watchUrl,
  watchLabel,
}) {
  const { current, duration } = progress
  const pct = duration > 0 ? (current / duration) * 100 : 0
  const title = cleanTrackTitle(track.title) || ''

  return (
    <div className="player-card">
      <div className="player-card__now-playing">
        <span className="player-card__eyebrow">now playing</span>
        <p className="player-card__title" title={title}>
          {isBuffering ? '' : title}
        </p>
      </div>

      <div className="player-card__progress">
        <input
          type="range"
          className="player-card__seek"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(current, duration || 0)}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{ '--pct': `${pct}%` }}
          aria-label="Seek"
        />
        <div className="player-card__times">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-card__controls">
        <button
          type="button"
          className="player-card__btn player-card__btn--ghost"
          onClick={onPrevious}
          aria-label="Previous song"
        >
          ⏮
        </button>
        <button
          type="button"
          className="player-card__btn player-card__btn--primary"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className="player-card__btn player-card__btn--ghost"
          onClick={onNext}
          aria-label="Next song"
        >
          ⏭
        </button>
      </div>

      <a
        className="player-card__watch"
        href={watchUrl}
        target="_blank"
        rel="noreferrer"
      >
        {watchLabel} ↗
      </a>
    </div>
  )
}

export default PlayerCard
