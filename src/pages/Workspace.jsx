import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { Plus, MessageSquare, Clock, ArrowLeft, Send, RotateCcw } from 'lucide-react'
import { agents } from '../data/agents'
import { useProfile } from '../context/ProfileContext'
import { api } from '../services/api'

const EMPTY_BRIEF = {
  objective: '',
  targetAudience: '',
  channel: '',
  format: '',
  keyInformation: '',
  tone: '',
  callToAction: '',
  additionalInstructions: '',
  language: 'Português (Brasil)',
}

const SUGGESTIONS = ['Crie uma variação mais curta', 'Adapte para um tom mais formal', 'Sugira outro título']

function displayTime(value) {
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function displayDate(value) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function parseUserContent(content) {
  try {
    const request = JSON.parse(content)
    if (request && typeof request === 'object') return request
  } catch {
    // Mensagens antigas podem conter texto livre em vez do briefing serializado.
  }
  return null
}

function userMessageText(content) {
  const request = parseUserContent(content)
  if (!request) return content
  if (request.additionalInstructions) return request.additionalInstructions
  return `Briefing enviado — ${request.objective}. Informações principais: ${request.keyInformation}`
}

function messageFromApi(message) {
  return {
    role: message.role === 'USER' ? 'user' : 'agent',
    text: message.role === 'USER' ? userMessageText(message.content) : message.content,
    time: displayTime(message.createdAt),
  }
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.'
}

export default function Workspace() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const conversationId = searchParams.get('conversationId')
  const { profile } = useProfile()
  // só abre agentes do departamento da pessoa (vale também para quem digita a URL na mão)
  const agent = agents.find((a) => a.id === id && a.dept === profile.dept)
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [brief, setBrief] = useState(EMPTY_BRIEF)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await api.listConversations())
    } catch (loadError) {
      setError(errorText(loadError))
    }
  }, [])

  useEffect(() => {
    if (agent?.available) void loadConversations()
  }, [agent?.available, loadConversations])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setBrief(EMPTY_BRIEF)
      setError('')
      setLoadingConversation(false)
      return
    }

    let active = true
    setLoadingConversation(true)
    setError('')
    api.conversationMessages(conversationId)
      .then((history) => {
        if (!active) return
        setMessages(history.map(messageFromApi))
        const firstUserMessage = history.find((message) => message.role === 'USER')
        const savedBrief = firstUserMessage && parseUserContent(firstUserMessage.content)
        if (savedBrief) {
          setBrief((current) => ({ ...current, ...savedBrief, conversationId }))
        }
      })
      .catch((loadError) => {
        if (active) setError(errorText(loadError))
      })
      .finally(() => {
        if (active) setLoadingConversation(false)
      })

    return () => { active = false }
  }, [conversationId])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  if (!agent || !agent.available) return <Navigate to="/agentes" replace />

  const startNewConversation = () => {
    setSearchParams({})
    setText('')
    setError('')
  }

  const openConversation = (id) => {
    setSearchParams({ conversationId: id })
    setText('')
    setError('')
  }

  const updateBrief = (field, value) => {
    setBrief((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const generate = async (instructions = '') => {
    if (loading) return
    const request = {
      ...brief,
      additionalInstructions: instructions || brief.additionalInstructions || undefined,
      conversationId: conversationId ?? undefined,
    }
    const requiredFields = [request.objective, request.targetAudience, request.channel, request.format, request.keyInformation]
    if (!conversationId && requiredFields.some((value) => !value?.trim())) {
      setError('Preencha objetivo, público-alvo, canal, formato e informações principais.')
      return
    }
    if (conversationId && !instructions.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await api.produceContent(request)
      if (!conversationId) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('conversationId', response.conversationId)
        setSearchParams(nextParams)
      }
      const userText = instructions
        ? instructions
        : `Briefing enviado — ${request.objective}. Informações principais: ${request.keyInformation}`
      setMessages((current) => [
        ...current,
        { role: 'user', text: userText, time: displayTime(new Date().toISOString()) },
        { role: 'agent', text: response.draft, time: displayTime(new Date().toISOString()) },
      ])
      setBrief((current) => ({ ...current, additionalInstructions: '' }))
      setText('')
      await loadConversations()
    } catch (generateError) {
      setError(errorText(generateError))
    } finally {
      setLoading(false)
    }
  }

  const send = () => {
    const instruction = text.trim()
    if (instruction) void generate(instruction)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-3 md:flex">
        <button
          onClick={startNewConversation}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-900 py-2.5 text-xs font-medium text-white hover:bg-indigo-800"
        >
          <Plus size={14} /> Nova conversa
        </button>

        <p className="mt-6 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Conversa atual</p>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5">
          <MessageSquare size={14} className="text-indigo-800" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-800">{agent.name}</p>
            <p className="truncate text-[10px] text-slate-400">
              {conversationId ? conversations.find((item) => item.id === conversationId)?.title ?? 'Conversa em andamento' : 'Nova conversa'}
            </p>
          </div>
        </div>

        <p className="mt-6 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Conversas anteriores</p>
        <ul className="flex-1 space-y-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                onClick={() => openConversation(conversation.id)}
                className={`flex w-full gap-2 rounded-lg p-2 text-left hover:bg-slate-50 ${
                  conversation.id === conversationId ? 'bg-indigo-50' : ''
                }`}
              >
                <Clock size={13} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="min-w-0">
                  <span className="block truncate text-xs text-slate-700">{conversation.title}</span>
                  <span className="block text-[10px] text-slate-400">{displayDate(conversation.updatedAt)}</span>
                </span>
              </button>
            </li>
          ))}
          {!conversations.length && <li className="px-2 py-1 text-[11px] text-slate-400">Nenhuma conversa salva.</li>}
        </ul>

        <Link to="/agentes" className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 hover:text-slate-800">
          <ArrowLeft size={13} /> Voltar para agentes
        </Link>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div>
            <p className="text-sm font-medium text-slate-800">{agent.name}</p>
            <p className="text-[11px] text-slate-400">{agent.dept} · {agent.category}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">● API conectada</span>
        </header>

        {!conversationId ? (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">Prepare o briefing</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Quanto mais contexto você informar, melhor será o rascunho. O conteúdo exige revisão humana antes de ser utilizado.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="text-xs font-medium text-slate-700">
                  Objetivo *
                  <input value={brief.objective} onChange={(event) => updateBrief('objective', event.target.value)} placeholder="Ex.: divulgar um novo serviço" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Público-alvo *
                  <input value={brief.targetAudience} onChange={(event) => updateBrief('targetAudience', event.target.value)} placeholder="Ex.: gestores de pequenas empresas" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Canal *
                  <select value={brief.channel} onChange={(event) => updateBrief('channel', event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-400">
                    <option value="">Selecione um canal</option>
                    <option>LinkedIn</option><option>Instagram</option><option>Blog</option><option>E-mail</option><option>Landing page</option><option>Outro</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Formato *
                  <input value={brief.format} onChange={(event) => updateBrief('format', event.target.value)} placeholder="Ex.: post, artigo, e-mail" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-700 md:col-span-2">
                  Informações principais *
                  <textarea value={brief.keyInformation} onChange={(event) => updateBrief('keyInformation', event.target.value)} rows={3} placeholder="Inclua fatos, benefícios, dados e contexto que devem aparecer. O agente não deve inventar informações." className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Tom de voz
                  <input value={brief.tone} onChange={(event) => updateBrief('tone', event.target.value)} placeholder="Ex.: profissional e acolhedor" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Chamada para ação
                  <input value={brief.callToAction} onChange={(event) => updateBrief('callToAction', event.target.value)} placeholder="Ex.: solicite uma demonstração" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-700 md:col-span-2">
                  Instruções adicionais
                  <textarea value={brief.additionalInstructions} onChange={(event) => updateBrief('additionalInstructions', event.target.value)} rows={2} placeholder="Restrições, palavras a evitar ou outras orientações" className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-400" />
                </label>
              </div>
              {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
              <button onClick={() => void generate()} disabled={loading} className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60">
                <Send size={14} /> {loading ? 'Gerando conteúdo…' : 'Gerar conteúdo'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {loadingConversation && <p className="text-xs text-slate-400">Carregando conversa…</p>}
              {messages.map((message, index) => (
                <div key={`${index}-${message.time}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl rounded-xl px-4 py-3 text-sm shadow-sm ${
                    message.role === 'user' ? 'bg-indigo-900 text-white' : 'border border-slate-200 bg-white text-slate-700'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.role === 'agent' && <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] font-medium text-amber-700">Rascunho gerado por IA · revise antes de usar</p>}
                    <p className={`mt-1 text-[10px] ${message.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>{message.time}</p>
                  </div>
                </div>
              ))}
              {loading && <p className="text-xs text-slate-400">{agent.name} está gerando…</p>}
              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
              <div ref={endRef} />
            </div>

            <footer className="border-t border-slate-200 bg-white px-6 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion} onClick={() => void generate(suggestion)} disabled={loading} className="rounded-md border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-[11px] text-indigo-800 hover:bg-indigo-50 disabled:opacity-50">
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={`Instruções adicionais para ${agent.name}...`}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
                />
                <button onClick={startNewConversation} aria-label="Reiniciar" className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50">
                  <RotateCcw size={15} />
                </button>
                <button onClick={send} disabled={!text.trim() || loading} aria-label="Enviar" className="rounded-lg bg-indigo-900 p-2.5 text-white disabled:bg-indigo-300">
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400">As instruções mantêm o contexto desta conversa. Enter para enviar.</p>
            </footer>
          </>
        )}
      </section>
    </div>
  )
}
