import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  PinIcon,
  PrinterIcon,
  StarIcon,
} from '../components/icons'
import NoticeDetail from '../components/NoticeDetail'
import NoticePoster from '../components/NoticePoster'
import { event, getSpeaker } from '../data/invite'

export default function SpeakerInvite() {
  const { slug } = useParams()
  const speaker = getSpeaker(slug)

  if (!speaker) {
    return <Navigate to="/invite" replace />
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 sm:gap-10">
      <nav aria-label="Breadcrumb" className="print:hidden">
        <Link
          to="/invite"
          className="inline-flex items-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.25em] text-concrete-400 transition-colors hover:text-jumpsuit-400"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to the notice
        </Link>
      </nav>

      <section aria-label={`Invitation for ${speaker.name}`}>
        <NoticePoster
          noticeNum={speaker.inviteCode}
          meta="ICS D-Block facility · Confidential summons"
        >
          <p className="mt-7 text-center font-mono-ui text-[0.65rem] uppercase tracking-[0.45em] opacity-70">
            By order of the warden
          </p>
          <h1 className="mt-2 text-center font-display text-[clamp(3.6rem,16vw,7.5rem)] leading-[0.85] tracking-[0.06em]">
            {event.title}
          </h1>
          <p className="mt-4 text-center font-mono-ui text-[0.65rem] font-bold uppercase tracking-[0.3em]">
            {event.inviteLine}
          </p>
          <p className="mx-auto mt-2 max-w-lg text-center font-display text-[clamp(1.7rem,6vw,2.7rem)] leading-[1.05] tracking-[0.07em]">
            {event.name}
          </p>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-stretch">
            <div className="relative mx-auto w-44 shrink-0 overflow-hidden rounded-sm border-2 border-concrete-950/70 bg-concrete-900 sm:mx-0 sm:w-52">
              <img
                src={speaker.photo}
                alt={`Wanted portrait of ${speaker.name}`}
                className="mugshot-photo aspect-[3/4] w-full object-cover object-top"
              />
              <div
                className="mugshot-lines pointer-events-none absolute inset-0 opacity-15"
                aria-hidden="true"
              />
              <span className="absolute left-2 top-2 border border-concrete-100/60 bg-concrete-950/75 px-2 py-1 font-mono-ui text-[0.55rem] uppercase tracking-[0.25em] text-concrete-100">
                File {speaker.num}
              </span>
            </div>

            <div className="min-w-0 flex-1 border border-concrete-950/30 bg-concrete-950/5 px-4 py-4">
              <p className="font-mono-ui text-[0.55rem] uppercase tracking-[0.3em] opacity-60">
                To · {speaker.aka}
              </p>
              <p className="mt-2 font-display text-3xl leading-none tracking-[0.06em] sm:text-4xl">
                {speaker.name}
              </p>
              <p className="mt-3 font-mono-ui text-[0.6rem] uppercase tracking-[0.2em] opacity-80">
                {speaker.role}
              </p>
              <div className="mt-4 border-t border-concrete-950/25 pt-3">
                <p className="font-mono-ui text-[0.55rem] uppercase tracking-[0.3em] opacity-60">
                  Wanted for
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug">
                  {speaker.wantedFor}
                </p>
                <p className="mt-3 font-mono-ui text-[0.55rem] uppercase tracking-[0.3em] opacity-60">
                  Speaking on
                </p>
                <p className="mt-1 font-display text-xl leading-none tracking-[0.05em]">
                  {speaker.topic}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-xl space-y-3 text-center text-sm leading-relaxed sm:text-base">
            <p>
              {speaker.name} is hereby summoned to the yard for the{' '}
              {event.name.toLowerCase()} briefing — not as an inmate, but as
              the one who breaks the rest of us out.
            </p>
            <p>{speaker.personalNote}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <NoticeDetail
              icon={CalendarIcon}
              label="Report date"
              value={event.date}
            />
            <NoticeDetail icon={ClockIcon} label="Yard call" value={event.time} />
            <NoticeDetail
              icon={PinIcon}
              label="Meeting point"
              value={event.venue}
            />
            <NoticeDetail icon={StarIcon} label="Roll call" value={event.rsvp} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-concrete-950/25 pt-5">
            <div>
              <p className="font-mono-ui text-[0.6rem] uppercase tracking-[0.22em] opacity-70">
                {event.deadline}
              </p>
              <p className="mt-1 font-mono-ui text-[0.55rem] uppercase tracking-[0.25em] opacity-60">
                Signed · The Warden
              </p>
            </div>
            <span className="rotate-[-7deg] border-2 border-concrete-950/70 px-3 py-1 font-display text-lg tracking-[0.18em] opacity-80">
              OFFICIALLY INVITED
            </span>
          </div>
        </NoticePoster>
      </section>

      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-center">
        <a
          href={speaker.rsvpUrl}
          className="inline-flex items-center justify-center gap-2 bg-jumpsuit-500 px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-950 transition-colors hover:bg-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-950"
        >
          Accept the summons
          <ArrowRightIcon className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 border border-concrete-500 px-6 py-3 font-mono-ui text-[0.75rem] font-bold uppercase tracking-[0.25em] text-concrete-200 transition-colors hover:border-jumpsuit-500 hover:text-jumpsuit-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-jumpsuit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-concrete-950"
        >
          <PrinterIcon className="h-4 w-4" />
          Print the notice
        </button>
      </div>

      <p className="text-center font-mono-ui text-[0.6rem] uppercase tracking-[0.3em] text-concrete-500">
        Invitation Nº {speaker.inviteCode} · Non-transferable · Tell no one —
        bring everyone
      </p>
    </div>
  )
}
