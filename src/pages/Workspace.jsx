
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Bot, RotateCcw } from 'lucide-react'
import { agents } from '../data/agents'

export default function Workspace() {
  const { agentId } = useParams()
  const navigate = useNavigate()

  const agent = agents.find((item) => item.id === agentId)

  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  if (!agent) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">
          Agente não encontrado
        </h1>

        <button
          onClick={() => navigate('/agentes')}
          className="mt-4 rounded-lg bg-brand px-4 py-2 text-white"
        >
          Voltar aos agentes
        </button>
      </div>
    )
  }

  function sendMessage(event) {
    event.preventDefault()

    const content = message.trim()

    if (!content) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }

    const demoResponse = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        `Esta é uma demonstração do agente ${agent.name}. ` +
        'A integração com a inteligência artificial será realizada posteriormente.',
    }

    setMessages((current) => [
      ...current,
      userMessage,
      demoResponse,
    ])

    setMessage('')
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <button
        onClick={() => navigate('/agentes')}
        className="flex items-center gap-2 self-start text-sm text-muted hover:text-brand"
      >
        <ArrowLeft size={16} />
        Voltar aos agentes
      </button>

      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="text-xl font-semibold">{agent.name}</h1>
            <p className="text-sm text-muted">
              {agent.dept} • {agent.category}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          {agent.desc}
        </p>

        <p className="mt-3 text-xs text-muted">
          Ambiente demonstrativo — sem conexão com IA real.
        </p>
      </div>

      <div className="flex min-h-[450px] flex-col rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="font-medium">Conversa</h2>

          <button
            type="button"
            onClick={() => setMessages([])}
            className="flex items-center gap-2 text-sm text-muted hover:text-brand"
          >
            <RotateCcw size={15} />
            Nova conversa
          </button>
        </div>

        <div
          className="flex flex-1 flex-col gap-4 p-5"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="m-auto text-center">
              <Bot
                size={36}
                className="mx-auto mb-3 text-brand"
              />

              <h3 className="font-medium">
                Como posso ajudar?
              </h3>

              <p className="mt-2 text-sm text-muted">
                Digite uma mensagem para testar a interface.
              </p>
            </div>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`max-w-[85%] rounded-xl p-4 text-sm ${
                  item.role === 'user'
                    ? 'self-end bg-brand text-white'
                    : 'self-start bg-slate-100 text-ink'
                }`}
              >
                {item.content}
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex gap-3 border-t border-line p-4"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Digite sua mensagem..."
            aria-label="Mensagem para o agente"
            className="min-w-0 flex-1 rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  )
}
