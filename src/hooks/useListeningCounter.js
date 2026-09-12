import { useEffect, useRef, useState } from 'react'

export function useListeningCounter({ enabled, baseCount, minCount, maxCount, driftIntervalMs, maxStep }) {
  const [count, setCount] = useState(baseCount)
  const seedRef = useRef(baseCount)

  useEffect(() => {
    if (!enabled) return

    const id = setInterval(() => {
      const step = Math.floor(Math.random() * (maxStep * 2 + 1)) - maxStep
      seedRef.current = Math.min(maxCount, Math.max(minCount, seedRef.current + step))
      setCount(seedRef.current)
    }, driftIntervalMs)

    return () => clearInterval(id)
  }, [enabled, minCount, maxCount, driftIntervalMs, maxStep])

  return count
}
