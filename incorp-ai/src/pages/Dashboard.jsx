import { MessageSquare, LayoutGrid, Users, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { agents, weekly, activity, isMkt } from '../data/agents'
import Avatar from '../components/Avatar'

const stats = [
  { icon: MessageSquare, value: '247', label: 'Interações hoje', tag: '+18%', green: true },
  { icon: LayoutGrid, value: '8', label: 'Agentes ativos', tag: '2 em beta', green: false },
  { icon: Users, value: '34', label: 'Usuários únicos', tag: '+5 esta semana', green: true },
  { icon: Clock, value: '183h', label: 'Economia estimada', tag: '+12h vs semana ant.', green: true },
]

const donut = [
  { name: 'Marketing', value: 45, color: '#00aeef' },
  { name: 'Comercial', value: 55, color: '#3d3d91' },
]

const ranking = [...agents].sort((a, b) => b.uses - a.uses).slice(0, 5)

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-line rounded-2xl p-6 ${className}`}>{children}</div>
)

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-[28px] font-medium">Dashboard</h1>
      <p className="text-sm text-muted mt-1">Semana de 9 a 16 de setembro de 2026</p>

      <div className="grid grid-cols-4 gap-5 mt-6">
        {stats.map(({ icon: Icon, value, label, tag, green }) => (
          <Card key={label} className="!p-5">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                <Icon size={16} />
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${green ? 'bg-[#e6f8f0] text-[#0a9f63]' : 'bg-[#eeeff6] text-muted'}`}>
                {tag}
              </span>
            </div>
            <p className="text-[30px] font-normal mt-3 leading-none">{value}</p>
            <p className="text-xs text-muted mt-2">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 mt-5">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-medium">Utilização por dia</h2>
              <p className="text-[11px] text-muted mt-0.5">Últimos 7 dias · Interações</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-accent" /> Marketing</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-brand" /> Comercial</span>
            </div>
          </div>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00aeef" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#00aeef" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d3d91" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3d3d91" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e9f2" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#8b8fa8' }} />
                <YAxis ticks={[0, 30, 60, 90, 120]} domain={[0, 120]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#8b8fa8' }} />
                <Area type="monotone" dataKey="Comercial" stroke="#3d3d91" strokeWidth={2} fill="url(#gc)" />
                <Area type="monotone" dataKey="Marketing" stroke="#00aeef" strokeWidth={2} fill="url(#gm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-[15px] font-medium">Por departamento</h2>
          <p className="text-[11px] text-muted mt-0.5">Distribuição acumulada</p>
          <div className="h-[170px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none" startAngle={90} endAngle={-270}>
                  {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {donut.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /> {d.name}
                </span>
                <span className="font-semibold text-ink">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5">
        <Card>
          <h2 className="text-[15px] font-medium mb-4">Ranking de agentes</h2>
          <div className="space-y-4">
            {ranking.map((a, i) => (
              <div key={a.id} className="flex gap-3">
                <span className="text-[11px] text-[#e5484d] w-3 pt-0.5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium">{a.name}</span>
                    <span className="text-muted font-mono text-xs">{a.uses}</span>
                  </div>
                  <div className="h-1.5 bg-[#eeeff6] rounded-full mt-1.5">
                    <div
                      className={`h-full rounded-full ${isMkt(a.dept) ? 'bg-accent' : 'bg-brand'}`}
                      style={{ width: `${(a.uses / ranking[0].uses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-[15px] font-medium mb-4">Atividade recente</h2>
          <div className="space-y-4">
            {activity.map((a) => (
              <div key={a.who} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c9d0ea] text-brand text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {a.initials}
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] text-brand">
                    <b className="text-ink font-semibold">{a.who}</b> {a.action} <span>{a.agent}</span>
                  </p>
                  <p className="text-[11px] text-muted mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}