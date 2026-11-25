import { useState } from 'react'
import { ArrowLeft, LoaderCircle, Plus, Scale, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const MODALITIES = [
  ['PREGAO_ELETRONICO', 'Pregão eletrônico'],
  ['CONCORRENCIA', 'Concorrência'],
  ['DISPENSA', 'Dispensa'],
  ['INEXIGIBILIDADE', 'Inexigibilidade'],
  ['DIALOGO_COMPETITIVO', 'Diálogo competitivo'],
  ['CONCURSO', 'Concurso'],
  ['OUTROS', 'Outros'],
]

const DOCUMENT_TYPES = [
  ['HABILITACAO_JURIDICA', 'Habilitação jurídica'],
  ['REGULARIDADE_FISCAL_TRABALHISTA', 'Regularidade fiscal e trabalhista'],
  ['QUALIFICACAO_TECNICA', 'Qualificação técnica'],
  ['QUALIFICACAO_ECONOMICO_FINANCEIRA', 'Qualificação econômico-financeira'],
]

const BID_STATUS = {
  VIABLE: 'Viável',
  REVIEW_REQUIRED: 'Revisão necessária',
  HIGH_RISK: 'Risco alto',
}

const RISK_LEVELS = {
  LOW: 'Baixo',
  MEDIUM: 'Médio',
  HIGH: 'Alto',
}

const CHECKLIST_STATUS = {
  COMPLIANT: 'Conforme',
  PENDING: 'Pendente',
  MISSING: 'Ausente',
}

const EMPTY_DOCUMENT = {
  documentName: '',
  type: 'HABILITACAO_JURIDICA',
  provided: false,
  remarks: '',
}

function labelFrom(options, value) {
  return options.find(([option]) => option === value)?.[1] ?? value
}

function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '')
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível analisar o edital.'
}

function parseMoney(value, label, { required }) {
  const trimmed = value.trim()
  if (!trimmed) {
    return required ? { error: `Informe ${label}.` } : { omit: true }
  }
  if (!/^\d{1,14}(\.\d{1,2})?$/.test(trimmed)) {
    return { error: `${label} deve ser no mínimo 0,01, com até 14 dígitos inteiros e 2 casas decimais.` }
  }
  const amount = Number(trimmed)
  if (!Number.isFinite(amount) || amount < 0.01) {
    return { error: `${label} deve ser no mínimo 0,01.` }
  }
  return { value: amount }
}

