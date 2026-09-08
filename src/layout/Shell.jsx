import { Link, Outlet } from 'react-router-dom'
import { BarsIcon } from '../components/icons'
import ProgressWarningToast from '../components/ProgressWarningToast'

export default function Shell() {
  return (
    <div className="wall flex min-h-svh flex-col font-body text-concrete-100">
      <div className="prison-bars pointer-events-none fixed inset-0" aria-hidden="true" />

      <header className="relative z-10">
        <div className="hazard-stripes h-2" aria-hidden="true" />
        <div className="border-b border-concrete-700/80 bg-concrete-950/70 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              to="/"
              className="group flex items-center gap-3 font-display text-2xl tracking-[0.18em] text-concrete-100 transition-colors hover:text-jumpsuit-400"
            >
              <BarsIcon className="h-6 w-6 text-jumpsuit-500 transition-transform group-hover:-rotate-6" />
              <span>
                PRISON&nbsp;BREAK
                <span className="block text-[0.5rem] font-body tracking-[0.3em] text-concrete-400 group-hover:text-jumpsuit-300">
                  ICS D-BLOCK FACILITY
                </span>
              </span>
            </Link>
            <span className="hidden font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-concrete-500 sm:block">
              Guard&nbsp;post&nbsp;03 · Lights&nbsp;on&nbsp;24/7
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>

      <footer className="relative z-10">
        <div className="border-t border-concrete-700/80 bg-concrete-950/70">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-[0.65rem] font-mono-ui uppercase tracking-[0.22em] text-concrete-500 sm:px-6">
            <span>Escape attempt 1 of 4</span>
            <span>No snitching · No keys on the outside</span>
          </div>
        </div>
        <div className="hazard-stripes h-2" aria-hidden="true" />
      </footer>

      <ProgressWarningToast />
    </div>
  )
}
