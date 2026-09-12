import { useEffect, useState } from 'react'
import Hero, { Atmosphere } from './components/Hero'
import PlayerCard from './components/PlayerCard'
import ListeningCounter from './components/ListeningCounter'
import TimeBadge from './components/TimeBadge'
import Footer from './components/Footer'
import SupportModal from './components/SupportModal'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { useListeningCounter } from './hooks/useListeningCounter'
import siteConfig from './config/site.config.json'
import './App.css'

const { hero, player: playerConfig, counter: counterConfig, footer, support: supportConfig } = siteConfig

function App() {
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  const player = useYouTubePlayer({
    containerId: 'yt-player',
    playlistId: playerConfig.youtube.playlistId,
    fallbackVideoIds: playerConfig.youtube.fallbackVideoIds,
  })

  const listenerCount = useListeningCounter(counterConfig)

  // Auto-start after 1ms timer (workaround for browser autoplay policies)
  useEffect(() => {
    if (!player.isReady) return
    const timer = setTimeout(() => {
      player.play()
    }, 1)
    return () => clearTimeout(timer)
  }, [player.isReady, player.play])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target instanceof HTMLInputElement) return

      if (event.code === 'Space') {
        event.preventDefault()
        player.togglePlay()
      } else if (event.code === 'ArrowRight') {
        player.next()
      } else if (event.code === 'ArrowLeft') {
        player.previous()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [player])

  return (
    <div className="scene">
      <Hero hero={hero} />

      <div id="yt-player" className="yt-player-mount" />

      <div className="scene__content">
        <TimeBadge />

        {counterConfig.enabled && (
          <ListeningCounter count={listenerCount} label={counterConfig.label} />
        )}

        <Atmosphere hero={hero} />

        <PlayerCard
          track={player.track}
          progress={player.progress}
          isPlaying={player.isPlaying}
          isBuffering={player.isBuffering}
          onTogglePlay={player.togglePlay}
          onNext={player.next}
          onPrevious={player.previous}
          onSeek={player.seekTo}
          watchUrl={player.watchUrl}
          watchLabel={playerConfig.watchOnYoutubeLabel}
        />

        <Footer
          credit={footer.credit}
          supportLabel={supportConfig.enabled ? supportConfig.linkLabel : null}
          onSupportClick={() => setIsSupportOpen(true)}
        />
      </div>

      {isSupportOpen && (
        <SupportModal config={supportConfig} onClose={() => setIsSupportOpen(false)} />
      )}
    </div>
  )
}

export default App