function validateBid(input) {
  const bidReference = input.bidReference.trim()
  const issuingBody = input.issuingBody.trim()
  const objectDescription = input.objectDescription.trim()
  const noticeSummary = input.noticeSummary.trim()
  const currency = input.currency.trim()

  if (!bidReference) return { error: 'Informe o identificador do edital.' }
  if (bidReference.length > 150) return { error: 'O identificador do edital pode ter no máximo 150 caracteres.' }
  if (!issuingBody) return { error: 'Informe o órgão.' }
  if (issuingBody.length > 150) return { error: 'O órgão pode ter no máximo 150 caracteres.' }
  if (!MODALITIES.some(([value]) => value === input.modality)) return { error: 'Selecione a modalidade do edital.' }
  if (!objectDescription) return { error: 'Informe o objeto do edital.' }
  if (objectDescription.length > 2000) return { error: 'O objeto pode ter no máximo 2000 caracteres.' }
  if (!input.submissionDeadline || !input.openingDate) return { error: 'Informe o prazo de envio e a data de abertura.' }
  if (input.submissionDeadline > input.openingDate) {
    return { error: 'O prazo de envio de propostas não pode ser posterior à data de abertura.' }
  }
  if (!/^[A-Z]{3}$/.test(currency)) return { error: 'Informe a moeda com 3 letras maiúsculas, por exemplo BRL.' }

  const estimated = parseMoney(input.estimatedValue, 'o valor estimado', { required: true })
  if (estimated.error) return { error: estimated.error }
  const maximum = parseMoney(input.maxAcceptableValue, 'o valor máximo aceitável', { required: false })
  if (maximum.error) return { error: maximum.error }

  const technicalRequirements = input.requirements.map((item) => item.trim())
  if (technicalRequirements.length > 20) return { error: 'Informe no máximo 20 requisitos técnicos.' }
  if (technicalRequirements.some((item) => !item)) return { error: 'Preencha ou remova os requisitos técnicos em branco.' }
  if (technicalRequirements.some((item) => item.length > 300)) return { error: 'Cada requisito técnico pode ter no máximo 300 caracteres.' }

  if (input.documents.length > 30) return { error: 'Informe no máximo 30 documentos de habilitação.' }
  const qualificationDocuments = []
  for (const document of input.documents) {
    const documentName = document.documentName.trim()
    const remarks = document.remarks.trim()
    if (!documentName) return { error: 'Preencha ou remova os documentos sem nome.' }
    if (documentName.length > 150) return { error: 'O nome de cada documento pode ter no máximo 150 caracteres.' }
    if (!DOCUMENT_TYPES.some(([value]) => value === document.type)) return { error: 'Selecione o tipo de cada documento.' }
    if (remarks.length > 200) return { error: 'A observação de cada documento pode ter no máximo 200 caracteres.' }
    const item = { documentName, type: document.type, provided: document.provided }
    if (remarks) item.remarks = remarks
    qualificationDocuments.push(item)
  }

  if (noticeSummary.length > 4000) return { error: 'O resumo do edital pode ter no máximo 4000 caracteres.' }

  const payload = {
    bidReference,
    issuingBody,
    modality: input.modality,
    objectDescription,
    submissionDeadline: input.submissionDeadline,
    openingDate: input.openingDate,
    budget: { currency, estimatedValue: estimated.value },
  }
  if (!maximum.omit) payload.budget.maxAcceptableValue = maximum.value
  if (technicalRequirements.length > 0) payload.technicalRequirements = technicalRequirements
  if (qualificationDocuments.length > 0) payload.qualificationDocuments = qualificationDocuments
  if (noticeSummary) payload.noticeSummary = noticeSummary
  return { payload }
}

function statusClass(status) {
  if (status === 'HIGH_RISK') return 'bg-red-50 text-red-800'
  if (status === 'REVIEW_REQUIRED') return 'bg-amber-50 text-amber-800'
  return 'bg-emerald-50 text-emerald-700'
}

function riskClass(level) {
  if (level === 'HIGH') return 'bg-red-50 text-red-800'
  if (level === 'MEDIUM') return 'bg-amber-50 text-amber-800'
  return 'bg-emerald-50 text-emerald-700'
}

function checklistClass(status) {
  if (status === 'MISSING') return 'bg-red-50 text-red-800'
  if (status === 'PENDING') return 'bg-amber-50 text-amber-800'
  return 'bg-emerald-50 text-emerald-700'
}

