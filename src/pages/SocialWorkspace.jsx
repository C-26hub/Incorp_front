import { useState } from 'react'
import { ArrowLeft, CalendarCheck, LoaderCircle, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

function localDateTime(value = new Date()) {
  const date = new Date(value.getTime() - value.getTimezoneOffset() * 60000)
  return date.toISOString().slice(0, 16)
}

function defaultPlannedTime() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(10, 0, 0, 0)
  return localDateTime(date)
}

function parseDateTimes(value, required = false) {
  const entries = value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean)
  if (required && entries.length === 0) throw new Error('Informe pelo menos um horário aprovado pelo calendário.')
  const parsed = entries.map((item) => {
    const date = new Date(item)
    if (Number.isNaN(date.getTime())) throw new Error(`Horário inválido: ${item}`)
    return date.toISOString()
  })
  return parsed
}

function errorText(error) {
  return error instanceof Error ? error.message : 'Não foi possível validar o plano de publicação.'
}

export default function SocialWorkspace() {
  const [platform, setPlatform] = useState('INSTAGRAM')
  const [format, setFormat] = useState('POST')
  const [contentReference, setContentReference] = useState('')
  const [caption, setCaption] = useState('')
  const [contentBrandVersion, setContentBrandVersion] = useState('v1')
  const [currentBrandVersion, setCurrentBrandVersion] = useState('v1')
  const [plannedAt, setPlannedAt] = useState(defaultPlannedTime)
  const [approvedSlots, setApprovedSlots] = useState('')
  const [occupiedSlots, setOccupiedSlots] = useState('')
  const [minimumSpacingMinutes, setMinimumSpacingMinutes] = useState('15')
  const [rulesReference, setRulesReference] = useState('Regras da plataforma - revisar antes de usar')
  const [maxCaptionCharacters, setMaxCaptionCharacters] = useState('2200')
  const [allowedMimeTypes, setAllowedMimeTypes] = useState('image/jpeg, image/png, video/mp4')
  const [assetRequired, setAssetRequired] = useState(false)
  const [hasAsset, setHasAsset] = useState(false)
  const [asset, setAsset] = useState({ mimeType: 'image/png', width: '1080', height: '1080', sizeBytes: '150000' })
  const [confirmed, setConfirmed] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateAsset = (field, value) => setAsset((current) => ({ ...current, [field]: value }))

  const validate = async (event) => {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const request = {
        platform,
        format,
        contentReference: contentReference.trim(),
        caption,
        asset: hasAsset ? {
          mimeType: asset.mimeType.trim(),
          width: Number(asset.width),
          height: Number(asset.height),
          sizeBytes: Number(asset.sizeBytes),
        } : undefined,
        technicalRules: {
          reference: rulesReference.trim(),
          maxCaptionCharacters: Number(maxCaptionCharacters),
          assetRequired,
          allowedMimeTypes: allowedMimeTypes.split(',').map((item) => item.trim()).filter(Boolean),
          requiredWidth: null,
          requiredHeight: null,
          maxAssetBytes: null,
        },
        contentBrandVersion: contentBrandVersion.trim(),
        currentBrandVersion: currentBrandVersion.trim(),
        plannedAt: new Date(plannedAt).toISOString(),
        approvedSlots: parseDateTimes(approvedSlots, true),
        occupiedSlots: parseDateTimes(occupiedSlots),
        minimumSpacingMinutes: Number(minimumSpacingMinutes),
        interactions: [],
        confirmed,
      }
      setResult(await api.planSocialPublication(request))
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
          <h1 className="text-[26px] font-medium">Agente de Mídias Sociais</h1>
          <p className="mt-1 text-xs text-muted">Confira requisitos, calendário e versão da marca antes de simular uma publicação.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">● API conectada</span>
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4 text-xs leading-5 text-sky-900">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        <p>Este agente valida somente as regras e os horários que você informar. Ele não consulta calendários ou diretrizes oficiais e não publica nem agenda conteúdo em nenhuma rede.</p>
      </div>

      <form onSubmit={validate} className="mt-5 space-y-5 rounded-xl border border-line bg-white p-5 shadow-sm">
        <section>
          <h2 className="text-sm font-semibold">Publicação</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Plataforma *
              <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                <option value="INSTAGRAM">Instagram</option><option value="FACEBOOK">Facebook</option><option value="LINKEDIN">LinkedIn</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-700">
              Formato *
              <select value={format} onChange={(event) => setFormat(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal">
                <option value="POST">Post</option><option value="STORY">Story</option><option value="REEL">Reel</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-700">
              Referência do conteúdo *
              <input required maxLength={200} value={contentReference} onChange={(event) => setContentReference(event.target.value)} placeholder="Ex.: campanha-novembro-post-01" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Versão da marca usada no conteúdo *
              <input required maxLength={100} value={contentBrandVersion} onChange={(event) => setContentBrandVersion(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Versão atual das diretrizes de marca *
              <input required maxLength={100} value={currentBrandVersion} onChange={(event) => setCurrentBrandVersion(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700 md:col-span-2">
              Legenda final *
              <textarea required maxLength={12000} rows={4} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Cole o texto final aprovado para revisão." className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Calendário</h2>
          <p className="mt-1 text-[11px] leading-5 text-muted">Use horários autorizados no calendário real da equipe; esta tela apenas compara os valores informados.</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Horário planejado *
              <input required type="datetime-local" value={plannedAt} onChange={(event) => setPlannedAt(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Intervalo mínimo entre publicações (minutos) *
              <input required type="number" min="0" max="1440" value={minimumSpacingMinutes} onChange={(event) => setMinimumSpacingMinutes(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Horários aprovados *
              <textarea required rows={3} value={approvedSlots} onChange={(event) => setApprovedSlots(event.target.value)} placeholder="Um horário por linha, ex.: 2026-11-20T10:00" className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Horários ocupados (opcional)
              <textarea rows={3} value={occupiedSlots} onChange={(event) => setOccupiedSlots(event.target.value)} placeholder="Um horário por linha, no mesmo formato" className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
        </section>

        <section className="border-t border-line pt-5">
          <h2 className="text-sm font-semibold">Regras técnicas de referência</h2>
          <p className="mt-1 text-[11px] leading-5 text-muted">Informe regras verificadas pela equipe para o tipo de publicação selecionado.</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-700">
              Fonte/versão das regras *
              <input required maxLength={200} value={rulesReference} onChange={(event) => setRulesReference(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Máximo de caracteres da legenda *
              <input required type="number" min="1" value={maxCaptionCharacters} onChange={(event) => setMaxCaptionCharacters(event.target.value)} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-medium text-slate-700 md:col-span-2">
              Tipos MIME permitidos (separados por vírgula) *
              <input required value={allowedMimeTypes} onChange={(event) => setAllowedMimeTypes(event.target.value)} placeholder="image/jpeg, image/png, video/mp4" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" checked={assetRequired} onChange={(event) => setAssetRequired(event.target.checked)} />
              A plataforma exige um arquivo de mídia
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" checked={hasAsset} onChange={(event) => setHasAsset(event.target.checked)} />
              Informar os dados de um arquivo de mídia
            </label>
            {hasAsset && (
              <>
                <label className="text-xs font-medium text-slate-700">
                  Tipo MIME
                  <input value={asset.mimeType} onChange={(event) => updateAsset('mimeType', event.target.value)} placeholder="image/png" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal" />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['width', 'height', 'sizeBytes'].map((field) => (
                    <label key={field} className="text-xs font-medium text-slate-700">
                      {field === 'width' ? 'Largura (px)' : field === 'height' ? 'Altura (px)' : 'Tamanho (bytes)'}
                      <input type="number" min="1" value={asset[field]} onChange={(event) => updateAsset(field, event.target.value)} className="mt-1.5 w-full rounded-lg border border-line px-2 py-2.5 text-sm font-normal" />
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <label className="flex items-start gap-2 border-t border-line pt-4 text-xs leading-5 text-slate-700">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5" />
          Confirmo que revisei os dados e quero executar a simulação. A confirmação não publica nem agenda conteúdo.
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : <CalendarCheck size={14} />}
          {loading ? 'Validando plano…' : confirmed ? 'Validar e simular' : 'Validar publicação'}
        </button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-5 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Resultado da validação</h2>
              <p className="mt-1 text-xs text-muted">{result.platform} · {result.format} · {new Date(result.plannedAt).toLocaleString('pt-BR')}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${result.status === 'REVIEW_REQUIRED' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
              {result.status === 'REVIEW_REQUIRED' ? 'Revisão necessária' : result.status === 'SIMULATED' ? 'Simulação concluída' : 'Pronto para confirmação'}
            </span>
          </div>
          {result.issues.length > 0 ? (
            <ul className="mt-4 list-inside list-disc space-y-1 text-xs text-amber-900">{result.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
          ) : (
            <p className="mt-4 text-xs text-slate-600">Regras conferidas com base nos dados fornecidos ({result.technicalRulesReference}). Nenhuma integração com a rede social foi executada.</p>
          )}
          {result.simulation && <p className="mt-3 break-all rounded-lg bg-slate-50 p-3 text-xs">Referência de simulação: <strong>{result.simulation.reference}</strong></p>}
          {result.pendingInteractions.length > 0 && (
            <div className="mt-4 border-t border-line pt-3">
              <h3 className="text-xs font-semibold">Interações pendentes</h3>
              {result.pendingInteractions.map((interaction) => <p key={interaction.reference} className="mt-2 text-xs">{interaction.type === 'COMMENT' ? 'Comentário' : 'Mensagem direta'}: {interaction.reference} {interaction.url && <a className="text-brand underline" href={interaction.url} target="_blank" rel="noreferrer">Abrir</a>}</p>)}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
