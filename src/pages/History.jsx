import { useState } from 'react'
import { Search } from 'lucide-react'
import { historyOfDept } from '../data/agents'
import Avatar from '../components/Avatar'
import { useProfile } from '../context/ProfileContext'

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function History() {
  const { profile } = useProfile()
  const [q, setQ] = useState('')

  // só as interações com agentes do departamento da pessoa
  const doDepartamento = historyOfDept(profile.dept)
  const rows = doDepartamento.filter((h) => (h.agent + h.query).toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-medium">Histórico</h1>
          <p className="text-sm text-muted mt-1">{doDepartamento.length} interações registradas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar no histórico..."
              className="h-10 w-[184px] pl-9 pr-3 rounded-lg bg-white border border-line text-[13px] outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl mt-6 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] tracking-wider text-muted uppercase">
              {['Agente', 'Consulta', 'Data', 'Duração', 'Status', ''].map((h) => (
                <th key={h} className="font-semibold px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.date} className="border-t border-line">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={h.initials} dept={h.dept} size="sm" />
                    <span className="text-[13px] font-medium w-[90px] leading-tight">{h.agent}</span>
                  </div>
                </td>
                <td className="px-5 text-xs text-muted">{h.query}</td>
                <td className="px-5 font-mono text-[11px] text-muted whitespace-nowrap">{h.date}</td>
                <td className="px-5 font-mono text-[11px] text-accent">{h.duration}</td>
                <td className="px-5">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyle[h.status]}`}>{h.status}</span>
                </td>
                <td className="px-5 text-xs font-medium text-brand whitespace-nowrap cursor-pointer">Repetir →</td>
              </tr>
            ))}
          </ul>
        ) : conversations.length ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium">Nenhuma conversa encontrada</p>
            <p className="mt-1 text-xs text-muted">Tente outro termo de busca.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <MessageSquare size={24} className="text-muted" />
            <p className="mt-3 text-sm font-medium">Nenhuma conversa ainda</p>
            <p className="mt-1 text-xs text-muted">As conversas do agente de produção de conteúdo aparecerão aqui.</p>
            <Link to="/agentes/copywriter" className="mt-4 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white">
              Criar conteúdo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
