import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, KeyIcon, LockIcon } from '../components/icons'
import { escapeGame, games } from '../data/games'
import { useProgress } from '../state/progress-context'

function StatusBadge({ done, locked }) {
  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-hazard/60 bg-hazard/10 px-2.5 py-1 font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-hazard">
        <CheckIcon className="h-3 w-3" />
        Unlocked
      </span>
    )
  }
  if (locked) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-concrete-600 bg-concrete-800/60 px-2.5 py-1 font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-concrete-400">
        <LockIcon className="h-3 w-3" />
        Locked
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-jumpsuit-500 px-2.5 py-1 font-mono-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] text-concrete-950">
      ▶ Play
    </span>
  )
}

function RosterRow({ game, done }) {
  const locked = !done && game.status === 'locked'
  const inner = (
    <>
      <div
        className={`flex size-14 shrink-0 items-center justify-center rounded-sm border font-display text-3xl sm:size-18 sm:text-4xl ${
          done
            ? 'border-hazard/50 bg-hazard/10 text-hazard'
            : locked
              ? 'border-concrete-700 bg-concrete-800/60 text-concrete-500'
              : 'border-jumpsuit-500/50 bg-jumpsuit-500/10 text-jumpsuit-400'
        }`}
      >
        {game.num}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="font-display text-2xl tracking-[0.12em] sm:text-[1.7rem]">
            {game.title}
          </h3>
          {game.num !== 'EXIT' && (
            <span className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-500">
              Cell {game.num}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-concrete-400">{game.blurb}</p>
      </div>
      <div className="flex w-full justify-end sm:w-auto sm:shrink-0">
        <StatusBadge done={done} locked={locked} />
      </div>
    </>
  )

  const cardClass =
    'group flex flex-wrap items-center gap-x-4 gap-y-3 rounded-md border bg-concrete-900/60 p-4 backdrop-blur-sm transition-colors sm:gap-x-6 sm:p-5 ' +
    (locked
      ? 'cursor-not-allowed border-concrete-700/70 opacity-80'
      : 'border-concrete-700 hover:border-jumpsuit-500/70 hover:bg-concrete-800/60')

  if (locked) {
    return <div className={cardClass}>{inner}</div>
  }
  return (
    <Link to={game.route} className={cardClass}>
      {inner}
    </Link>
  )
}

export default function Home() {
  const { isDone } = useProgress()
  const keyCount = games.filter((g) => isDone(g.id)).length
  const doneEscape = keyCount === games.length

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      <section className="text-center">
        <p className="font-mono-ui text-[0.7rem] uppercase tracking-[0.4em] text-jumpsuit-400">
          State penitentiary · Inmate intake
        </p>
        <h1 className="mt-3 font-display text-[clamp(3.2rem,10vw,6.5rem)] leading-[0.9] tracking-[0.06em]">
          PRISON BREAK
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-concrete-300 sm:text-base">
          You landed inside the deepest block of the facility. Four games
          separate you from the exit — solve every puzzle, collect every key,
          and walk out before the warden notices.
        </p>
        <p className="mt-4 inline-flex items-center gap-3 border-y border-concrete-700 px-4 py-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.3em] text-concrete-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-alarm-400" />
          4 games · 1 escape
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-alarm-400" />
        </p>
      </section>

      <section aria-label="Cell block games" className="flex flex-col gap-3">
        {games.map((game) => (
          <RosterRow key={game.id} game={game} done={isDone(game.id)} />
        ))}

        <Link
          to={escapeGame.route}
          className={`group mt-3 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-md border-2 border-dashed p-4 transition-colors sm:gap-x-6 sm:p-5 ${
            doneEscape
              ? 'border-hazard bg-hazard/10 hover:bg-hazard/15'
              : 'border-concrete-600 bg-concrete-900/40 hover:border-jumpsuit-500/60'
          }`}
        >
          <div
            className={`flex size-14 shrink-0 items-center justify-center rounded-sm border font-display text-2xl sm:size-18 sm:text-4xl ${
              doneEscape
                ? 'border-hazard bg-hazard text-concrete-950'
                : 'border-concrete-600 bg-concrete-800/60 text-concrete-300'
            }`}
          >
            {escapeGame.num}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h3 className="font-display text-2xl tracking-[0.14em] text-jumpsuit-400 group-hover:text-jumpsuit-300 sm:text-[1.7rem]">
              {escapeGame.title}
            </h3>
            <p className="mt-0.5 text-sm text-concrete-400">
              {escapeGame.blurb}
            </p>
          </div>
          <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:shrink-0">
            <div className="flex gap-1.5" aria-hidden="true">
              {games.map((g) => (
                <span
                  key={g.id}
                  className={
                    isDone(g.id)
                      ? 'flex h-7 w-7 items-center justify-center rounded-sm bg-hazard/15 text-hazard'
                      : 'flex h-7 w-7 items-center justify-center rounded-sm border border-concrete-600 text-concrete-600'
                  }
                >
                  <KeyIcon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <span className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-400">
              {keyCount} / {games.length} keys
            </span>
          </div>
        </Link>
      </section>

      <section aria-label="Cell block utility">
        <Link
          to="/decypher"
          className="group flex flex-wrap items-center gap-x-4 gap-y-3 rounded-md border border-concrete-700 bg-concrete-900/40 p-4 backdrop-blur-sm transition-colors sm:gap-x-6 sm:p-5 hover:border-jumpsuit-500/60 hover:bg-concrete-800/60"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-sm border border-jumpsuit-500/40 bg-concrete-900 font-display text-xl tracking-wider text-jumpsuit-400 transition-colors group-hover:border-jumpsuit-500/70 sm:size-18 sm:text-2xl">
            A–Z
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-500">
              Cell-block utility · Cipher desk
            </span>
            <span className="mt-1 block font-display text-2xl tracking-[0.12em] text-concrete-100 transition-colors group-hover:text-jumpsuit-300 sm:text-[1.7rem]">
              THE CIPHER MANUAL
            </span>
            <span className="mt-0.5 block text-sm text-concrete-400">
              Every letter in hex — type a word, read it in code. No keys, just
              the crib sheet.
            </span>
          </span>
          <span className="hidden shrink-0 items-center gap-2 font-mono-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] text-concrete-400 transition-colors group-hover:text-jumpsuit-400 sm:inline-flex">
            Open the desk
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Link>
      </section>
    </div>
  )
}