export default function BidsWorkspace() {
  const [bidReference, setBidReference] = useState('')
  const [issuingBody, setIssuingBody] = useState('')
  const [modality, setModality] = useState('PREGAO_ELETRONICO')
  const [objectDescription, setObjectDescription] = useState('')
  const [submissionDeadline, setSubmissionDeadline] = useState('')
  const [openingDate, setOpeningDate] = useState('')
  const [currency, setCurrency] = useState('BRL')
  const [estimatedValue, setEstimatedValue] = useState('')
  const [maxAcceptableValue, setMaxAcceptableValue] = useState('')
  const [requirements, setRequirements] = useState([])
  const [documents, setDocuments] = useState([])
  const [noticeSummary, setNoticeSummary] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateDocument = (index, patch) => {
    setDocuments((current) => current.map((document, position) => (
      position === index ? { ...document, ...patch } : document
    )))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return
    const validation = validateBid({
      bidReference,
      issuingBody,
      modality,
      objectDescription,
      submissionDeadline,
      openingDate,
      currency,
      estimatedValue,
      maxAcceptableValue,
      requirements,
      documents,
      noticeSummary,
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
      setResult(await api.analyzeBid(validation.payload))
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
          <h1 className="text-[26px] font-medium">Agente de Editais e Licitações</h1>
          <p className="mt-1 text-xs text-muted">Analise prazos, riscos, checklist de habilitação e recomendações para a proposta.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
        A análise é auxiliar. Revise o resultado com uma pessoa antes de usá-lo em proposta, negociação ou decisão. O agente não publica editais, não consulta bases externas e não entra em contato com órgãos ou clientes. Não envie dados pessoais ou confidenciais além dos campos deste formulário. O resultado não é parecer jurídico vinculante e não promete vitória na licitação.
      </div>

      <form onSubmit={submit} className="mt-5 space-y-5 rounded-xl border border-line bg-white p-5 shadow-sm">
        <section>
          <h2 className="text-sm font-semibold">Identificação</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Identificador do edital *
              <input required maxLength={150} value={bidReference} onChange={(event) => setBidReference(event.target.value)} placeholder="Ex.: PE-42/2026" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Órgão *
              <input required maxLength={150} value={issuingBody} onChange={(event) => setIssuingBody(event.target.value)} placeholder="Ex.: Ministério da Gestão e Inovação" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700 md:col-span-2">
              Modalidade *
              <select required value={modality} onChange={(event) => setModality(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                {MODALITIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Prazos e objeto</h2>
          <p className="mt-1 text-[11px] leading-5 text-muted">O prazo de envio não pode ser posterior à data de abertura. Prazo já encerrado pode elevar o risco na análise.</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700 md:col-span-2">
              Objeto *
              <textarea required maxLength={2000} rows={4} value={objectDescription} onChange={(event) => setObjectDescription(event.target.value)} placeholder="Ex.: Contratação de plataforma em nuvem para inteligência e automação de processos." className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Prazo de envio *
              <input required type="date" value={submissionDeadline} onChange={(event) => setSubmissionDeadline(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Data de abertura *
              <input required type="date" value={openingDate} onChange={(event) => setOpeningDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Orçamento</h2>
          <p className="mt-1 text-[11px] leading-5 text-muted">Se o valor máximo ficar em branco, ele não é enviado. Valor estimado acima do teto pode indicar risco alto; a classificação é feita na análise.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-medium text-slate-700">
              Moeda *
              <input required pattern="[A-Z]{3}" maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Valor estimado *
              <input required type="number" min="0.01" step="0.01" value={estimatedValue} onChange={(event) => setEstimatedValue(event.target.value)} placeholder="Ex.: 350000.00" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Valor máximo aceitável
              <input type="number" min="0.01" step="0.01" value={maxAcceptableValue} onChange={(event) => setMaxAcceptableValue(event.target.value)} placeholder="Opcional" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Requisitos técnicos</h2>
              <p className="mt-1 text-[11px] text-muted">Opcional, até 20 itens. {requirements.length}/20</p>
            </div>
            <button type="button" disabled={requirements.length >= 20} onClick={() => setRequirements((current) => [...current, ''])} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} /> Adicionar requisito
            </button>
          </div>
          {requirements.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-line bg-slate-50/60 p-4 text-xs text-muted">Nenhum requisito técnico. Adicione apenas os que constam no edital.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <label className="flex-1 text-xs font-medium text-slate-700">
                    Requisito técnico {index + 1} *
                    <input required maxLength={300} value={requirement} onChange={(event) => setRequirements((current) => current.map((item, position) => position === index ? event.target.value : item))} placeholder="Ex.: Atestado de capacidade técnica" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
                  </label>
                  <button type="button" aria-label={`Remover requisito ${index + 1}`} onClick={() => setRequirements((current) => current.filter((_, position) => position !== index))} className="mt-6 rounded p-1 text-muted hover:bg-red-50 hover:text-red-700">
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
              <h2 className="text-sm font-semibold">Documentos de habilitação</h2>
              <p className="mt-1 text-[11px] leading-5 text-muted">Opcional, até 30 itens. Marque os que já foram providenciados. Três ou mais pendências podem resultar em risco alto.</p>
            </div>
            <button type="button" disabled={documents.length >= 30} onClick={() => setDocuments((current) => [...current, { ...EMPTY_DOCUMENT }])} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} /> Adicionar documento
            </button>
          </div>
          {documents.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-line bg-slate-50/60 p-4 text-xs text-muted">Nenhum documento informado. Adicione os itens de habilitação que quiser conferir.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {documents.map((document, index) => (
                <section key={index} className="rounded-xl border border-line bg-slate-50/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold">Documento {index + 1}</h3>
                    <button type="button" aria-label={`Remover documento ${index + 1}`} onClick={() => setDocuments((current) => current.filter((_, position) => position !== index))} className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-700">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-xs font-medium text-slate-700">
                      Nome do documento {index + 1} *
                      <input required maxLength={150} value={document.documentName} onChange={(event) => updateDocument(index, { documentName: event.target.value })} placeholder="Ex.: Contrato Social consolidado" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                      Tipo do documento {index + 1} *
                      <select required value={document.type} onChange={(event) => updateDocument(index, { type: event.target.value })} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                        {DOCUMENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 md:col-span-2">
                      <input type="checkbox" checked={document.provided} onChange={(event) => updateDocument(index, { provided: event.target.checked })} />
                      Documento {index + 1} já providenciado
                    </label>
                    <label className="text-xs font-medium text-slate-700 md:col-span-2">
                      Observação do documento {index + 1}
                      <input maxLength={200} value={document.remarks} onChange={(event) => updateDocument(index, { remarks: event.target.value })} placeholder="Opcional" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
                    </label>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-line pt-5">
          <label className="text-xs font-medium text-slate-700">
            Resumo do edital
            <textarea maxLength={4000} rows={3} value={noticeSummary} onChange={(event) => setNoticeSummary(event.target.value)} placeholder="Opcional. Ex.: Pregão com critério de julgamento menor preço por item." className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
          </label>
        </section>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : <Scale size={14} />}
          {loading ? 'Analisando edital…' : 'Analisar edital'}
        </button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-5 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Resultado da análise</h2>
              <p className="mt-1 text-xs text-muted">{result.bidReference} · {result.issuingBody} · {labelFrom(MODALITIES, result.modality)}</p>
              <p className="mt-1 text-xs text-muted">Envio {formatDate(result.submissionDeadline)} · Abertura {formatDate(result.openingDate)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusClass(result.status)}`}>{BID_STATUS[result.status] ?? result.status}</span>
              <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${riskClass(result.riskLevel)}`}>Risco {RISK_LEVELS[result.riskLevel] ?? result.riskLevel}</span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-600">
            Prazo de envio já encerrado, valor estimado acima do teto ou três ou mais documentos não providenciados podem ser classificados como risco alto. Nesse caso, o parecer estratégico não é gerado: use os alertas e o checklist. Uma pessoa deve revisar este resultado antes de qualquer proposta ou decisão.
          </p>

          {(result.issues ?? []).length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold">Alertas</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-900">
                {result.issues.map((issue, index) => <li key={`${issue}-${index}`}>{issue}</li>)}
              </ul>
            </div>
          )}

          {(result.checklist ?? []).length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              <h3 className="text-xs font-semibold">Checklist de habilitação</h3>
              <ul className="mt-3 space-y-3">
                {result.checklist.map((entry, index) => (
                  <li key={`${entry.type}-${entry.item}-${index}`} className="rounded-lg border border-line p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold">{entry.item}</h4>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${checklistClass(entry.status)}`}>{CHECKLIST_STATUS[entry.status] ?? entry.status}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted">{labelFrom(DOCUMENT_TYPES, entry.type)}</p>
                    {entry.observation && <p className="mt-2 text-xs leading-5 text-slate-600">{entry.observation}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.strategicRecommendations && (
            <div className="mt-4 rounded-lg bg-indigo-50/70 p-4">
              <h3 className="text-xs font-semibold">Parecer para a proposta</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.strategicRecommendations}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
