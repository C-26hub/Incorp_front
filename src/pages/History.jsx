import { useState } from 'react'
import { Search } from 'lucide-react'
import { historyOfDept } from '../data/agents'
import Avatar from '../components/Avatar'
import { useProfile } from '../context/ProfileContext'

const statusStyle = {
  Exportado: 'bg-[#f3e8ff] text-[#7e22ce]',
  Salvo: 'bg-[#e6f8f0] text-[#0a9f63]',
  Concluído: 'bg-[#e6f0ff] text-[#2563eb]',
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
          </tbody>
        </table>
      </div>
    </div>
  )
}