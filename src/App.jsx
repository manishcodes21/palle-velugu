import { useEffect, useState } from 'react'
import Hero, { Atmosphere } from './components/Hero'
import PlayerCard from './components/PlayerCard'
import ListeningCounter from './components/ListeningCounter'
import StartOverlay from './components/StartOverlay'
import Footer from './components/Footer'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { useListeningCounter } from './hooks/useListeningCounter'
import siteConfig from './config/site.config.json'
import './App.css'

const { hero, player: playerConfig, counter: counterConfig, footer } = siteConfig

function App() {
  const [hasStarted, setHasStarted] = useState(false)

  const player = useYouTubePlayer({
    containerId: 'yt-player',
    playlistId: playerConfig.youtube.playlistId,
    fallbackVideoIds: playerConfig.youtube.fallbackVideoIds,
  })

  const listenerCount = useListeningCounter(counterConfig)

  const handleStart = () => {
    player.play()
    setHasStarted(true)
  }

  useEffect(() => {
    if (!hasStarted) return

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
  }, [hasStarted, player])

  return (
    <div className="scene">
      <Hero hero={hero} />

      <div id="yt-player" className="yt-player-mount" />

      <div className="scene__content">
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

        <Footer credit={footer.credit} supportUrl={footer.supportUrl} />
      </div>

      {!hasStarted && (
        <StartOverlay
          label={playerConfig.tapToStartLabel}
          isReady={player.isReady}
          onStart={handleStart}
        />
      )}
    </div>
  )
}

export default App
