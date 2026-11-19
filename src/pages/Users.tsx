import { useEffect, useState } from 'react'
import { api, type ManagedUser, type UserDepartment } from '../services/api'

function DepartmentAssignment({ user }: { user: ManagedUser }) {
  const [assigned, setAssigned] = useState(user.department)
  const [selection, setSelection] = useState<UserDepartment | ''>(user.department ?? '')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [failed, setFailed] = useState(false)

  async function save() {
    if (!selection || selection === assigned) return
    setSaving(true)
    setFeedback('')
    try {
      const updated = await api.assignUserDepartment(user.id, selection)
      setAssigned(updated.department)
      setSelection(updated.department ?? '')
      setFailed(false)
      setFeedback('Departamento salvo.')
    } catch (error) {
      setFailed(true)
      setFeedback(error instanceof Error ? error.message : 'Não foi possível salvar o departamento.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold">{user.name} {user.surname}</p>
          <p className="break-all text-sm text-slate-600">{user.email}</p>
          {!assigned && <p className="mt-1 text-sm text-amber-800">Aguardando departamento</p>}
        </div>
        <div className="flex items-end gap-2">
          <label className="flex flex-col gap-1 text-sm">
            Departamento
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2"
              aria-label={`Departamento de ${user.email}`}
              value={selection}
              disabled={saving}
              onChange={({ target }) => {
                const value = target.value
                setSelection(value === 'MARKETING' || value === 'COMMERCIAL' ? value : '')
                setFeedback('')
              }}
            >
              <option value="">Selecione</option>
              <option value="MARKETING">Marketing</option>
              <option value="COMMERCIAL">Comercial</option>
            </select>
          </label>
          <button
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            aria-label={`Salvar departamento de ${user.email}`}
            disabled={saving || !selection || selection === assigned}
            onClick={save}
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
      {feedback && <p className="mt-2 text-sm" role={failed ? 'alert' : 'status'}>{feedback}</p>}
    </li>
  )
}

export default function Users() {
  const [users, setUsers] = useState<ManagedUser[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.listUsers()
      .then((result) => {
        if (active) setUsers(result.filter((user) => user.role === 'DEFAULT'))
      })
      .catch((error: unknown) => {
        if (active) setError(error instanceof Error ? error.message : 'Não foi possível carregar os usuários.')
      })
    return () => { active = false }
  }, [])

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Usuários</h1>
      <p className="mt-1 text-sm text-slate-600">Defina o departamento para liberar o acesso das novas contas.</p>
      {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
      {!error && !users && <p className="mt-4 text-sm" role="status">Carregando usuários…</p>}
      {users?.length === 0 && <p className="mt-4 text-sm">Nenhuma conta de usuário cadastrada.</p>}
      {!!users?.length && (
        <ul className="mt-5 space-y-3">
          {users.map((user) => <DepartmentAssignment key={user.id} user={user} />)}
        </ul>
      )}
    </section>
  )
}
