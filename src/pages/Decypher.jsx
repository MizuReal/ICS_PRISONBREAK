import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/icons'

const HEX_CHART = Array.from({ length: 26 }, (_, i) => {
  const code = 65 + i
  return { letter: String.fromCharCode(code), hex: code.toString(16).toUpperCase() }
})

function wordToHex(word) {
  return [...word]
    .map((ch) => (ch === ' ' ? '20' : ch.charCodeAt(0).toString(16).toUpperCase()))
    .join(' ')
}

export default function Decypher() {
  const [word, setWord] = useState('')

  const hex = wordToHex(word)

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
            Utility · The cipher desk
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-[0.1em] sm:text-5xl">
            THE CIPHER MANUAL
          </h1>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-jumpsuit-500/50 bg-jumpsuit-500/10 font-display text-xl tracking-wider text-jumpsuit-400 sm:text-2xl">
          A–Z
        </span>
      </header>

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
          Crib sheet · Filched from the warden’s logbook
        </p>
        <div className="paper-note mt-4 rounded-sm px-5 py-6 sm:px-8 sm:py-8">
          <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
            Rule #1 — no talking in code on the yard
          </p>
          <p className="mt-3 text-base leading-relaxed sm:text-lg">
            Decipher the hidden code, complete what remains, and unlock your
            path to freedom.
          </p>
          <p className="mt-3 font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] opacity-70">
            Tip: spaces read as 20 — ROOT MODE prints 52 4F 4F 54 20 4D 4F 44
            45
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono-ui text-[0.65rem] uppercase tracking-[0.3em] text-jumpsuit-400">
              The alphabet in hex
            </p>
            <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] text-concrete-500">
              Reading it backwards works too
            </p>
          </div>
          <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {HEX_CHART.map(({ letter, hex: code }) => (
              <li
                key={letter}
                className="flex flex-col items-center rounded-sm border border-concrete-700 bg-concrete-950/80 px-1 py-2"
              >
                <span className="font-display text-xl leading-none text-jumpsuit-400 sm:text-2xl">
                  {letter}
                </span>
                <span className="mt-1.5 font-mono-ui text-[0.6rem] tracking-[0.15em] text-concrete-400 sm:text-[0.65rem]">
                  {code}
                </span>
              </li>
            ))}
            <li
              key="space"
              className="flex flex-col items-center rounded-sm border border-dashed border-concrete-600 bg-concrete-950/40 px-1 py-2"
            >
              <span className="font-display text-sm leading-none tracking-[0.2em] text-concrete-300 sm:text-base">
                SP
              </span>
              <span className="mt-1.5 font-mono-ui text-[0.6rem] tracking-[0.15em] text-concrete-500 sm:text-[0.65rem]">
                20
              </span>
            </li>
          </ul>
        </div>

        <div className="hazard-stripes mt-8 h-1 opacity-70" aria-hidden="true" />

        <div className="mt-8">
          <p className="font-mono-ui text-[0.65rem] uppercase tracking-[0.3em] text-jumpsuit-400">
            The printer — word in, hex out
          </p>
          <form className="mt-3" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="word" className="sr-only">
              Word to print in hex
            </label>
            <input
              id="word"
              type="text"
              autoComplete="off"
              spellCheck="false"
              placeholder="Type a word, inmate…"
              value={word}
              onChange={(e) =>
                setWord(
                  e.target.value.toUpperCase().replace(/[^A-Z ]/g, '')
                )
              }
              className="w-full rounded-sm border border-concrete-600 bg-concrete-950/80 px-4 py-3 font-mono-ui text-base uppercase tracking-[0.15em] text-concrete-100 placeholder:text-concrete-600 focus:outline-none focus:ring-2 focus:ring-jumpsuit-500"
            />
          </form>

          <div className="mt-4 overflow-hidden rounded-sm border border-concrete-600 bg-concrete-950 shadow-[0_14px_30px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-concrete-700 bg-concrete-800/80 px-4 py-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-alarm-500" />
                <span className="h-2 w-2 rounded-full bg-hazard" />
                <span className="h-2 w-2 rounded-full bg-concrete-500" />
              </div>
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.25em] text-concrete-400">
                desk output — hex stream
              </p>
            </div>
            <p
              aria-live="polite"
              className="min-h-14 whitespace-pre-wrap break-all px-4 py-3 font-mono-ui text-sm leading-relaxed text-hazard sm:min-h-16"
            >
              {word
                ? hex
                : '… waiting on a word, inmate'}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-concrete-700 bg-concrete-800/40 px-4 py-2">
              <p className="shrink-0 font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] text-concrete-500">
                {word.length} chars → {word.length} bytes
              </p>
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] text-concrete-500">
                ASCII · spaces = 20
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
