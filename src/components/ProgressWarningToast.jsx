import { useEffect, useState } from 'react'
import { CloseIcon } from './icons'
import { games } from '../data/games'
import { useProgress } from '../state/progress-context'

export default function ProgressWarningToast() {
  const { isDone } = useProgress()
  const [dismissed, setDismissed] = useState(false)
  const keyCount = games.filter((g) => isDone(g.id)).length

  useEffect(() => {
    if (keyCount === 0) setDismissed(false)
  }, [keyCount])

  if (keyCount === 0 || dismissed) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className="animate-unlock fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-xl"
    >
      <div className="overflow-hidden rounded-md border border-alarm-500/50 bg-concrete-900/95 shadow-2xl backdrop-blur-sm">
        <div className="alarm-stripes h-1.5 opacity-80" aria-hidden="true" />
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <span
            className="mt-1.5 inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-alarm-400"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-alarm-400">
              Inmate notice · No permanent record
            </p>
            <p className="mt-1 text-sm leading-relaxed text-concrete-200">
              Nice haul — {keyCount} of {games.length} keys. But they live in
              this session only. Refresh the page (or close the tab) and the
              warden wipes your file clean.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss warning"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-concrete-700 text-concrete-400 transition-colors hover:border-alarm-500 hover:text-alarm-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
