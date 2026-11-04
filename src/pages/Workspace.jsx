import { useEffect, useRef, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Plus, MessageSquare, Clock, ArrowLeft, Send, RotateCcw, Save, Download } from 'lucide-react'
import { agents } from '../data/agents'

const SUGGESTIONS = ['Criar e-mail de campanha', 'Gerar post para LinkedIn', 'Texto para landing page']

const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

// TODO: substituir pela chamada ao back-end
const fakeReply = (agent) =>
  new Promise((res) => setTimeout(() => res(`Resposta de demonstração do ${agent.name}. A integração com o modelo de IA será feita em uma etapa posterior.`), 700))

export default function Workspace() {
  const { id } = useParams()
  const agent = agents.find((a) => a.id === id)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (!agent) return
    setMessages([{
      role: 'agent', time: now(),
      text: `Olá! Sou o ${agent.name}, especializado em ${agent.category} para o departamento de ${agent.dept}. ${agent.desc} Como posso te ajudar hoje?`,
    }])
  }, [agent?.id])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  if (!agent) return <Navigate to="/agentes" replace />

  const send = async (content = text) => {
    const value = content.trim()
    if (!value || loading) return
    setMessages((m) => [...m, { role: 'user', text: value, time: now() }])
    setText('')
    setLoading(true)
    const reply = await fakeReply(agent)
    setMessages((m) => [...m, { role: 'agent', text: reply, time: now() }])
    setLoading(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // conversas anteriores: troque pelos dados de History quando existirem
  const previous = [
    { title: 'Proposta para Grupo Renova...', meta: 'Proposal Builder · 13 de set.' },
    { title: 'E-mail marketing campanha Se...', meta: 'CopyWriter Pro · 15 de set.' },
    { title: 'Qualificação lote 24 leads — Li...', meta: 'Lead Qualifier · 14 de set.' },
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-3 md:flex">
        <button
          onClick={() => setMessages((m) => m.slice(0, 1))}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-900 py-2.5 text-xs font-medium text-white hover:bg-indigo-800"
        >
          <Plus size={14} /> Nova conversa
        </button>

        <p className="mt-6 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Conversa atual</p>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5">
          <MessageSquare size={14} className="text-indigo-800" />
          <div>
            <p className="text-xs font-medium text-slate-800">{agent.name}</p>
            <p className="text-[10px] text-slate-400">Conversa em andamento</p>
          </div>
        </div>

        <p className="mt-6 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Conversas anteriores</p>
        <ul className="flex-1 space-y-1 overflow-y-auto">
          {previous.map((c) => (
            <li key={c.title} className="flex gap-2 rounded-lg p-2 hover:bg-slate-50">
              <Clock size={13} className="mt-0.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-700">{c.title}</p>
                <p className="text-[10px] text-slate-400">{c.meta}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/agentes" className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 hover:text-slate-800">
          <ArrowLeft size={13} /> Voltar para agentes
        </Link>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-xs font-semibold text-sky-700">{agent.initials}</span>
            <div>
              <p className="text-sm font-medium text-slate-800">{agent.name}</p>
              <p className="text-[11px] text-slate-400">{agent.dept} · {agent.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">● {agent.status}</span>
            <button className="flex items-center gap-1 hover:text-slate-800"><Save size={13} /> Salvar</button>
            <button className="flex items-center gap-1 hover:text-slate-800"><Download size={13} /> Exportar</button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-xl px-4 py-3 text-sm shadow-sm ${
                m.role === 'user' ? 'bg-indigo-900 text-white' : 'border border-slate-200 bg-white text-slate-700'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                <p className={`mt-1 text-[10px] ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          {loading && <p className="text-xs text-slate-400">{agent.name} está digitando…</p>}
          <div ref={endRef} />
        </div>

        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="rounded-md border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-[11px] text-indigo-800 hover:bg-indigo-50">
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Mensagem para ${agent.name}...`}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
            <button onClick={() => setMessages((m) => m.slice(0, 1))} aria-label="Reiniciar"
              className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50">
              <RotateCcw size={15} />
            </button>
            <button onClick={() => send()} disabled={!text.trim() || loading} aria-label="Enviar"
              className="rounded-lg bg-indigo-900 p-2.5 text-white disabled:bg-indigo-300">
              <Send size={15} />
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">Enter para enviar · Shift+Enter para nova linha</p>
        </footer>
      </section>
    </div>
  )
}