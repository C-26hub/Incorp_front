import { useState } from 'react'
import { ArrowLeft, LoaderCircle, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

function localDate(value = new Date()) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateOffset(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return localDate(date)
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível estruturar a campanha.'
}

function statusLabel(status) {
  return ({
    MISSING: 'Sem dados',
    NO_GOAL: 'Sem meta',
    GOAL_MET: 'Meta atingida',
    GOAL_NOT_MET: 'Meta não atingida',
  })[status] ?? status
}

export default function TrafficWorkspace() {
  const [campaignReference, setCampaignReference] = useState('')
  const [product, setProduct] = useState('')
  const [platform, setPlatform] = useState('META_ADS')
  const [objective, setObjective] = useState('')
  const [audience, setAudience] = useState('')
  const [startDate, setStartDate] = useState(() => localDate())
  const [endDate, setEndDate] = useState(() => dateOffset(29))
  const [currency, setCurrency] = useState('BRL')
  const [plannedBudget, setPlannedBudget] = useState('')
  const [budgetCeiling, setBudgetCeiling] = useState('')
  const [maxCpa, setMaxCpa] = useState('')
  const [minRoas, setMinRoas] = useState('')
  const [creative, setCreative] = useState({ reference: '', validationReference: '', compatible: true })
  const [includeObservation, setIncludeObservation] = useState(false)
  const [observation, setObservation] = useState({
    reference: '',
    startDate: localDate(),
    endDate: localDate(),
    impressions: '',
    reach: '',
    clicks: '',
    conversions: '',
    spend: '',
    attributedRevenue: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateCreative = (field, value) => setCreative((current) => ({ ...current, [field]: value }))
  const updateObservation = (field, value) => setObservation((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return
    if (maxCpa === '' && minRoas === '') {
      setError('Informe ao menos uma meta: CPA máximo ou ROAS mínimo.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    try {
      const request = {
        campaignReference: campaignReference.trim(),
        product: product.trim(),
        platform,
        objective: objective.trim(),
        audience: audience.trim(),
        startDate,
        endDate,
        budget: { currency, planned: Number(plannedBudget), ceiling: Number(budgetCeiling) },
        goals: {
          maxCpa: maxCpa === '' ? null : Number(maxCpa),
          minRoas: minRoas === '' ? null : Number(minRoas),
        },
        creatives: [{
          reference: creative.reference.trim(),
          validationReference: creative.validationReference.trim(),
          compatible: creative.compatible,
        }],
        observation: includeObservation ? {
          reference: observation.reference.trim(),
          startDate: observation.startDate,
          endDate: observation.endDate,
          impressions: observation.impressions === '' ? null : Number(observation.impressions),
          reach: observation.reach === '' ? null : Number(observation.reach),
          clicks: observation.clicks === '' ? null : Number(observation.clicks),
          conversions: observation.conversions === '' ? null : Number(observation.conversions),
          spend: observation.spend === '' ? null : Number(observation.spend),
          attributedRevenue: observation.attributedRevenue === '' ? null : Number(observation.attributedRevenue),
        } : null,
      }
      setResult(await api.planTrafficCampaign(request))
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
          <h1 className="text-[26px] font-medium">Agente de Tráfego</h1>
          <p className="mt-1 text-xs text-muted">Monte um rascunho de campanha e avalie métricas com dados informados pela equipe.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
        O agente não cria campanhas nem consulta contas de anúncios. Orçamento, metas, compatibilidade dos criativos e observações são fornecidos por você; a estratégia é uma recomendação de IA e deve ser revisada antes de qualquer execução.
      </div>

      <form onSubmit={submit} className="mt-5 space-y-5 rounded-xl border border-line bg-white p-5 shadow-sm">
        <section>
          <h2 className="text-sm font-semibold">Briefing da campanha</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Referência da campanha *
              <input required maxLength={150} value={campaignReference} onChange={(event) => setCampaignReference(event.target.value)} placeholder="Ex.: campanha-produto-2026-11" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Produto ou serviço *
              <input required maxLength={100} value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Ex.: Consultoria de marketing" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Plataforma *
              <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                <option value="META_ADS">Meta Ads</option><option value="GOOGLE_ADS">Google Ads</option><option value="LINKEDIN_ADS">LinkedIn Ads</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium text-slate-700">
                Início *
                <input required type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); if (includeObservation) updateObservation('startDate', event.target.value) }} className="mt-1.5 w-full rounded-lg border border-line bg-white px-2 py-2.5 text-sm font-normal" />
              </label>
              <label className="text-xs font-medium text-slate-700">
                Fim *
                <input required type="date" value={endDate} onChange={(event) => { setEndDate(event.target.value); if (includeObservation) updateObservation('endDate', event.target.value) }} className="mt-1.5 w-full rounded-lg border border-line bg-white px-2 py-2.5 text-sm font-normal" />
              </label>
            </div>
            <label className="text-xs font-medium text-slate-700">
              Objetivo *
              <textarea required maxLength={1000} rows={3} value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Ex.: gerar solicitações de demonstração" className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Público-alvo *
              <textarea required maxLength={1000} rows={3} value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Ex.: empresas B2B de tecnologia com 20 a 200 pessoas" className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Orçamento e metas</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-slate-700">
              Moeda *
              <input required pattern="[A-Z]{3}" maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Orçamento planejado *
              <input required type="number" min="0.01" step="0.01" value={plannedBudget} onChange={(event) => setPlannedBudget(event.target.value)} placeholder="Ex.: 500" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Teto de orçamento *
              <input required type="number" min="0.01" step="0.01" value={budgetCeiling} onChange={(event) => setBudgetCeiling(event.target.value)} placeholder="Ex.: 600" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              CPA máximo
              <input type="number" min="0.000001" step="any" value={maxCpa} onChange={(event) => setMaxCpa(event.target.value)} placeholder="Opcional" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700 sm:col-span-2 lg:col-span-4">
              ROAS mínimo
              <input type="number" min="0.000001" step="any" value={minRoas} onChange={(event) => setMinRoas(event.target.value)} placeholder="Opcional; informe CPA máximo ou ROAS mínimo" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal sm:max-w-xs" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Criativo</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Referência do criativo *
              <input required maxLength={150} value={creative.reference} onChange={(event) => updateCreative('reference', event.target.value)} placeholder="Ex.: carrossel-produto-v2" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Referência da validação *
              <input required maxLength={150} value={creative.validationReference} onChange={(event) => updateCreative('validationReference', event.target.value)} placeholder="Ex.: revisao-marca-2026-11" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 md:col-span-2">
              <input type="checkbox" checked={creative.compatible} onChange={(event) => updateCreative('compatible', event.target.checked)} />
              Criativo marcado como compatível após revisão humana
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <label className="flex items-start gap-2 text-xs leading-5 text-slate-700">
            <input type="checkbox" checked={includeObservation} onChange={(event) => { setIncludeObservation(event.target.checked); if (event.target.checked) { updateObservation('startDate', startDate); updateObservation('endDate', endDate) } }} className="mt-0.5" />
            Tenho dados de desempenho observados para calcular métricas
          </label>
          {includeObservation && (
            <div className="mt-4 rounded-xl border border-line bg-slate-50/60 p-4">
              <p className="text-xs leading-5 text-muted">Informe valores do mesmo período da campanha. Métricas que não possam ser calculadas serão exibidas como sem dados.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-xs font-medium text-slate-700 sm:col-span-2 lg:col-span-3">
                  Referência da observação *
                  <input required maxLength={150} value={observation.reference} onChange={(event) => updateObservation('reference', event.target.value)} placeholder="Ex.: exportacao-meta-2026-11" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                </label>
                {[
                  ['impressions', 'Impressões'],
                  ['reach', 'Alcance'],
                  ['clicks', 'Cliques'],
                  ['conversions', 'Conversões'],
                  ['spend', `Gasto (${currency})`],
                  ['attributedRevenue', `Receita atribuída (${currency})`],
                ].map(([field, label]) => (
                  <label key={field} className="text-xs font-medium text-slate-700">
                    {label}
                    <input type="number" min="0" step={field === 'spend' || field === 'attributedRevenue' ? '0.01' : '1'} value={observation[field]} onChange={(event) => updateObservation(field, event.target.value)} placeholder="Opcional" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : <Megaphone size={14} />}
          {loading ? 'Montando rascunho…' : 'Planejar campanha'}
        </button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-5 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Plano de campanha</h2>
              <p className="mt-1 text-xs text-muted">{result.campaignReference} · {result.platform} · {result.startDate} a {result.endDate}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${result.status === 'REVIEW_REQUIRED' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
              {result.status === 'REVIEW_REQUIRED' ? 'Revisão necessária' : 'Rascunho simulado'}
            </span>
          </div>
          {result.issues.length > 0 && <ul className="mt-4 list-inside list-disc space-y-1 text-xs text-amber-900">{result.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
          {result.performance && (
            <div className="mt-4 border-t border-line pt-4">
              <h3 className="text-xs font-semibold">Desempenho observado · {result.performance.reference}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {result.performance.metrics.map((metric) => (
                  <article key={metric.name} className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2"><h4 className="text-xs font-semibold">{metric.name}</h4><span className="text-[10px] text-muted">{statusLabel(metric.status)}</span></div>
                    <p className="mt-2 text-sm font-semibold">{metric.value ?? '—'} <span className="text-[10px] font-normal text-muted">{metric.unit}</span></p>
                    {metric.goal && <p className="mt-1 text-[10px] text-muted">Meta {metric.goal.direction === 'AT_MOST' ? '≤' : '≥'} {metric.goal.value}</p>}
                  </article>
                ))}
              </div>
              {result.performance.alerts.map((alert) => <p key={alert} className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">{alert}</p>)}
            </div>
          )}
          {result.strategy && <div className="mt-4 rounded-lg bg-indigo-50/70 p-4"><h3 className="text-xs font-semibold">Recomendação estratégica</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.strategy}</p></div>}
          {result.performance && <p className="mt-4 text-xs text-slate-600">Os indicadores podem ser consolidados no <Link to="/agentes/reports" className="font-medium text-brand underline">Agente de Relatórios e KPIs</Link>, usando a referência e a fonte desta resposta.</p>}
        </section>
      )}
    </div>
  )
}
