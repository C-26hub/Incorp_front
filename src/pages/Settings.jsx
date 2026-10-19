import { useState } from 'react'

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-[38px] h-[22px] rounded-full p-0.5 transition-colors ${on ? 'bg-brand' : 'bg-[#e3e4ee]'}`}
    >
      <span className={`block w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`} />
    </button>
  )
}

const Row = ({ title, desc, children }) => (
  <div className="flex items-center justify-between bg-white border border-line rounded-xl px-5 py-4">
    <div className="leading-tight">
      <p className="text-[13px] font-medium">{title}</p>
      <p className="text-xs text-muted mt-1">{desc}</p>
    </div>
    {children}
  </div>
)

export default function Settings() {
  const [notif, setNotif] = useState(true)
  const [compact, setCompact] = useState(false)
  const [lang, setLang] = useState('Português (Brasil)')
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-[28px] font-medium">Configurações</h1>
      <p className="text-sm text-muted mt-1">Preferências da sua conta e do sistema</p>

      <div className="max-w-[484px] space-y-4 mt-6">
        <Row title="Notificações" desc="Receber alertas de conclusão de tarefas">
          <Toggle on={notif} onChange={setNotif} />
        </Row>
        <Row title="Visualização compacta" desc="Reduzir espaçamento e tamanho de cards">
          <Toggle on={compact} onChange={setCompact} />
        </Row>
        <Row title="Idioma" desc="Idioma da interface">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#f1f2f9] border border-line text-xs outline-none"
          >
            <option>Português (Brasil)</option>
            <option>English</option>
            <option>Español</option>
          </select>
        </Row>

        <div className="bg-white border border-line rounded-xl px-5 py-4">
          <p className="text-[13px] font-medium">Conta</p>
          <p className="text-xs text-muted mt-2">Ana Souza · Marketing · ana.souza@incorp.com.br</p>
          <button
            onClick={save}
            className="mt-4 h-9 px-4 rounded-lg border border-line text-[13px] font-medium hover:border-brand transition-colors"
          >
            {saved ? 'Salvo ✓' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}