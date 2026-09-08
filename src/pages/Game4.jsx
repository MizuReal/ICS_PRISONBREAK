import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, KeyIcon } from '../components/icons'
import { useProgress } from '../state/progress-context'

const PLAINTEXT = 'GATE CODE: SYSADMIN'
const CIPHERTEXT =
  '0011010000110101001100110011000000110101001100110011010000111000001101000011010100110100001101100011010001100110001101010011000100110100001101110011001100110000001101000011010100110101001100110011010000110010001101110011011000110100011001100011010000110111001101000110000100110100001110010011010000110001001101000110011000110100001101010011010100110010001100110011000100110101001101110011010000110111001101110011010000110011011001000011001101100100'

function normalizeAnswer(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/^(a|an|the)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function rot13(s) {
  return s.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base)
  })
}

function isPrintable(s) {
  return s.split('').every((ch) => {
    const code = ch.charCodeAt(0)
    return code >= 32 && code <= 126
  })
}

function hexToText(s) {
  if (!/^(?:[0-9a-f]{2})*$/.test(s)) return null
  const out = s
    .match(/.{2}/g)
    .map((p) => String.fromCharCode(parseInt(p, 16)))
    .join('')
  return isPrintable(out) ? out : null
}

function binToText(s) {
  if (!/^[01]+$/.test(s) || s.length % 8 !== 0) return null
  const out = s
    .match(/.{8}/g)
    .map((p) => String.fromCharCode(parseInt(p, 2)))
    .join('')
  return isPrintable(out) ? out : null
}

function b64ToText(s) {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s) || s.length % 4 !== 0) return null
  try {
    const out = atob(s)
    return isPrintable(out) ? out : null
  } catch {
    return null
  }
}

const TOOLS = [
  {
    id: 'bin',
    name: 'BIN → TXT',
    eats: 'a clean run of 0s and 1s, eight bits at a time',
    run: binToText,
  },
  {
    id: 'hex',
    name: 'HEX → TXT',
    eats: 'clean pairs of digits and A through F',
    run: hexToText,
  },
  { id: 'rot', name: 'ROT13', eats: 'letters', run: rot13 },
  {
    id: 'b64',
    name: 'B64 → TXT',
    eats: 'base64 — letters, digits, + and /, an = on the end',
    run: b64ToText,
  },
]

