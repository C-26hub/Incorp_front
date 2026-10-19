const styles = {
  Online: { wrap: 'bg-[#e6f8f0] text-[#0a9f63]', dot: 'bg-[#10c77b]' },
  Beta: { wrap: 'bg-[#fff3e0] text-[#d97706]', dot: 'bg-[#f59e0b]' },
}

export default function StatusBadge({ status }) {
  const s = styles[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}