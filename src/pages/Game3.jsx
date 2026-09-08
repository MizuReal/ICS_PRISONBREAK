import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, KeyIcon, LockIcon } from '../components/icons'
import { useProgress } from '../state/progress-context'

const GATES = [
  { id: 'AND', fn: (a, b) => (a && b ? 1 : 0) },
  { id: 'OR', fn: (a, b) => (a || b ? 1 : 0) },
  { id: 'NAND', fn: (a, b) => (a && b ? 0 : 1) },
  { id: 'NOR', fn: (a, b) => (a || b ? 0 : 1) },
  { id: 'XOR', fn: (a, b) => (a === b ? 0 : 1) },
  { id: 'XNOR', fn: (a, b) => (a === b ? 1 : 0) },
]

const ROWS = [
  { a: 0, b: 0, want: 0 },
  { a: 0, b: 1, want: 0 },
  { a: 1, b: 0, want: 1 },
  { a: 1, b: 1, want: 0 },
]

function upOrDown(v) {
  return v ? 'UP' : 'DOWN'
}

function ValuePill({ value }) {
  return (
    <span
      className={`inline-flex min-w-6 items-center justify-center rounded-sm border px-1.5 py-0.5 font-mono-ui text-[0.65rem] ${
        value
          ? 'border-jumpsuit-500/60 bg-jumpsuit-500/10 text-jumpsuit-300'
          : 'border-concrete-700 bg-concrete-900 text-concrete-600'
      }`}
    >
      {value}
    </span>
  )
}

function GateCard({ name, typeId, caption, onCycle, ariaLabel }) {
  const gate = GATES[typeId]
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={ariaLabel}
      className="mx-auto flex w-full max-w-[13rem] flex-col items-center gap-1 rounded-sm border border-jumpsuit-500/60 bg-jumpsuit-500/10 px-6 py-3 transition-colors hover:border-jumpsuit-400 hover:bg-jumpsuit-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
    >
      <span className="font-mono-ui text-[0.55rem] uppercase tracking-[0.3em] text-concrete-500">
        {name}
      </span>
      <span className="font-display text-3xl tracking-[0.2em] text-jumpsuit-300">
        {gate.id}
      </span>
      <span className="flex items-center gap-1.5 font-mono-ui text-[0.6rem] uppercase tracking-[0.15em] text-concrete-400">
        {caption}
      </span>
      <span className="font-mono-ui text-[0.5rem] uppercase tracking-[0.3em] text-concrete-600">
        Tap to change its rule
      </span>
    </button>
  )
}

