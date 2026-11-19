import { useState } from 'react'
import { ArrowLeft, ExternalLink, FileSearch, LoaderCircle, SearchCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível concluir a análise.'
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function AuditCard({ title, children }) {
  return (
    <section className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  )
}

export default function SeoWorkspace() {
  const [url, setUrl] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [supplementalText, setSupplementalText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async (event) => {
    event.preventDefault()
    if (loading) return
    const normalizedUrl = url.trim()
    if (!isHttpsUrl(normalizedUrl)) {
      setError('Informe uma URL válida que comece com HTTPS.')
      setAnalysis(null)
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)
    try {
      const result = await api.analyzeSeo({
        url: normalizedUrl,
        targetKeyword: targetKeyword.trim() || undefined,
        supplementalText: supplementalText.trim() || undefined,
      })
      setAnalysis(result)
    } catch (requestError) {
      setError(errorText(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/agentes" className="mb-4 inline-flex items-center gap-2 text-xs text-muted hover:text-brand">
        <ArrowLeft size={14} /> Voltar para agentes
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-medium">Agente de SEO</h1>
          <p className="mt-1 text-xs text-muted">Analise uma página publicada e receba recomendações on-page baseadas no conteúdo acessível.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      <form onSubmit={analyze} className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs font-medium text-slate-700 md:col-span-2">
            URL pública da página (HTTPS) *
            <input
              type="url"
              required
              maxLength={2048}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.exemplo.com/pagina"
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="text-xs font-medium text-slate-700">
            Palavra-chave-alvo
            <input
              maxLength={200}
              value={targetKeyword}
              onChange={(event) => setTargetKeyword(event.target.value)}
              placeholder="Ex.: consultoria de marketing"
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="text-xs font-medium text-slate-700">
            Contexto adicional (opcional)
            <textarea
              rows={3}
              maxLength={10000}
              value={supplementalText}
              onChange={(event) => setSupplementalText(event.target.value)}
              placeholder="Público, objetivo ou conteúdo não visível na página"
              className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-brand"
            />
          </label>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-muted">
          O servidor busca apenas páginas HTTPS públicas, sem seguir redirecionamentos, com limite de 2 MB. O HTML da página e o contexto enviado serão processados pelo Gemini; não inclua dados pessoais ou confidenciais.
        </p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="mt-4 flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : <FileSearch size={14} />}
          {loading ? 'Analisando página…' : 'Analisar página'}
        </button>
      </form>

      {analysis && (
        <div className="mt-6 space-y-4">
          <section className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold text-indigo-900 shadow-sm">
                  {analysis.score}
                </div>
                <div>
                  <p className="text-sm font-semibold">Pontuação de auditoria</p>
                  <p className="text-xs text-muted">Indicador orientativo, não representa posição em buscadores.</p>
                </div>
              </div>
              <a href={analysis.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-900 hover:underline">
                Abrir página <ExternalLink size={13} />
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{analysis.summary}</p>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><SearchCheck size={16} /> Sinais observados</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] uppercase text-muted">Título</p><p className="mt-1 text-xs">{analysis.title || 'Não encontrado'}</p><p className="mt-1 text-[10px] text-muted">{analysis.title?.length ?? 0} caracteres</p></div>
              <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2 lg:col-span-2"><p className="text-[10px] uppercase text-muted">Meta description</p><p className="mt-1 text-xs">{analysis.metaDescription || 'Não encontrada'}</p><p className="mt-1 text-[10px] text-muted">{analysis.metaDescription?.length ?? 0} caracteres</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] uppercase text-muted">Cabeçalhos</p><p className="mt-1 text-xs">{analysis.h1Count} H1 · {analysis.headingCount} no total</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] uppercase text-muted">Imagens</p><p className="mt-1 text-xs">{analysis.imagesWithoutAlt} sem texto alternativo</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] uppercase text-muted">Links</p><p className="mt-1 text-xs">{analysis.internalLinks} internos · {analysis.externalLinks} externos</p></div>
              {analysis.canonicalUrl && <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2 lg:col-span-3"><p className="text-[10px] uppercase text-muted">Canonical</p><p className="mt-1 break-all text-xs">{analysis.canonicalUrl}</p></div>}
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-2">
            <AuditCard title="Título e intenção de busca">{analysis.titleAdvice}</AuditCard>
            <AuditCard title="Meta description">{analysis.descriptionAdvice}</AuditCard>
            <AuditCard title="Conteúdo">{analysis.contentAdvice}</AuditCard>
            <AuditCard title="Aspectos técnicos">{analysis.technicalAdvice}</AuditCard>
            <AuditCard title="Palavra-chave">{analysis.keywordAdvice}</AuditCard>
            <AuditCard title="Ações prioritárias">
              <ol className="list-inside list-decimal space-y-1">
                {analysis.actions.map((action, index) => <li key={`${index}-${action}`}>{action}</li>)}
              </ol>
            </AuditCard>
          </div>
          <p className="text-[11px] text-muted">Recomendações geradas por IA com base no HTML acessível no momento da análise. Revise as sugestões e valide com ferramentas de SEO antes de publicar alterações.</p>
        </div>
      )}
    </div>
  )
}
