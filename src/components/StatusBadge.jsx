const styles = {
  Online: { wrap: 'bg-[#e6f8f0] text-[#0a9f63]', dot: 'bg-[#10c77b]' },
  Beta: { wrap: 'bg-[#fff3e0] text-[#d97706]', dot: 'bg-[#f59e0b]' },
  'Em breve': { wrap: 'bg-[#eeeff6] text-[#6b7080]', dot: 'bg-[#9da3b4]' },
}

export default function StatusBadge({ status }) {
  const s = styles[status] ?? styles['Em breve']
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}