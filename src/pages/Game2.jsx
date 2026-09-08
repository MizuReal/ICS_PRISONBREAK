import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, KeyIcon } from '../components/icons'
import { useProgress } from '../state/progress-context'

const LOG = [
  'Downclocked the cell doors and logged the whole thing as routine repair.',
  'Old bug reports went to the incinerator instead of the tracker — some things the warden should never hear over the radio.',
  'New patch kills the shake-to-unlock gesture — too many inmates were getting lucky with the gyro.',
  'Turned off the yard lights at midnight — you didn’t hear that from me, and I didn’t see it.',
  'Pushed the 404 fix the other coder refused to ship — some doors open best when the app forgets them.',
  'Undid the master kill switch and hid the override where nobody with a badge will ever think to go.',
  'Signed the nightly build and slipped a spare key into the fine print — you’re welcome, friend.',
  'Hid the master override under the same default password the warden refused to change — mine.',
]

const WARNING_CHARS = ['D', 'O', 'N', '’', 'T', ' ', 'P', 'U', 'S', 'H']
const SECRET_CHARS = ['R', 'O', 'O', 'T', ' ', 'M', 'O', 'D', 'E']

const CLUES = {
  1: {
    scrap: 'The warning hides in the first word of every change.',
    question: 'What does the changelog really warn you?',
    denial: 'Access denied — the changelog holds its tongue.',
    button: 'Decode it',
    solution: 'dont push',
  },
  2: {
    scrap: 'A coder’s secret is written at the end of every line he signs.',
    question: 'What did the coder hide in the release?',
    denial: 'Access denied — the coder is still hiding it.',
    button: 'Reveal the secret',
    solution: 'root mode',
  },
}

function normalizeAnswer(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/^(a|an|the)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function LetterChips({ chars, tone }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5" aria-hidden="true">
      {chars.map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="w-3" />
        ) : (
          <span
            key={i}
            className={`flex h-8 w-8 items-center justify-center border font-display text-xl ${
              tone === 'alarm'
                ? 'border-alarm-500/50 bg-concrete-950 text-alarm-400'
                : 'border-hazard/50 bg-concrete-950 text-hazard'
            }`}
          >
            {ch}
          </span>
        )
      )}
    </div>
  )
}

export default function Game2() {
  const { isDone, markDone } = useProgress()
  const [stage, setStage] = useState(1)
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState({ 1: 0, 2: 0 })
  const [feedback, setFeedback] = useState(null)
  const [shakeTick, setShakeTick] = useState(0)
  const solved = isDone('game2')
  const clue = CLUES[stage]

  function handleSubmit(e) {
    e.preventDefault()
    const answer = normalizeAnswer(value)
    if (!answer) {
      setFeedback({ type: 'empty', text: 'You have to type something, inmate.' })
      return
    }
    if (answer === clue.solution) {
      if (stage === 1) {
        setStage(2)
        setValue('')
        setFeedback(null)
      } else {
        markDone('game2')
        setFeedback(null)
      }
      return
    }
    setAttempts((a) => ({ ...a, [stage]: a[stage] + 1 }))
    setFeedback({ type: 'wrong', text: clue.denial })
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
            Game 02 · Puzzle
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            THE COMMIT LOG
          </h1>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-jumpsuit-500/50 bg-jumpsuit-500/10 font-display text-2xl text-jumpsuit-400">
          02
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
            DOOR 02 SLIDES OPEN
          </h2>
          <div className="mt-6 flex justify-center">
            <LetterChips chars={SECRET_CHARS} tone="hazard" />
          </div>
          <p className="sr-only">The last letters spell: root mode.</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-concrete-300">
            The changelog’s last words spelled it — the coder left door 02 in
            root mode. You sign in as the build machine, the lock motor hums,
            and a second key drops out of the release notes. Halfway to the
            gate.
          </p>
          <p className="mt-4 font-mono-ui text-[0.65rem] uppercase tracking-[0.25em] text-concrete-400">
            Rejected answers: {attempts[1] + attempts[2]}
            {attempts[1] + attempts[2] === 0
              ? ' — flawless'
              : ' — sloppy, inmate'}
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
              to="/game/3"
              className="inline-flex items-center gap-2 border border-concrete-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400"
            >
              Game 03 · Take it
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
              Release notes draft · GateOS 0.4 → 0.5
            </p>
            <div className="paper-note mt-4 rounded-sm px-5 py-6 sm:px-8 sm:py-8">
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                {stage === 1
                  ? 'Change list — signed, sealed, too clean'
                  : 'Change list — with corrections'}
              </p>
              <ol className="mt-3 space-y-2.5">
                {LOG.map((sentence, i) => (
                  <li
                    key={sentence}
                    className="flex gap-3 text-base leading-relaxed sm:text-lg"
                  >
                    <span className="mt-0.5 shrink-0 font-mono-ui text-[0.6rem] tracking-[0.15em] opacity-60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      {stage === 2 ? (
                        <>
                          <span className="font-bold text-alarm-600 underline decoration-alarm-600/60 underline-offset-4">
                            {sentence[0]}
                          </span>
                          {sentence.slice(1)}
                        </>
                      ) : (
                        sentence
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {stage === 1 ? (
              <div className="mt-5 flex justify-end">
                <div className="paper-note -rotate-1 rounded-sm px-4 py-3">
                  <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                    Margin note · Red pen
                  </p>
                  <p className="mt-1 font-mono-ui text-xs uppercase tracking-[0.18em] sm:text-sm">
                    “The warning hides in the first word of every change.”
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-unlock mt-5 flex flex-col gap-5">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] text-alarm-400">
                    The first letters confessed —
                  </p>
                  <p className="sr-only">The first letters spell: don’t push.</p>
                  <LetterChips chars={WARNING_CHARS} tone="alarm" />
                </div>
                <div className="hazard-stripes h-1 opacity-70" aria-hidden="true" />
                <div className="flex justify-end">
                  <div className="paper-note rotate-1 rounded-sm px-4 py-3">
                    <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                      Second note · Folded into the draft
                    </p>
                    <p className="mt-1 font-mono-ui text-xs uppercase tracking-[0.18em] sm:text-sm">
                      “A coder’s secret is written at the end of every line he
                      signs.”
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-concrete-300">
              {clue.question}
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-3 flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="answer" className="sr-only">
                {clue.question}
              </label>
              <input
                id="answer"
                type="text"
                autoComplete="off"
                spellCheck="false"
                placeholder="Type the hidden message…"
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
                {clue.button}
              </button>
            </form>

            <div aria-live="polite" className="mt-4 min-h-6">
              {feedback?.type === 'wrong' && (
                <p className="flex items-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-alarm-400">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-alarm-400" />
                  {feedback.text} (rejected {attempts[stage]})
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
