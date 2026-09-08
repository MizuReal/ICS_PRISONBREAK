import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, KeyIcon } from '../components/icons'
import { useProgress } from '../state/progress-context'

const RIDDLE = [
  'I have a route, but I am never found.',
  'I have a handler, but nothing answers.',
  'Every client asks for me — I return exactly nothing.',
]

const ACCEPTED_ANSWERS = ['404', 'error 404', '404 error']

function normalizeAnswer(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/^(a|an|the)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function Game1() {
  const { isDone, markDone } = useProgress()
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [shakeTick, setShakeTick] = useState(0)
  const solved = isDone('game1')

  function handleSubmit(e) {
    e.preventDefault()
    const answer = normalizeAnswer(value)
    if (!answer) {
      setFeedback({ type: 'empty', text: 'You have to type something, inmate.' })
      return
    }
    if (ACCEPTED_ANSWERS.includes(answer)) {
      markDone('game1')
      setFeedback(null)
      return
    }
    setAttempts((n) => n + 1)
    setFeedback({ type: 'wrong', text: 'Access denied — that number does not exist.' })
    setShakeTick((t) => t + 1)
  }

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
            Game 01 · Puzzle
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            THE MISSING PACKET
          </h1>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-jumpsuit-500/50 bg-jumpsuit-500/10 font-display text-2xl text-jumpsuit-400">
          01
        </span>
      </header>

      {solved ? (
        <section
          className="animate-unlock rounded-md border border-hazard/60 bg-concrete-900/70 p-6 text-center backdrop-blur-sm sm:p-10"
          aria-live="polite"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-hazard bg-hazard/10 text-hazard">
            <KeyIcon className="h-8 w-8" />
          </div>
          <p className="mt-6 inline-block rotate-[-7deg] animate-stamp border-2 border-hazard px-4 py-1 font-display text-2xl tracking-[0.2em] text-hazard">
            CELL UNLOCKED
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-[0.12em] sm:text-5xl">
            DOOR 01 SLIDES OPEN
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-concrete-300">
            The printout was right — the gate app stopped looking for your
            door ages ago. You type the missing number into the panel and the
            lock lets go like it was never closed. One door down, three to go.
          </p>
          <p className="mt-4 font-mono-ui text-[0.65rem] uppercase tracking-[0.25em] text-concrete-400">
            Rejected answers: {attempts}
            {attempts === 0 ? ' — flawless' : attempts === 1 ? ' — sloppy' : ' — sloppy, inmate'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-jumpsuit-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-950 transition-colors hover:bg-jumpsuit-400"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to cell block
            </Link>
            <Link
              to="/game/2"
              className="inline-flex items-center gap-2 border border-concrete-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400"
            >
              Game 02 · Take it
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : (
        <div
          key={shakeTick}
          className={feedback?.type === 'wrong' ? 'animate-shake' : ''}
        >
          <section className="relative rounded-md border border-concrete-700 bg-concrete-900/70 p-6 backdrop-blur-sm sm:p-10">
            <div
              className="tape absolute -top-3 left-8 h-6 w-24 -rotate-6 rounded-sm"
              aria-hidden="true"
            />
            <div
              className="tape absolute -top-3 right-8 h-6 w-24 rotate-3 rounded-sm"
              aria-hidden="true"
            />
            <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] text-jumpsuit-400">
              Printed bug report · Lifted from the intake tablet
            </p>
            <div className="paper-note mt-4 rounded-sm px-5 py-6 sm:px-8 sm:py-8">
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                Reported by QA at 03:00{' '}
                {attempts ? `— attempt ${attempts + 1}` : '— psst, wake up'}
              </p>
              <blockquote className="mt-3 space-y-1.5 text-lg leading-relaxed sm:text-xl">
                {RIDDLE.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </blockquote>
              <p className="mt-4 border-t border-concrete-950/25 pt-3 font-display text-xl tracking-[0.1em]">
                What am I?
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="answer" className="sr-only">
                Your answer
              </label>
              <input
                id="answer"
                type="text"
                autoComplete="off"
                spellCheck="false"
                placeholder="Type your answer…"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (feedback) setFeedback(null)
                }}
                className={`min-w-0 flex-1 rounded-sm border bg-concrete-950/80 px-4 py-3 text-base text-concrete-100 placeholder:text-concrete-600 focus:outline-none focus:ring-2 focus:ring-jumpsuit-500 ${
                  feedback?.type === 'wrong'
                    ? 'animate-denied border-alarm-500'
                    : 'border-concrete-600 focus:border-jumpsuit-500'
                }`}
              />
              <button
                type="submit"
                className="bg-jumpsuit-500 px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-950 transition-colors hover:bg-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
              >
                Try the door
              </button>
            </form>

            <div aria-live="polite" className="mt-4 min-h-6">
              {feedback?.type === 'wrong' && (
                <p className="flex items-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-alarm-400">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-alarm-400" />
                  {feedback.text} (rejected {attempts})
                </p>
              )}
              {feedback?.type === 'empty' && (
                <p className="font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-concrete-300">
                  {feedback.text}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
