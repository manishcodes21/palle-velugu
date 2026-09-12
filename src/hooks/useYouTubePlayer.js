import { useCallback, useEffect, useRef, useState } from 'react'

const API_SRC = 'https://www.youtube.com/iframe_api'

let apiPromise = null

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT)
  }
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve(window.YT)
    }
    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const tag = document.createElement('script')
      tag.src = API_SRC
      document.head.appendChild(tag)
    }
  })
  return apiPromise
}

const PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
}

export function useYouTubePlayer({ containerId, playlistId, fallbackVideoIds }) {
  const playerRef = useRef(null)
  const pollRef = useRef(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState(null)
  const [track, setTrack] = useState({ title: '', videoId: '' })
  const [progress, setProgress] = useState({ current: 0, duration: 0 })

  useEffect(() => {
    let cancelled = false

    loadYouTubeApi().then((YT) => {
      if (cancelled) return

      const initVars = playlistId
        ? { listType: 'playlist', list: playlistId }
        : { playlist: (fallbackVideoIds || []).join(',') }

      playerRef.current = new YT.Player(containerId, {
        host: 'https://www.youtube.com',
        playerVars: {
          ...initVars,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (cancelled) return
            setIsReady(true)
          },
          onStateChange: (event) => {
            if (cancelled) return
            const state = event.data
            setIsPlaying(state === PLAYER_STATE.PLAYING)
            setIsBuffering(state === PLAYER_STATE.BUFFERING)

            if (state === PLAYER_STATE.PLAYING || state === PLAYER_STATE.CUED) {
              const data = playerRef.current?.getVideoData?.()
              if (data) {
                setTrack({ title: data.title || '', videoId: data.video_id || '' })
              }
            }
            if (state === PLAYER_STATE.ENDED) {
              playerRef.current?.nextVideo?.()
            }
          },
          onError: () => {
            if (cancelled) return
            setError('This track hit a snag — skipping ahead.')
            playerRef.current?.nextVideo?.()
          },
        },
      })
    })

    return () => {
      cancelled = true
      clearInterval(pollRef.current)
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId])

  useEffect(() => {
    if (!isReady) return
    pollRef.current = setInterval(() => {
      const p = playerRef.current
      if (!p?.getCurrentTime) return
      setProgress({
        current: p.getCurrentTime() || 0,
        duration: p.getDuration() || 0,
      })
    }, 500)
    return () => clearInterval(pollRef.current)
  }, [isReady])

  const play = useCallback(() => playerRef.current?.playVideo?.(), [])
  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), [])
  const togglePlay = useCallback(() => {
    isPlaying ? playerRef.current?.pauseVideo?.() : playerRef.current?.playVideo?.()
  }, [isPlaying])
  const next = useCallback(() => playerRef.current?.nextVideo?.(), [])
  const previous = useCallback(() => playerRef.current?.previousVideo?.(), [])
  const seekTo = useCallback((seconds) => playerRef.current?.seekTo?.(seconds, true), [])

  const watchUrl = track.videoId
    ? `https://www.youtube.com/watch?v=${track.videoId}${playlistId ? `&list=${playlistId}` : ''}`
    : `https://www.youtube.com/playlist?list=${playlistId || ''}`

  return {
    isReady,
    isPlaying,
    isBuffering,
    error,
    track,
    progress,
    watchUrl,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seekTo,
  }
}
