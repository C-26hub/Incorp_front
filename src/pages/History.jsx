import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Search } from 'lucide-react'
import { api } from '../services/api'

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
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const visibleConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return conversations.filter((conversation) =>
      (conversation.title ?? '').toLocaleLowerCase('pt-BR').includes(normalizedQuery),
    )
  }, [conversations, query])

  useEffect(() => {
    api.listConversations()
      .then(setConversations)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar o histórico.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-[28px] font-medium">Histórico</h1>
      <p className="mt-1 text-sm text-muted">
        {conversations.length} {conversations.length === 1 ? 'conversa registrada' : 'conversas registradas'} do agente de produção de conteúdo
      </p>

      <label className="relative mt-5 block max-w-sm">
        <span className="sr-only">Buscar conversas</span>
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar conversas..."
          className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-[13px] outline-none focus:border-brand"
        />
      </label>

      {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {loading ? (
          <p className="p-6 text-sm text-muted">Carregando histórico…</p>
        ) : visibleConversations.length ? (
          <ul className="divide-y divide-line">
            {visibleConversations.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  to={`/agentes/copywriter?conversationId=${encodeURIComponent(conversation.id)}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-page"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <MessageSquare size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{conversation.title || 'Conversa sem título'}</span>
                    <span className="mt-1 block text-xs text-muted">
                      Atualizada em {formatDate(conversation.updatedAt)}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-brand">Abrir →</span>
                </Link>
              </li>
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
