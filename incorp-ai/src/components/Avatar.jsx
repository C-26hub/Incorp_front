import { isMkt } from '../data/agents'

export default function Avatar({ initials, dept, size = 'md' }) {
  const box = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-xs' : 'w-8 h-8 text-[11px]'
  const color = isMkt(dept) ? 'bg-accent-soft text-accent' : 'bg-[#eeeff6] text-brand'
  return (
    <div className={`${box} ${color} rounded-lg flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </div>
  )
}