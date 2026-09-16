export default function NoticePoster({
  noticeNum,
  meta = 'ICS D-Block facility · Official notice',
  children,
}) {
  return (
    <div className="paper-note relative break-inside-avoid rounded-sm px-5 py-8 sm:px-10 sm:py-12">
      <div
        className="tape absolute -top-3 left-8 h-6 w-24 -rotate-6 rounded-sm"
        aria-hidden="true"
      />
      <div
        className="tape absolute -top-3 right-8 h-6 w-24 rotate-3 rounded-sm"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 font-mono-ui text-[0.55rem] uppercase tracking-[0.3em] opacity-60">
        <span>{meta}</span>
        <span>Notice Nº {noticeNum}</span>
      </div>

      {children}
    </div>
  )
}
