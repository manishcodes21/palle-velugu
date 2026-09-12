import { useEffect, useState } from 'react'

function formatTime(date) {
  return date
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase()
}

function TimeBadge() {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 10_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="time-badge" aria-hidden="true">
      {time}
    </div>
  )
}

export default TimeBadge