export default function Game4() {
  const { isDone, markDone } = useProgress()
  const [steps, setSteps] = useState(() => [{ text: CIPHERTEXT, name: null }])
  const [stage, setStage] = useState(1)
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [shakeTick, setShakeTick] = useState(0)
  const loginRef = useRef(null)
  const solved = isDone('game4')
  const buffer = steps[steps.length - 1].text

  useEffect(() => {
    if (shakeTick > 0) loginRef.current?.focus()
  }, [shakeTick])

  function runTool(tool) {
    const out = tool.run(buffer)
    if (out === null || !isPrintable(out)) {
      setFeedback({
        type: 'choke',
        text: `Module choked — nothing here looks like ${tool.eats}.`,
      })
      return
    }
    setFeedback(null)
    if (out === PLAINTEXT) {
      setStage(2)
    } else {
      setSteps((prev) => [...prev, { text: out, name: tool.name }])
    }
  }

  function rewind() {
    if (steps.length > 1) {
      setSteps((prev) => prev.slice(0, -1))
      setFeedback(null)
    }
  }

  function resetFile() {
    setSteps([{ text: CIPHERTEXT, name: null }])
    setFeedback(null)
  }

  function handleLogin(e) {
    e.preventDefault()
    const answer = normalizeAnswer(value)
    if (!answer) {
      setFeedback({ type: 'empty', text: 'You have to type something, inmate.' })
      return
    }
    if (answer === 'sysadmin') {
      markDone('game4')
      setFeedback(null)
      return
    }
    setAttempts((n) => n + 1)
    setFeedback({ type: 'wrong', text: 'Access denied — wrong password, inmate.' })
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
            Game 04 · Puzzle
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            THE DATA TUNNEL
          </h1>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-jumpsuit-500/50 bg-jumpsuit-500/10 font-display text-2xl text-jumpsuit-400">
          04
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
            DOOR 04 SLIDES OPEN
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-concrete-300">
            You log in as root and door 04 rolls open. Taped behind the
            monitor: the fourth key, left by a night-shift coder who quit in
            protest. Four keys in your pocket. The yard gate is waiting.
          </p>
          <p className="mt-4 font-mono-ui text-[0.65rem] uppercase tracking-[0.25em] text-concrete-400">
            Wrong logins: {attempts}
            {attempts === 0
              ? ' — first try, root access'
              : attempts === 1
                ? ' — one wrong guess'
                : ' — the warden is laughing, inmate'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/escape"
              className="inline-flex items-center gap-2 bg-hazard px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-950 transition-colors hover:bg-hazard-300"
            >
              <KeyIcon className="h-4 w-4" />
              Take the escape gate
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-concrete-500 px-5 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to cell block
            </Link>
          </div>
        </section>
      ) : (
        <div key={shakeTick} className={feedback?.type === 'wrong' ? 'animate-shake' : ''}>
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
              Boiler room workstation · Root access revoked
            </p>
            <div className="paper-note mt-4 rounded-sm px-5 py-6 sm:px-8 sm:py-8">
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                Pinned above the monitor · A rumor, plus fingerprints
              </p>
              <p className="mt-3 text-base leading-relaxed sm:text-lg">
                The yard rumor was right. There is a tunnel under the wall — it
                just runs on zeroes and ones, straight into the gate app.
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-concrete-950/25 pt-3 font-mono-ui text-[0.7rem] uppercase tracking-[0.12em] sm:text-xs">
                <li>Base64 — letters and digits, + and /, an = on the end</li>
                <li>Hex — clean pairs of digits and A through F</li>
                <li>Binary — nothing but 0 and 1, eight bits at a time</li>
                <li>Rot13 — letters swapped halfway. Twice is plaintext.</li>
              </ul>
              <p className="mt-3 font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-70">
                Modules only eat what they recognize — the warden loves 13.
              </p>
            </div>

            {stage === 1 ? (
              <>
                <div className="mt-6 overflow-hidden rounded-sm border border-concrete-600 bg-concrete-950 shadow-[0_14px_30px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between border-b border-concrete-700 bg-concrete-800/80 px-4 py-2">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-alarm-500" />
                      <span className="h-2 w-2 rounded-full bg-hazard" />
                      <span className="h-2 w-2 rounded-full bg-concrete-500" />
                    </div>
                    <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-400">
                      gate.txt — raw payload
                    </p>
                  </div>
                  <pre
                    className="max-h-52 min-h-24 overflow-y-auto whitespace-pre-wrap break-all px-4 py-3 font-mono-ui text-xs leading-relaxed text-concrete-200 sm:max-h-64 sm:text-sm"
                    aria-label="Current file payload"
                  >
                    {buffer}
                  </pre>
                  <div className="flex items-center justify-between gap-3 border-t border-concrete-700 bg-concrete-800/40 px-4 py-2">
                    <p className="min-w-0 truncate font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] text-concrete-500">
                      {steps.length > 1
                        ? `modules applied: ${steps
                            .slice(1)
                            .map((s) => s.name)
                            .join(' · ')}`
                        : 'no modules applied yet'}
                    </p>
                    <p className="shrink-0 font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] text-concrete-500">
                      {buffer.length} chars
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => runTool(tool)}
                      className="border border-jumpsuit-500/60 bg-jumpsuit-500/10 px-4 py-2.5 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.2em] text-jumpsuit-300 transition-colors hover:bg-jumpsuit-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={rewind}
                    disabled={steps.length <= 1}
                    className="border border-concrete-500 px-4 py-2 font-mono-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Rewind
                  </button>
                  <button
                    type="button"
                    onClick={resetFile}
                    className="border border-concrete-500 px-4 py-2 font-mono-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
                  >
                    Reset file
                  </button>
                </div>
                <p className="mt-4 text-center font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-500">
                  Rewind is free — only the login counts against you
                </p>
              </>
            ) : (
              <div className="animate-unlock mt-6 flex flex-col gap-5">
                <div className="overflow-hidden rounded-sm border border-hazard/60 bg-concrete-950">
                  <div className="flex items-center justify-between border-b border-concrete-700 bg-concrete-800/80 px-4 py-2">
                    <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-hazard">
                      File decrypted
                    </p>
                    <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-500">
                      gate.txt — clean
                    </p>
                  </div>
                  <div className="space-y-1 px-4 py-3 font-mono-ui text-xs leading-relaxed sm:text-sm">
                    <p className="text-concrete-500">$ gate --decrypt</p>
                    <p className="text-concrete-300">
                      &gt; payload decrypted — the file reads clean
                    </p>
                    <p className="text-hazard">&gt; {PLAINTEXT}</p>
                    <p className="animate-pulse text-concrete-300">▮</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-sm border border-concrete-700 bg-concrete-950/60 px-4 py-5">
                  <p className="text-center font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-concrete-300">
                    The gate app waits at a login prompt — what is the gate
                    code?
                  </p>
                  <form
                    onSubmit={handleLogin}
                    className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                  >
                    <label htmlFor="gate-code" className="sr-only">
                      Gate code
                    </label>
                    <input
                      ref={loginRef}
                      id="gate-code"
                      type="text"
                      autoComplete="off"
                      spellCheck="false"
                      placeholder="warden@gate: ~$ "
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value)
                        if (feedback) setFeedback(null)
                      }}
                      className={`min-w-0 flex-1 rounded-sm border bg-concrete-950/80 px-4 py-3 font-mono-ui text-base text-concrete-100 placeholder:text-concrete-600 focus:outline-none focus:ring-2 focus:ring-jumpsuit-500 ${
                        feedback?.type === 'wrong'
                          ? 'animate-denied border-alarm-500'
                          : 'border-concrete-600 focus:border-jumpsuit-500'
                      }`}
                    />
                    <button
                      type="submit"
                      className="bg-jumpsuit-500 px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-950 transition-colors hover:bg-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-900"
                    >
                      Open door 04
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div aria-live="polite" className="mt-4 min-h-6 text-center">
              {feedback?.type === 'choke' && (
                <p className="flex items-center justify-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-alarm-400">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-alarm-400" />
                  {feedback.text}
                </p>
              )}
              {feedback?.type === 'wrong' && (
                <p className="flex items-center justify-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-alarm-400">
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
