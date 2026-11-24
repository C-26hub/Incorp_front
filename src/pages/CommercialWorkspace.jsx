import { useState } from 'react'
import { ArrowLeft, Handshake, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const STAGES = [
  ['PROSPECTING', 'Prospecção'],
  ['DISCOVERY', 'Descoberta'],
  ['PROPOSAL', 'Proposta'],
  ['NEGOTIATION', 'Negociação'],
  ['CLOSING', 'Fechamento'],
]

const COMMERCIAL_STATUS = {
  READY: 'Pronto para avanço',
  REVIEW_REQUIRED: 'Revisão necessária',
}

const EMPTY_OBJECTION = {
  category: '',
  description: '',
  currentAttempt: '',
}

function labelFrom(options, value) {
  return options.find(([option]) => option === value)?.[1] ?? value
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível preparar o direcionamento comercial.'
}

function parseAmount(value) {
  const trimmed = value.trim()
  if (!trimmed) return { error: 'Informe o valor da oportunidade.' }
  if (!/^\d{1,14}(\.\d{1,2})?$/.test(trimmed)) {
    return { error: 'O valor da oportunidade deve ser no mínimo 0,01, com até 14 dígitos inteiros e 2 casas decimais.' }
  }
  const amount = Number(trimmed)
  if (!Number.isFinite(amount) || amount < 0.01) {
    return { error: 'O valor da oportunidade deve ser no mínimo 0,01.' }
  }
  return { value: amount }
}

function nonEmptyLines(values, { max, itemLimit, emptyMessage, limitMessage, lengthMessage }) {
  const lines = values.map((item) => item.trim())
  if (lines.length > max) return { error: limitMessage }
  if (lines.some((item) => !item)) return { error: emptyMessage }
  if (lines.some((item) => item.length > itemLimit)) return { error: lengthMessage }
  return { values: lines }
}

function validateOpportunity(input) {
  const opportunityReference = input.opportunityReference.trim()
  const clientName = input.clientName.trim()
  const clientSegment = input.clientSegment.trim()
  const decisionMakers = input.decisionMakers.trim()
  const productOffered = input.productOffered.trim()
  const notes = input.notes.trim()
  const currency = input.currency.trim()

  if (!opportunityReference) return { error: 'Informe a referência da oportunidade.' }
  if (opportunityReference.length > 150) return { error: 'A referência da oportunidade pode ter no máximo 150 caracteres.' }
  if (!clientName) return { error: 'Informe o cliente.' }
  if (clientName.length > 150) return { error: 'O nome do cliente pode ter no máximo 150 caracteres.' }
  if (!clientSegment) return { error: 'Informe o segmento do cliente.' }
  if (clientSegment.length > 100) return { error: 'O segmento pode ter no máximo 100 caracteres.' }
  if (!decisionMakers) return { error: 'Informe quem decide.' }
  if (decisionMakers.length > 500) return { error: 'Os decisores podem ter no máximo 500 caracteres.' }
  if (!productOffered) return { error: 'Informe o produto ou serviço oferecido.' }
  if (productOffered.length > 150) return { error: 'O produto oferecido pode ter no máximo 150 caracteres.' }
  if (!STAGES.some(([value]) => value === input.stage)) return { error: 'Selecione o estágio da oportunidade.' }
  if (!/^[A-Z]{3}$/.test(currency)) return { error: 'Informe a moeda com 3 letras maiúsculas, por exemplo BRL.' }

  const amount = parseAmount(input.amount)
  if (amount.error) return { error: amount.error }

  const painPoints = nonEmptyLines(input.painPoints, {
    max: 10,
    itemLimit: 300,
    emptyMessage: 'Preencha ou remova as dores em branco.',
    limitMessage: 'Informe no máximo 10 dores.',
    lengthMessage: 'Cada dor pode ter no máximo 300 caracteres.',
  })
  if (painPoints.error) return { error: painPoints.error }
  if (painPoints.values.length < 1) return { error: 'Informe ao menos uma dor do cliente.' }

  const competitors = nonEmptyLines(input.competitors, {
    max: 10,
    itemLimit: 150,
    emptyMessage: 'Preencha ou remova os concorrentes em branco.',
    limitMessage: 'Informe no máximo 10 concorrentes.',
    lengthMessage: 'Cada concorrente pode ter no máximo 150 caracteres.',
  })
  if (competitors.error) return { error: competitors.error }

  if (input.objections.length > 10) return { error: 'Informe no máximo 10 objeções.' }
  const objections = []
  for (const objection of input.objections) {
    const category = objection.category.trim()
    const description = objection.description.trim()
    const currentAttempt = objection.currentAttempt.trim()
    if (!category || !description) return { error: 'Preencha ou remova as objeções sem categoria ou descrição.' }
    if (category.length > 150) return { error: 'A categoria da objeção pode ter no máximo 150 caracteres.' }
    if (description.length > 500) return { error: 'A descrição da objeção pode ter no máximo 500 caracteres.' }
    if (currentAttempt.length > 300) return { error: 'A tentativa atual pode ter no máximo 300 caracteres.' }
    const item = { category, description }
    if (currentAttempt) item.currentAttempt = currentAttempt
    objections.push(item)
  }

  if (notes.length > 2000) return { error: 'As observações podem ter no máximo 2000 caracteres.' }

  const payload = {
    opportunityReference,
    clientName,
    clientSegment,
    decisionMakers,
    productOffered,
    stage: input.stage,
    dealValue: { currency, amount: amount.value },
    painPoints: painPoints.values,
  }
  if (competitors.values.length > 0) payload.competitors = competitors.values
  if (objections.length > 0) payload.objections = objections
  if (notes) payload.notes = notes
  return { payload }
}

function statusClass(status) {
  return status === 'REVIEW_REQUIRED' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'
}

export default function CommercialWorkspace() {
  const [opportunityReference, setOpportunityReference] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientSegment, setClientSegment] = useState('')
  const [decisionMakers, setDecisionMakers] = useState('')
  const [productOffered, setProductOffered] = useState('')
  const [stage, setStage] = useState('PROSPECTING')
  const [currency, setCurrency] = useState('BRL')
  const [amount, setAmount] = useState('')
  const [painPoints, setPainPoints] = useState([''])
  const [competitors, setCompetitors] = useState([])
  const [objections, setObjections] = useState([])
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateLine = (setter, index, value) => {
    setter((current) => current.map((item, position) => position === index ? value : item))
  }

  const updateObjection = (index, patch) => {
    setObjections((current) => current.map((objection, position) => (
      position === index ? { ...objection, ...patch } : objection
    )))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return
    const validation = validateOpportunity({
      opportunityReference,
      clientName,
      clientSegment,
      decisionMakers,
      productOffered,
      stage,
      currency,
      amount,
      painPoints,
      competitors,
      objections,
      notes,
    })
    if (validation.error) {
      setError(validation.error)
      setResult(null)
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    try {
      setResult(await api.adviseCommercial(validation.payload))
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
          <h1 className="text-[26px] font-medium">Agente de Apoio Comercial</h1>
          <p className="mt-1 text-xs text-muted">Organize a estratégia da oportunidade, o diagnóstico de objeções e o próximo passo de fechamento.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
        A análise é auxiliar. Revise o resultado com uma pessoa antes de usá-lo em proposta, negociação ou decisão. O agente não publica informações, não consulta bases externas e não entra em contato com clientes. Não envie dados pessoais ou confidenciais além dos campos deste formulário. O resultado não promete fechamento de venda.
      </div>

      <form onSubmit={submit} className="mt-5 space-y-5 rounded-xl border border-line bg-white p-5 shadow-sm">
        <section>
          <h2 className="text-sm font-semibold">Oportunidade</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Referência da oportunidade *
              <input required maxLength={150} value={opportunityReference} onChange={(event) => setOpportunityReference(event.target.value)} placeholder="Ex.: OPP-2026-089" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Cliente *
              <input required maxLength={150} value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Ex.: Grupo Varejo Brasil" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Segmento *
              <input required maxLength={100} value={clientSegment} onChange={(event) => setClientSegment(event.target.value)} placeholder="Ex.: Varejo Omnichannel" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Estágio *
              <select required value={stage} onChange={(event) => setStage(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                {STAGES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-700 md:col-span-2">
              Decisores *
              <input required maxLength={500} value={decisionMakers} onChange={(event) => setDecisionMakers(event.target.value)} placeholder="Ex.: Diretora de E-commerce e Gerente de TI" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700 md:col-span-2">
              Produto oferecido *
              <input required maxLength={150} value={productOffered} onChange={(event) => setProductOffered(event.target.value)} placeholder="Ex.: Plataforma de Personalização de Vitrines" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Valor</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Moeda *
              <input required pattern="[A-Z]{3}" maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Valor da oportunidade *
              <input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Ex.: 85000.00" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Dores do cliente</h2>
              <p className="mt-1 text-[11px] text-muted">Informe de 1 a 10 dores. {painPoints.length}/10</p>
            </div>
            <button type="button" disabled={painPoints.length >= 10} onClick={() => setPainPoints((current) => [...current, ''])} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} /> Adicionar dor
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {painPoints.map((painPoint, index) => (
              <div key={index} className="flex items-start gap-2">
                <label className="flex-1 text-xs font-medium text-slate-700">
                  Dor {index + 1} *
                  <input required maxLength={300} value={painPoint} onChange={(event) => updateLine(setPainPoints, index, event.target.value)} placeholder="Ex.: Taxa de conversão estagnada no mobile" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
                </label>
                {painPoints.length > 1 && (
                  <button type="button" aria-label={`Remover dor ${index + 1}`} onClick={() => setPainPoints((current) => current.filter((_, position) => position !== index))} className="mt-6 rounded p-1 text-muted hover:bg-red-50 hover:text-red-700">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Concorrentes</h2>
              <p className="mt-1 text-[11px] leading-5 text-muted">Opcional, até 10. Cinco ou mais concorrentes podem ser classificados como revisão necessária, sem impedir o envio.</p>
            </div>
            <button type="button" disabled={competitors.length >= 10} onClick={() => setCompetitors((current) => [...current, ''])} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} /> Adicionar concorrente
            </button>
          </div>
          {competitors.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-line bg-slate-50/60 p-4 text-xs text-muted">Nenhum concorrente informado.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="flex items-start gap-2">
                  <label className="flex-1 text-xs font-medium text-slate-700">
                    Concorrente {index + 1} *
                    <input required maxLength={150} value={competitor} onChange={(event) => updateLine(setCompetitors, index, event.target.value)} placeholder="Ex.: Concorrente Alfa" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
                  </label>
                  <button type="button" aria-label={`Remover concorrente ${index + 1}`} onClick={() => setCompetitors((current) => current.filter((_, position) => position !== index))} className="mt-6 rounded p-1 text-muted hover:bg-red-50 hover:text-red-700">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-line pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Objeções</h2>
              <p className="mt-1 text-[11px] leading-5 text-muted">Opcional, até 10. Objeções em aberto no estágio de fechamento podem pedir revisão; o envio continua disponível para a análise classificar.</p>
            </div>
            <button type="button" disabled={objections.length >= 10} onClick={() => setObjections((current) => [...current, { ...EMPTY_OBJECTION }])} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} /> Adicionar objeção
            </button>
          </div>
          {objections.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-line bg-slate-50/60 p-4 text-xs text-muted">Nenhuma objeção informada.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {objections.map((objection, index) => (
                <section key={index} className="rounded-xl border border-line bg-slate-50/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold">Objeção {index + 1}</h3>
                    <button type="button" aria-label={`Remover objeção ${index + 1}`} onClick={() => setObjections((current) => current.filter((_, position) => position !== index))} className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-700">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-xs font-medium text-slate-700">
                      Categoria da objeção {index + 1} *
                      <input required maxLength={150} value={objection.category} onChange={(event) => updateObjection(index, { category: event.target.value })} placeholder="Ex.: Preço" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Descrição da objeção {index + 1} *
                      <textarea required maxLength={500} rows={3} value={objection.description} onChange={(event) => updateObjection(index, { description: event.target.value })} placeholder="Ex.: Cliente alega que o setup está acima do orçamento previsto." className="mt-1.5 w-full resize-y rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Tentativa atual {index + 1}
                      <input maxLength={300} value={objection.currentAttempt} onChange={(event) => updateObjection(index, { currentAttempt: event.target.value })} placeholder="Opcional. Ex.: Oferecemos parcelamento do setup em 3 vezes." className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-line pt-5">
          <label className="text-xs font-medium text-slate-700">
            Observações
            <textarea maxLength={2000} rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Opcional. Ex.: Cliente demonstrou interesse no piloto, mas precisa da validação do CFO." className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
          </label>
        </section>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : <Handshake size={14} />}
          {loading ? 'Gerando direcionamento…' : 'Gerar direcionamento'}
        </button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-5 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Direcionamento comercial</h2>
              <p className="mt-1 text-xs text-muted">{result.opportunityReference} · {result.clientName} · {labelFrom(STAGES, result.stage)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusClass(result.status)}`}>{COMMERCIAL_STATUS[result.status] ?? result.status}</span>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-600">
            Objeções em aberto no estágio de fechamento, ou cinco ou mais concorrentes, aparecem aqui como alertas. O direcionamento é auxiliar e precisa ser revisado por uma pessoa antes da negociação ou do fechamento.
          </p>

          {(result.issues ?? []).length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold">Alertas</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-900">
                {result.issues.map((issue, index) => <li key={`${issue}-${index}`}>{issue}</li>)}
              </ul>
            </div>
          )}

          {(result.objectionStrategies ?? []).length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              <h3 className="text-xs font-semibold">Objeções e ângulos</h3>
              <div className="mt-3 space-y-3">
                {result.objectionStrategies.map((item, index) => (
                  <article key={`${item.category}-${index}`} className="rounded-lg border border-line p-3">
                    <h4 className="text-xs font-semibold">{item.category}</h4>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-700"><strong>Ângulo recomendado:</strong> {item.recommendedAngle}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-lg bg-indigo-50/70 p-4">
            <h3 className="text-xs font-semibold">Direcionamento de valor</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.commercialStrategy}</p>
          </div>
        </section>
      )}
    </div>
  )
}
