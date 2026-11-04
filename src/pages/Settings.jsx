import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import UserAvatar from '../components/UserAvatar'

const KEY = 'incorp:settings'
const DEFAULTS = { notifications: true, compact: false, language: 'pt-BR' }

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved && typeof saved === 'object') return { ...DEFAULTS, ...saved }
  } catch {
    /* ignora dados corrompidos */
  }
  return DEFAULTS
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${
        checked ? 'bg-brand' : 'bg-line'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : ''
        }`}
      />
    </button>
  )
}

function Option({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { profile } = useProfile()
  const [settings, setSettings] = useState(loadSettings)
  const [salvo, setSalvo] = useState(false)

  const set = (field, value) => {
    setSettings((s) => ({ ...s, [field]: value }))
    setSalvo(false)
  }

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
      setSalvo(true)
    } catch {
      setSalvo(false)
    }
  }

  return (
    <div>
      <h1 className="text-[28px] font-medium">Configurações</h1>
      <p className="mt-1 text-sm text-muted">Preferências da sua conta e do sistema</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Option title="Notificações" description="Receber alertas de conclusão de tarefas">
          <Toggle
            checked={settings.notifications}
            onChange={(v) => set('notifications', v)}
            label="Notificações"
          />
        </Option>

        <Option title="Visualização compacta" description="Reduzir espaçamento e tamanho de cards">
          <Toggle
            checked={settings.compact}
            onChange={(v) => set('compact', v)}
            label="Visualização compacta"
          />
        </Option>

        <Option title="Idioma" description="Idioma da interface">
          <select
            value={settings.language}
            onChange={(e) => set('language', e.target.value)}
            aria-label="Idioma da interface"
            className="h-10 rounded-lg border border-line bg-page px-3 text-xs outline-none focus:border-brand"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English</option>
            <option value="es-ES">Español</option>
          </select>
        </Option>

        <section className="rounded-2xl border border-line bg-white p-5 md:col-span-2 xl:col-span-3">
          <p className="text-sm font-medium">Conta</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar size={48} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.name}</p>
                <p className="truncate text-xs text-muted">
                  {profile.dept}
                  {profile.role ? ` · ${profile.role}` : ''} · {profile.email}
                </p>
              </div>
            </div>

            <Link
              to="/perfil"
              className="rounded-lg border border-line bg-white px-4 py-2 text-xs font-medium hover:border-brand/40"
            >
              Editar perfil
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <button
              type="button"
              onClick={save}
              className="h-10 rounded-lg bg-brand px-5 text-xs font-semibold text-white hover:opacity-90"
            >
              Salvar alterações
            </button>
            {salvo && (
              <span role="status" className="text-xs text-brand">
                Preferências salvas.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}