export default function Game3() {
  const { isDone, markDone } = useProgress()
  const [g1, setG1] = useState(1)
  const [g2, setG2] = useState(1)
  const [swA, setSwA] = useState(false)
  const [swB, setSwB] = useState(false)
  const [runs, setRuns] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [shakeTick, setShakeTick] = useState(0)
  const runRef = useRef(null)
  const solved = isDone('game3')

  const a = swA ? 1 : 0
  const b = swB ? 1 : 0
  const out1 = GATES[g1].fn(a, b)
  const led = GATES[g2].fn(out1, a)

  useEffect(() => {
    if (shakeTick > 0) runRef.current?.focus()
  }, [shakeTick])

  function runTest() {
    const fails = ROWS.filter((row) => {
      const o1 = GATES[g1].fn(row.a, row.b)
      const out = GATES[g2].fn(o1, row.a)
      return out !== row.want
    })
    if (fails.length === 0) {
      markDone('game3')
      setFeedback(null)
      return
    }
    setRuns((n) => n + 1)
    setFeedback({
      lines: fails.map((row) => {
        const o1 = GATES[g1].fn(row.a, row.b)
        const out = GATES[g2].fn(o1, row.a)
        const flip = `A ${upOrDown(row.a)} · B ${upOrDown(row.b)}`
        return out
          ? `${flip} → must stay LOCKED, swings OPEN`
          : `${flip} → must OPEN, stays LOCKED`
      }),
    })
    setShakeTick((t) => t + 1)
  }

  function resetChips() {
    setG1(1)
    setG2(1)
    setFeedback(null)
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
            Game 03 · Puzzle
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            THE ACCESS POLICY
          </h1>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-jumpsuit-500/50 bg-jumpsuit-500/10 font-display text-2xl text-jumpsuit-400">
          03
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
            DOOR 03 SLIDES OPEN
          </h2>
          <p className="mx-auto mt-6 inline-flex items-center gap-2 border border-hazard/50 bg-hazard/10 px-4 py-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-hazard">
            <span className="inline-block h-2 w-2 rounded-full bg-hazard" />
            Policy test — 4 of 4 states pass
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-concrete-300">
            The rule engine accepts the new policy and the solenoid under the
            bench fires. Behind the module panel sits the third key — same
            coder, same hiding spots. Three keys in your pocket. One door to
            go.
          </p>
          <p className="mt-4 font-mono-ui text-[0.65rem] uppercase tracking-[0.25em] text-concrete-400">
            Failed runs: {runs}
            {runs === 0
              ? ' — clean pass, first compile'
              : runs === 1
                ? ' — one misconfig'
                : ' — the warden is recompiling, inmate'}
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
              to="/game/4"
              className="inline-flex items-center gap-2 border border-concrete-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400"
            >
              Game 04 · Take it
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : (
        <div key={shakeTick} className={feedback ? 'animate-shake' : ''}>
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
              Policy engine · Door 03 module
            </p>
            <div className="paper-note mt-4 rounded-sm px-5 py-6 sm:px-8 sm:py-8">
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                Spec sheet · Pinned above the switch bench
              </p>
              <p className="mt-4 font-display text-xl tracking-[0.12em]">
                THE JOB
              </p>
              <p className="mt-1 text-base leading-relaxed sm:text-lg">
                Door 03 opens for exactly one switch pattern — the other three
                stay locked:
              </p>
              <div className="mt-2 space-y-0.5 font-mono-ui text-[0.7rem] uppercase tracking-[0.12em]">
                <p className="text-center opacity-80">A down · B down → locked</p>
                <p className="text-center opacity-80">A down · B up → locked</p>
                <p className="text-center font-bold">
                  A up · B down → open ← this one
                </p>
                <p className="text-center opacity-80">A up · B up → locked</p>
              </div>
              <p className="mt-4 font-display text-xl tracking-[0.12em]">
                THE CHIPS
              </p>
              <p className="mt-1 text-base leading-relaxed sm:text-lg">
                Two chips sit between the switches and the door:
              </p>
              <p className="mt-2 text-center font-mono-ui text-[0.7rem] uppercase tracking-[0.12em] opacity-80">
                A + B → chip 1 → answer → chip 2 → door 03
              </p>
              <p className="mt-2 text-base leading-relaxed sm:text-lg">
                Tap a chip to cycle its rule — the name on it (AND, OR, NAND,
                NOR, XOR, XNOR) is the rule. Plain words: cheat sheet below.
              </p>
              <p className="mt-4 font-display text-xl tracking-[0.12em]">
                WHAT TO DO
              </p>
              <ol className="mt-2 list-decimal space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
                <li>
                  Tap chip 1 until it says <strong>NAND</strong>. Tap chip 2
                  until it says <strong>AND</strong>. (Hint: that pair is the
                  answer — NAND fails only when both A and B are up; AND
                  passes only when both its inputs are up.)
                </li>
                <li>
                  Flip switches A and B below — the door must show OPEN only
                  for A up · B down, and LOCKED for the other three patterns.
                </li>
                <li>
                  When all four match, press RUN THE POLICY TEST. It checks
                  all four at once — a pass opens door 03.
                </li>
              </ol>
              <p className="mt-3 font-mono-ui text-[0.65rem] uppercase tracking-[0.15em] opacity-70">
                Down = 0 = no · Up = 1 = yes
              </p>
            </div>

            <div className="mx-auto mt-6 w-full max-w-md overflow-hidden rounded-sm border border-concrete-600 bg-concrete-950 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.45)] sm:p-5">
              <div className="flex items-center justify-between border-b border-concrete-700 pb-2 font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-500">
                <span>Policy bench</span>
                <span>1 = up · 0 = down</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { name: 'Switch A', up: swA, flip: () => setSwA((v) => !v) },
                  { name: 'Switch B', up: swB, flip: () => setSwB((v) => !v) },
                ].map((sw) => (
                  <button
                    key={sw.name}
                    type="button"
                    aria-pressed={sw.up}
                    onClick={() => {
                      sw.flip()
                      setFeedback(null)
                    }}
                    className="flex items-center justify-between gap-2 rounded-sm border border-concrete-600 bg-concrete-900 px-3 py-2.5 font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] transition-colors hover:border-jumpsuit-500/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-950"
                  >
                    <span className="text-concrete-200">{sw.name}</span>
                    <span
                      className={`flex h-5 w-9 items-center rounded-full border px-0.5 transition-colors ${
                        sw.up
                          ? 'justify-end border-jumpsuit-500 bg-jumpsuit-500/20'
                          : 'justify-start border-concrete-600 bg-concrete-800'
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full ${
                          sw.up ? 'bg-jumpsuit-400' : 'bg-concrete-500'
                        }`}
                      />
                    </span>
                    <span
                      className={
                        sw.up ? 'text-jumpsuit-300' : 'text-concrete-500'
                      }
                    >
                      {sw.up ? 'UP' : 'DOWN'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <div className="my-3 flex items-center gap-2 font-mono-ui text-[0.6rem] uppercase tracking-[0.15em] text-concrete-400">
                  <ValuePill value={a} />
                  <span className="text-concrete-600">A</span>
                  <ValuePill value={b} />
                  <span className="text-concrete-600">B</span>
                  <span className="text-concrete-500">feed chip 1</span>
                </div>
                <div className="h-4 w-px bg-concrete-700" aria-hidden="true" />

                <GateCard
                  name="First chip"
                  typeId={g1}
                  caption={
                    <>
                      <ValuePill value={out1} /> answer
                    </>
                  }
                  onCycle={() => {
                    setG1((i) => (i + 1) % GATES.length)
                    setFeedback(null)
                  }}
                  ariaLabel={`First chip — its rule is ${GATES[g1].id}. Press to change the rule.`}
                />

                <div className="my-3 flex items-center gap-2 font-mono-ui text-[0.6rem] uppercase tracking-[0.15em] text-concrete-400">
                  <ValuePill value={out1} />
                  <span className="text-concrete-600">answer</span>
                  <ValuePill value={a} />
                  <span className="text-concrete-600">A</span>
                  <span className="text-concrete-500">feed chip 2</span>
                </div>
                <div className="h-4 w-px bg-concrete-700" aria-hidden="true" />

                <GateCard
                  name="Second chip"
                  typeId={g2}
                  caption={
                    <>
                      <ValuePill value={led} /> door
                    </>
                  }
                  onCycle={() => {
                    setG2((i) => (i + 1) % GATES.length)
                    setFeedback(null)
                  }}
                  ariaLabel={`Second chip — its rule is ${GATES[g2].id}. Press to change the rule.`}
                />

                <div className="h-4 w-px bg-concrete-700" aria-hidden="true" />

                <div
                  className={`flex w-full max-w-[13rem] items-center justify-center gap-2 border px-4 py-3 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] ${
                    led
                      ? 'border-hazard/60 bg-hazard/10 text-hazard'
                      : 'border-concrete-600 bg-concrete-900 text-concrete-400'
                  }`}
                  aria-label={`Door 03 is currently ${led ? 'open' : 'locked'}`}
                >
                  {led ? (
                    <span
                      className="inline-block h-2 w-2 animate-pulse rounded-full bg-hazard"
                      aria-hidden="true"
                    />
                  ) : (
                    <LockIcon className="h-4 w-4" />
                  )}
                  Door 03 · {led ? 'OPEN' : 'LOCKED'}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-4 w-full max-w-md rounded-sm border border-concrete-700 bg-concrete-900/80 px-4 py-3">
              <div className="flex items-center justify-between font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-500">
                <span>Chip cheat sheet</span>
                <span>Sharpie on the bench</span>
              </div>
              <ul className="mt-2 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                <li className="font-mono-ui text-[0.65rem] uppercase tracking-[0.08em] text-concrete-300">
                  <span className="text-jumpsuit-300">AND</span> — passes if both
                  are up
                </li>
                <li className="font-mono-ui text-[0.65rem] uppercase tracking-[0.08em] text-concrete-300">
                  <span className="text-jumpsuit-300">OR</span> — passes if
                  either is up
                </li>
                <li className="font-mono-ui text-[0.65rem] uppercase tracking-[0.08em] text-concrete-300">
                  <span className="text-jumpsuit-300">NAND</span> — fails if both
                  are up
                </li>
                <li className="font-mono-ui text-[0.65rem] uppercase tracking-[0.08em] text-concrete-300">
                  <span className="text-jumpsuit-300">NOR</span> — fails if
                  either is up
                </li>
                <li className="font-mono-ui text-[0.65rem] uppercase tracking-[0.08em] text-concrete-300">
                  <span className="text-jumpsuit-300">XOR</span> — passes if the
                  inputs differ
                </li>
                <li className="font-mono-ui text-[0.65rem] uppercase tracking-[0.08em] text-concrete-300">
                  <span className="text-jumpsuit-300">XNOR</span> — passes if the
                  inputs agree
                </li>
              </ul>
              <p className="mt-2 font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] text-concrete-500">
                Tap a chip to change its rule — passes means it answers 1
              </p>
            </div>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                ref={runRef}
                type="button"
                onClick={runTest}
                className="bg-jumpsuit-500 px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-950 transition-colors hover:bg-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
              >
                Run the policy test
              </button>
              <button
                type="button"
                onClick={resetChips}
                className="border border-concrete-500 px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
              >
                Reset chips
              </button>
            </div>

            <div aria-live="polite" className="mt-5">
              {feedback && (
                <div className="rounded-sm border border-alarm-500/50 bg-alarm-500/5 px-4 py-3">
                  <p className="flex items-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-alarm-400">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-alarm-400" />
                    Policy test failed — {feedback.lines.length} of 4 states
                    violate the spec (run {runs})
                  </p>
                  <ul className="mt-2 space-y-1">
                    {feedback.lines.map((line) => (
                      <li
                        key={line}
                        className="font-mono-ui text-[0.65rem] uppercase tracking-[0.15em] text-alarm-400/90"
                      >
                        · {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
