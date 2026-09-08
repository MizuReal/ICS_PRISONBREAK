import { Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckIcon, KeyIcon, LockIcon } from '../components/icons'
import { escapeGame, games } from '../data/games'
import { useProgress } from '../state/progress-context'

export default function Escape() {
  const { isDone } = useProgress()
  const keyCount = games.filter((g) => isDone(g.id)).length
  const free = keyCount === games.length

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
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
            Final stage · The yard gate
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            {escapeGame.title.toUpperCase()}
          </h1>
        </div>
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border font-display text-2xl ${
            free
              ? 'border-hazard bg-hazard text-concrete-950'
              : 'border-concrete-600 bg-concrete-800/60 text-concrete-400'
          }`}
        >
          {escapeGame.num}
        </span>
      </header>

      {free ? (
        <section
          className="animate-unlock rounded-md border-2 border-dashed border-hazard bg-hazard/10 p-8 text-center backdrop-blur-sm sm:p-12"
          aria-live="polite"
        >
          <p className="inline-block rotate-[-7deg] animate-stamp border-2 border-hazard px-4 py-1 font-display text-2xl tracking-[0.2em] text-hazard">
            FREEDOM
          </p>
          <h2 className="mt-4 font-display text-5xl tracking-[0.12em] sm:text-6xl">
            THE GATE IS OPEN
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-concrete-200 sm:text-base">
            Four games, four keys, zero guards the wiser. You walk out into the
            cold morning air — inmate {keyCount}/{games.length} scorecard, and
            the compound is behind you. The breakout is complete.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 bg-hazard px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-950 transition-colors hover:bg-hazard-300"
          >
            <CheckIcon className="h-4 w-4" />
            Case closed — go home
          </Link>
        </section>
      ) : (
        <>
          <section
            className="rounded-md border border-concrete-700 bg-concrete-900/70 p-6 text-center backdrop-blur-sm sm:p-10"
            aria-describedby="escape-status"
          >
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-md border border-concrete-600 bg-concrete-950/80 text-concrete-500">
              <LockIcon className="h-10 w-10" />
              <span className="absolute -inset-1.5 -z-10 rounded-md bg-concrete-800/50" aria-hidden="true" />
            </div>
            <h2 className="mt-6 font-display text-3xl tracking-[0.15em] sm:text-4xl">
              THE EXIT LIES BEHIND FOUR DOORS
            </h2>
            <p
              id="escape-status"
              className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-concrete-400"
            >
              Each finished game hands you one key. Collect all four to flip
              the main gate. The warden clocks out at midnight — you don't have
              forever.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {games.map((game) => {
                const done = isDone(game.id)
                return (
                  <li
                    key={game.id}
                    className={`flex flex-col items-center gap-3 rounded-sm border p-4 ${
                      done
                        ? 'border-hazard/50 bg-hazard/10'
                        : 'border-concrete-700 bg-concrete-950/60'
                    }`}
                  >
                    <span
                      className={
                        done
                          ? 'text-hazard'
                          : 'text-concrete-600'
                      }
                    >
                      {done ? (
                        <KeyIcon className="h-8 w-8" />
                      ) : (
                        <LockIcon className="h-8 w-8" />
                      )}
                    </span>
                    <span
                      className={`font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] ${
                        done ? 'text-hazard' : 'text-concrete-500'
                      }`}
                    >
                      Game {game.num}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <div className="overflow-hidden rounded-md border border-concrete-700">
            <div
              className="hazard-stripes h-2 opacity-80"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 bg-concrete-900/80 px-5 py-4">
              <p
                id="escape-count"
                className="font-mono-ui text-[0.7rem] uppercase tracking-[0.3em] text-concrete-300"
              >
                Breach progress — {keyCount} of {games.length} keys
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {games.map((g) => (
                  <span
                    key={g.id}
                    className={`h-2.5 w-8 ${
                      isDone(g.id) ? 'bg-hazard' : 'bg-concrete-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div
              className="hazard-stripes h-2 opacity-80"
              aria-hidden="true"
            />
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-concrete-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to the block — keep playing
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
