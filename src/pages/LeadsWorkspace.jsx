import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, FileUp, LoaderCircle, Plus, Target, UserRound, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { parseLeadCsv } from '../services/leadCsv'

const EMPTY_LEAD = {
  name: '',
  company: '',
  jobTitle: '',
  email: '',
  phone: '',
  industry: '',
  companySize: '',
  location: '',
  website: '',
  notes: '',
}

const FIT_LABELS = {
  QUALIFIED: 'Boa aderência',
  REVIEW: 'Revisar dados',
  NOT_QUALIFIED: 'Baixa aderência',
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.'
}

function updateLead(leads, updated) {
  return leads.map((lead) => lead.id === updated.id ? { ...lead, ...updated } : lead)
}

export default function LeadsWorkspace() {
  const [leads, setLeads] = useState([])
  const [form, setForm] = useState(EMPTY_LEAD)
  const [idealCustomerProfile, setIdealCustomerProfile] = useState('')
  const [csvPreview, setCsvPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [qualifyingId, setQualifyingId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const fileInput = useRef(null)

  const loadLeads = useCallback(async () => {
    try {
      setLeads(await api.listLeads())
    } catch (loadError) {
      setError(errorText(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadLeads() }, [loadLeads])

  const saveLead = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const created = await api.createLead(form)
      setLeads((current) => [created, ...current])
      setForm(EMPTY_LEAD)
      setNotice('Lead cadastrado.')
    } catch (saveError) {
      setError(errorText(saveError))
    } finally {
      setSaving(false)
    }
  }

  const selectCsv = async (event) => {
    const file = event.target.files?.[0]
    setCsvPreview(null)
    setError('')
    setNotice('')
    if (!file) return
    try {
      if (file.size > 1_000_000) throw new Error('O arquivo CSV deve ter no máximo 1 MB.')
      const rows = parseLeadCsv(await file.text())
      setCsvPreview({ fileName: file.name, leads: rows })
    } catch (parseError) {
      setError(errorText(parseError))
      event.target.value = ''
    }
  }

  const importCsv = async () => {
    if (!csvPreview || importing) return
    setImporting(true)
    setError('')
    setNotice('')
    try {
      const imported = await api.importLeads(csvPreview.leads)
      setLeads((current) => [...imported, ...current])
      setCsvPreview(null)
      if (fileInput.current) fileInput.current.value = ''
      setNotice(`${imported.length} lead(s) importado(s) com sucesso.`)
    } catch (importError) {
      setError(errorText(importError))
    } finally {
      setImporting(false)
    }
  }

  const qualify = async (lead) => {
    if (!idealCustomerProfile.trim() || qualifyingId) return
    setQualifyingId(lead.id)
    setError('')
    setNotice('')
    try {
      const result = await api.qualifyLead(lead.id, idealCustomerProfile.trim())
      setLeads((current) => updateLead(current, result))
      setNotice(`Qualificação de ${lead.name} concluída. Revise a recomendação antes de abordar o lead.`)
    } catch (qualificationError) {
      setError(errorText(qualificationError))
    } finally {
      setQualifyingId('')
    }
  }

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/agentes" className="mb-4 inline-flex items-center gap-2 text-xs text-muted hover:text-brand">
        <ArrowLeft size={14} /> Voltar para agentes
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-medium">Prospecção e Qualificação de Leads</h1>
          <p className="mt-1 text-xs text-muted">Cadastre leads ou importe um CSV; compare-os com o perfil ideal de cliente da sua empresa.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <section className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-800" htmlFor="ideal-customer-profile">
          <span className="flex items-center gap-2"><Target size={16} /> Perfil ideal de cliente (ICP) *</span>
          <textarea
            id="ideal-customer-profile"
            value={idealCustomerProfile}
            onChange={(event) => setIdealCustomerProfile(event.target.value)}
            rows={3}
            maxLength={3000}
            placeholder="Ex.: empresas de serviços B2B com 20 a 200 funcionários, localizadas no Sudeste, que precisam automatizar processos comerciais."
            className="mt-2 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-brand"
          />
        </label>
        <p className="mt-1 text-[11px] text-muted">O perfil e os dados de empresa, cargo, setor, porte, localização e observações são enviados ao Gemini. Nome e dados de contato não são enviados; não há consulta externa nem contato automático.</p>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={saveLead} className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><UserRound size={16} /> Cadastrar lead</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Nome *
              <input required maxLength={150} value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Empresa
              <input maxLength={200} value={form.company} onChange={(event) => updateForm('company', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Cargo
              <input maxLength={120} value={form.jobTitle} onChange={(event) => updateForm('jobTitle', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              E-mail
              <input type="email" maxLength={254} value={form.email} onChange={(event) => updateForm('email', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Telefone
              <input type="tel" maxLength={50} value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Setor
              <input maxLength={150} value={form.industry} onChange={(event) => updateForm('industry', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Porte da empresa
              <input maxLength={100} value={form.companySize} onChange={(event) => updateForm('companySize', event.target.value)} placeholder="Ex.: 20–200 funcionários" className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Localização
              <input maxLength={200} value={form.location} onChange={(event) => updateForm('location', event.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
            <label className="text-xs font-medium text-slate-700 sm:col-span-2">
              Observações
              <textarea maxLength={2000} rows={2} value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} className="mt-1 w-full resize-y rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-brand" />
            </label>
          </div>
          <button type="submit" disabled={saving} className="mt-4 flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {saving ? <LoaderCircle size={14} className="animate-spin" /> : <Plus size={14} />}
            {saving ? 'Salvando…' : 'Cadastrar lead'}
          </button>
        </form>

        <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><FileUp size={16} /> Importar CSV</h2>
          <p className="mt-2 text-xs leading-5 text-muted">
            Arquivo separado por vírgula ou ponto e vírgula, com cabeçalho. A coluna <code>nome</code> é obrigatória; são aceitos cabeçalhos em português ou inglês. Até 100 leads por arquivo.
          </p>
          <label className="mt-4 block text-xs font-medium text-slate-700">
            Arquivo CSV
            <input ref={fileInput} type="file" accept=".csv,text/csv" onChange={(event) => void selectCsv(event)} className="mt-1.5 block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-800" />
          </label>
          {csvPreview && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium">{csvPreview.fileName}: {csvPreview.leads.length} lead(s) pronto(s) para importação.</p>
              <button onClick={() => void importCsv()} disabled={importing} className="mt-3 rounded-lg bg-indigo-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">
                {importing ? 'Importando…' : 'Confirmar importação'}
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="mt-7">
        <h2 className="flex items-center gap-2 text-sm font-semibold"><Users size={16} /> Leads cadastrados <span className="text-xs font-normal text-muted">{leads.length}</span></h2>
        {loading ? (
          <p className="mt-4 text-xs text-muted">Carregando leads…</p>
        ) : leads.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-line bg-white p-8 text-center text-xs text-muted">Nenhum lead cadastrado. Adicione um lead ou importe um CSV.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-xl border border-line bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{lead.name}</h3>
                    <p className="mt-1 text-xs text-muted">{[lead.jobTitle, lead.company, lead.industry, lead.location].filter(Boolean).join(' · ') || lead.email || 'Sem detalhes adicionais'}</p>
                  </div>
                  <button
                    onClick={() => void qualify(lead)}
                    disabled={!idealCustomerProfile.trim() || Boolean(qualifyingId)}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-900 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {qualifyingId === lead.id ? 'Qualificando…' : lead.fit ? 'Requalificar' : 'Qualificar lead'}
                  </button>
                </div>
                {lead.fit && (
                  <div className="mt-4 border-t border-line pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold">{FIT_LABELS[lead.fit]}</span>
                      <span className="text-xs font-medium text-slate-700">Pontuação: {lead.score}/100</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{lead.reasoning}</p>
                    <p className="mt-2 text-xs leading-5"><strong>Próximo passo sugerido:</strong> {lead.nextStep}</p>
                    <p className="mt-2 text-[10px] text-muted">Recomendação gerada por IA; valide as informações antes de abordar o lead.</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
