import { Link } from 'react-router-dom'
import { ArrowLeftIcon, LockIcon } from '../components/icons'

export default function Locked({ num, title, note }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-concrete-400 transition-colors hover:text-jumpsuit-400"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to cell block
        </Link>
      </nav>

      <header className="flex items-end justify-between gap-4 border-b border-concrete-700 pb-4">
        <div>
          <p className="font-mono-ui text-[0.65rem] uppercase tracking-[0.35em] text-jumpsuit-400">
            Game {num} · Puzzle
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            {title}
          </h1>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-concrete-600 bg-concrete-800/60 font-display text-2xl text-concrete-400">
          {num}
        </span>
      </header>

      <section className="relative overflow-hidden rounded-md border border-concrete-700 bg-concrete-900/70 text-center backdrop-blur-sm">
        <div className="hazard-stripes h-1.5 opacity-70" aria-hidden="true" />
        <div className="flex flex-col items-center gap-5 px-6 py-12 sm:py-16">
          <div className="relative">
            <div className="alarm-stripes absolute -inset-2 rounded-sm opacity-25" aria-hidden="true" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-md border border-concrete-600 bg-concrete-950/80 text-concrete-500">
              <LockIcon className="h-9 w-9" />
            </span>
          </div>
          <div>
            <p className="font-mono-ui text-[0.7rem] uppercase tracking-[0.4em] text-alarm-400">
              Cell sealed · Construction crew on break
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.15em] text-concrete-300 sm:text-4xl">
              UNDER CONSTRUCTION
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-concrete-400">
              {note} Check back after the warden finishes hiding the next
              puzzle.
            </p>
          </div>
          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-2 border border-concrete-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to cell block
          </Link>
        </div>
        <div className="hazard-stripes h-1.5 opacity-70" aria-hidden="true" />
      </section>
    </div>
  )
}
