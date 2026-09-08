import { useEffect, useMemo, useState } from 'react'
import { ProgressContext } from './progress-context'

export default function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(() => new Set())

  useEffect(() => {
    if (completed.size === 0) return

    function handleBeforeUnload(e) {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [completed])

  const value = useMemo(
    () => ({
      completed,
      isDone: (id) => completed.has(id),
      markDone: (id) => {
        setCompleted((prev) => {
          if (prev.has(id)) return prev
          const next = new Set(prev)
          next.add(id)
          return next
        })
      },
    }),
    [completed],
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}
