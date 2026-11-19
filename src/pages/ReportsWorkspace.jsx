import { useState } from 'react'
import { ArrowLeft, BarChart3, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const CHANNELS = [
  { value: 'ORGANIC', label: 'Orgânico', sources: [['META', 'Meta'], ['GOOGLE', 'Google'], ['LINKEDIN', 'LinkedIn']] },
  { value: 'PAID', label: 'Mídia paga', sources: [['TRAFFIC_AGENT', 'Agente de Tráfego']] },
  { value: 'LEADS', label: 'Leads', sources: [['LEADS_AGENT', 'Agente de Leads']] },
  { value: 'BIDS', label: 'Editais', sources: [['BIDS_AGENT', 'Agente de Editais']] },
  { value: 'SEO', label: 'SEO', sources: [['SEO_AGENT', 'Agente de SEO']] },
]

const EMPTY_METRIC = {
  channel: 'PAID',
  name: '',
  unit: '',
  value: '',
  source: 'TRAFFIC_AGENT',
  reference: '',
  goalValue: '',
  goalDirection: 'AT_MOST',
  contextReference: '',
}

function monthStart() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}-01`
}

function today() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível gerar o relatório.'
}

function statusLabel(status) {
  return ({
    MISSING: 'Sem valor',
    CONFLICT: 'Valores divergentes',
    NO_GOAL: 'Sem meta',
    GOAL_MET: 'Meta atingida',
    GOAL_NOT_MET: 'Meta não atingida',
  })[status] ?? status
}

export default function ReportsWorkspace() {
  const [product, setProduct] = useState('')
  const [startDate, setStartDate] = useState(monthStart)
  const [endDate, setEndDate] = useState(today)
  const [metrics, setMetrics] = useState([{ ...EMPTY_METRIC }])
  const [includeNarrative, setIncludeNarrative] = useState(true)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateMetric = (index, field, value) => {
    setMetrics((current) => current.map((metric, position) => {
      if (position !== index) return metric
      const next = { ...metric, [field]: value }
      if (field === 'channel') next.source = CHANNELS.find((channel) => channel.value === value)?.sources[0][0] ?? ''
      return next
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const request = {
        product: product.trim(),
        startDate,
        endDate,
        includeNarrative,
        metrics: metrics.map((metric) => ({
          channel: metric.channel,
          name: metric.name.trim(),
          unit: metric.unit.trim(),
          goal: metric.goalValue === '' ? null : {
            value: Number(metric.goalValue),
            direction: metric.goalDirection,
          },
          observations: metric.value === '' ? [] : [{
            source: metric.source,
            reference: metric.reference.trim(),
            value: Number(metric.value),
          }],
          contextReferences: metric.contextReference.trim() ? [metric.contextReference.trim()] : [],
        })),
      }
      setResult(await api.reportKpis(request))
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
          <h1 className="text-[26px] font-medium">Agente de Relatórios e KPIs</h1>
          <p className="mt-1 text-xs text-muted">Consolide indicadores, registre suas fontes e compare os resultados com as metas.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 p-4 text-xs leading-5 text-sky-900">
        Os números são fornecidos por você e não são consultados automaticamente nas plataformas. O resumo narrativo opcional é gerado por IA com os indicadores enviados; confira as fontes antes de compartilhar o relatório.
      </div>

      <form onSubmit={submit} className="mt-5 space-y-5 rounded-xl border border-line bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-xs font-medium text-slate-700 md:col-span-1">
            Produto ou iniciativa *
            <input required maxLength={100} value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Ex.: Campanha de novembro" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
          </label>
          <label className="text-xs font-medium text-slate-700">
            Data inicial *
            <input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
          </label>
          <label className="text-xs font-medium text-slate-700">
            Data final *
            <input required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
          </label>
        </div>

        <div className="border-t border-line pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Indicadores</h2>
              <p className="mt-1 text-[11px] text-muted">Cada KPI deve aparecer uma vez por canal. Valores divergentes entre fontes serão sinalizados.</p>
            </div>
            <button type="button" disabled={metrics.length >= 30} onClick={() => setMetrics((current) => [...current, { ...EMPTY_METRIC }])} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} /> Adicionar KPI
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {metrics.map((metric, index) => {
              const channel = CHANNELS.find((item) => item.value === metric.channel)
              return (
                <section key={index} className="rounded-xl border border-line bg-slate-50/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold">KPI {index + 1}</h3>
                    {metrics.length > 1 && <button type="button" aria-label={`Remover KPI ${index + 1}`} onClick={() => setMetrics((current) => current.filter((_, position) => position !== index))} className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button>}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="text-xs font-medium text-slate-700">
                      Canal *
                      <select value={metric.channel} onChange={(event) => updateMetric(index, 'channel', event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                        {CHANNELS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Nome do KPI *
                      <input required maxLength={100} value={metric.name} onChange={(event) => updateMetric(index, 'name', event.target.value)} placeholder="Ex.: CPA" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Unidade *
                      <input required maxLength={30} value={metric.unit} onChange={(event) => updateMetric(index, 'unit', event.target.value)} placeholder="Ex.: BRL, %, x, leads" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Valor observado (opcional)
                      <input type="number" step="any" value={metric.value} onChange={(event) => updateMetric(index, 'value', event.target.value)} placeholder="Deixe vazio para registrar lacuna" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Fonte *
                      <select value={metric.source} onChange={(event) => updateMetric(index, 'source', event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                        {channel?.sources.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Referência da fonte {metric.value !== '' && '*'}
                      <input required={metric.value !== ''} maxLength={150} value={metric.reference} onChange={(event) => updateMetric(index, 'reference', event.target.value)} placeholder="Ex.: campanha-meta-2026-11" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Meta (opcional)
                      <input type="number" step="any" value={metric.goalValue} onChange={(event) => updateMetric(index, 'goalValue', event.target.value)} placeholder="Ex.: 12" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Direção da meta
                      <select value={metric.goalDirection} onChange={(event) => updateMetric(index, 'goalDirection', event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                        <option value="AT_MOST">No máximo (ex.: CPA)</option><option value="AT_LEAST">No mínimo (ex.: ROAS)</option>
                      </select>
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Referência de contexto (opcional)
                      <input maxLength={150} value={metric.contextReference} onChange={(event) => updateMetric(index, 'contextReference', event.target.value)} placeholder="Ex.: relatório da plataforma" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <label className="flex items-start gap-2 border-t border-line pt-4 text-xs leading-5 text-slate-700">
          <input type="checkbox" checked={includeNarrative} onChange={(event) => setIncludeNarrative(event.target.checked)} className="mt-0.5" />
          Incluir uma síntese narrativa gerada por IA
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : <BarChart3 size={14} />}
          {loading ? 'Consolidando indicadores…' : 'Gerar relatório'}
        </button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-5 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Relatório de {result.product}</h2>
              <p className="mt-1 text-xs text-muted">{result.startDate} a {result.endDate}</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-800">{result.metrics.length} KPI(s)</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.metrics.map((metric, index) => (
              <article key={`${metric.channel}-${metric.name}-${index}`} className="rounded-lg border border-line p-3">
                <div className="flex items-start justify-between gap-2">
                  <div><p className="text-[10px] uppercase tracking-wide text-muted">{metric.channel}</p><h3 className="mt-1 text-sm font-semibold">{metric.name}</h3></div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${metric.status === 'GOAL_MET' ? 'bg-emerald-50 text-emerald-700' : metric.status === 'GOAL_NOT_MET' || metric.status === 'CONFLICT' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{statusLabel(metric.status)}</span>
                </div>
                <p className="mt-3 text-lg font-semibold">{metric.value ?? '—'} <span className="text-xs font-normal text-muted">{metric.unit}</span></p>
                {metric.goal && <p className="mt-1 text-[11px] text-muted">Meta {metric.goal.direction === 'AT_MOST' ? '≤' : '≥'} {metric.goal.value}</p>}
                {metric.observations.map((observation, observationIndex) => <p key={`${observation.reference}-${observationIndex}`} className="mt-2 text-[10px] text-muted">{observation.source} · {observation.reference}: {observation.value}</p>)}
                {metric.contextReferences.map((reference) => <p key={reference} className="mt-1 text-[10px] text-muted">Contexto: {reference}</p>)}
              </article>
            ))}
          </div>
          {result.narrative && <div className="mt-4 rounded-lg bg-indigo-50/70 p-4"><h3 className="text-xs font-semibold">Síntese</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.narrative}</p></div>}
          <p className="mt-4 text-[11px] text-muted">Revise os valores e referências com as fontes originais antes de tomar decisões.</p>
        </section>
      )}
    </div>
  )
}
