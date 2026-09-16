export default function NoticeDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 border border-concrete-950/30 bg-concrete-950/5 px-3.5 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-jumpsuit-700" />
      <div className="min-w-0">
        <p className="font-mono-ui text-[0.55rem] uppercase tracking-[0.3em] opacity-60">
          {label}
        </p>
        <p className="mt-1 font-mono-ui text-[0.7rem] font-bold uppercase tracking-[0.15em]">
          {value}
        </p>
      </div>
    </div>
  )
}
