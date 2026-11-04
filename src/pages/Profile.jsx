import { useRef, useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import UserAvatar from '../components/UserAvatar'

const MAX_FILE_MB = 5
const PHOTO_SIZE = 320 // lado da foto salva, em pixels

// Recorta a imagem em quadrado (centralizado) e reduz, para caber no localStorage.
function prepareImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('decode'))
      img.onload = () => {
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        const canvas = document.createElement('canvas')
        canvas.width = PHOTO_SIZE
        canvas.height = PHOTO_SIZE
        canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

const inputClass =
  'h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10'

export default function Profile() {
  const { profile, updateProfile } = useProfile()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    photo: profile.photo,
  })
  const [erro, setErro] = useState('')
  const [erroFoto, setErroFoto] = useState('')
  const [salvo, setSalvo] = useState(false)

  const alterado =
    form.name !== profile.name ||
    form.email !== profile.email ||
    form.role !== profile.role ||
    form.photo !== profile.photo

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErro('')
    setSalvo(false)
  }

  async function onPickPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // permite escolher o mesmo arquivo de novo
    if (!file) return
    setErroFoto('')

    if (!file.type.startsWith('image/')) {
      setErroFoto('Escolha um arquivo de imagem (JPG, PNG ou WebP).')
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErroFoto(`A imagem deve ter no máximo ${MAX_FILE_MB} MB.`)
      return
    }

    try {
      setField('photo', await prepareImage(file))
    } catch {
      setErroFoto('Não foi possível ler essa imagem. Tente outro arquivo.')
    }
  }

  function onSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setErro('Informe seu nome.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErro('Informe um e-mail válido.')
      return
    }

    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      photo: form.photo,
    })
    setSalvo(true)
  }

  function onCancel() {
    setForm({ name: profile.name, email: profile.email, role: profile.role, photo: profile.photo })
    setErro('')
    setErroFoto('')
    setSalvo(false)
  }

  return (
    <div>
      <h1 className="text-[28px] font-medium">Meu perfil</h1>
      <p className="mt-1 text-sm text-muted">Atualize seus dados e sua foto.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* FOTO */}
        <section className="flex flex-col items-center rounded-2xl border border-line bg-white p-6 text-center">
          <UserAvatar size={144} photo={form.photo} name={form.name} />
          <p className="mt-4 text-[15px] font-medium">{form.name || 'Sem nome'}</p>
          <p className="mt-0.5 text-xs text-muted">
            {profile.dept}
            {form.role ? ` · ${form.role}` : ''}
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickPhoto}
            className="sr-only"
            tabIndex={-1}
            aria-label="Escolher foto de perfil"
          />

          <div className="mt-5 flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-white text-[13px] font-medium hover:bg-page"
            >
              <Camera size={15} />
              {form.photo ? 'Alterar foto' : 'Adicionar foto'}
            </button>

            {form.photo && (
              <button
                type="button"
                onClick={() => setField('photo', '')}
                className="flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Remover foto
              </button>
            )}
          </div>

          {erroFoto && (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {erroFoto}
            </p>
          )}
          <p className="mt-4 text-[11px] leading-4 text-muted">
            A foto é recortada em formato quadrado. Tamanho máximo: {MAX_FILE_MB} MB.
          </p>
        </section>

        {/* DADOS */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-base font-medium">Informações pessoais</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-xs font-medium">Nome completo</span>
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">E-mail corporativo</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                autoComplete="email"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">Cargo</span>
              <input
                value={form.role}
                onChange={(e) => setField('role', e.target.value)}
                autoComplete="organization-title"
                placeholder="Ex.: Analista de Marketing"
                className={inputClass}
              />
            </label>
          </div>

          {erro && (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-700">
              {erro}
            </div>
          )}
          {salvo && (
            <div role="status" className="mt-5 rounded-xl border border-line bg-page px-3.5 py-3 text-xs text-brand">
              Alterações salvas.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!alterado}
              className="h-11 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={!alterado}
              className="h-11 rounded-xl border border-line bg-white px-6 text-sm font-medium hover:bg-page disabled:cursor-not-allowed disabled:opacity-40"
            >
              Descartar alterações
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}