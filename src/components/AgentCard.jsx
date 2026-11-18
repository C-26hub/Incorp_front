import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

export default function AgentCard({ agent }) {
  const navigate = useNavigate()

  const open = () => {
    if (agent.available) navigate(`/agentes/${agent.id}`)
  }

  return (
    <div
      role={agent.available ? 'button' : undefined}
      tabIndex={agent.available ? 0 : undefined}
      onClick={open}
      onKeyDown={(e) => {
        if (agent.available && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          open()
        }
      }}
      className={`group flex flex-col rounded-xl border border-line bg-white p-4 shadow-sm outline-none transition ${
        agent.available
          ? 'cursor-pointer hover:border-brand/40 hover:shadow-md focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/10'
          : 'cursor-default opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Avatar initials={agent.initials} dept={agent.dept} />

        <StatusBadge status={agent.status} />
      </div>

      <h3 className="mt-3 text-[13px] font-semibold">{agent.name}</h3>
      <p className="mt-1 flex-1 text-[11.5px] leading-relaxed text-muted">{agent.desc}</p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span>{agent.available ? 'API integrada' : 'Não implementado'}</span>
        <span className="font-medium text-brand opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          {agent.available ? 'Usar agente →' : 'Em breve'}
        </span>
      </div>
    </div>
  )
}