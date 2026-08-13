import { useState, useRef } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { ApiError } from '@/shared/api'
import type { UserDto, DestinationDto, TeamDto, MomentDto } from '@/shared/api'
import { L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import { avatarSrc } from '@/shared/helpers'

type Tab = 'destinations' | 'teams' | 'users' | 'moments'

const card = { background: 'var(--color-surface)', borderColor: 'var(--color-border)' } as const
const inputStyle = { background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' } as const
const inputClass = 'w-full px-3.5 py-2.5 rounded-xl text-sm outline-none'

function errMsg(err: unknown) { return err instanceof ApiError ? err.message : String(err) }

// ─── Shared bits ───────────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel, busy }: { title: string; message: string; confirmLabel: string; cancelLabel: string; onConfirm: () => void; onCancel: () => void; busy: boolean }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(45,27,14,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-7 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-warm-mid)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={busy} className="flex-1 py-2.5 rounded-2xl border-2 font-semibold text-sm transition-colors disabled:opacity-50" style={{ borderColor: 'var(--color-border)', color: 'var(--color-warm-mid)' }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={busy} className="flex-1 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-60" style={{ background: '#C4612E' }}>
            {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin mx-auto" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{children}</label>
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(45,27,14,0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white dark:bg-[var(--color-surface)] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream transition-colors" style={{ background: 'var(--color-cream-dark)' }}>
            <Icon8 name="cancel" size={16} color="7C4A1E" darkColor="D8B98C" />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  )
}

// ─── Destinations ────────────────────────────────────────────────────────────
function DestinationFormModal({ lang, destination, onClose, onSaved }: { lang: Lang; destination: DestinationDto | null; onClose: () => void; onSaved: (d: DestinationDto) => void }) {
  const [name, setName] = useState(destination?.name ?? '')
  const [country, setCountry] = useState(destination?.country ?? '')
  const [city, setCity] = useState(destination?.city ?? '')
  const [region, setRegion] = useState(destination?.region ?? '')
  const [description, setDescription] = useState(destination?.description ?? '')
  const [photo, setPhoto] = useState(destination?.photo ?? '')
  const [children, setChildren] = useState(String(destination?.children ?? 0))
  const [active, setActive] = useState(destination?.active ?? true)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSubmit = name.trim() && country.trim() && city.trim() && region.trim() && description.trim() && !busy && !uploading

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await api.uploadFile(file)
      setPhoto(uploaded.url)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit() {
    setBusy(true)
    setError(null)
    try {
      const body = { name: name.trim(), country: country.trim(), city: city.trim(), region: region.trim(), description: description.trim(), photo: photo.trim() || undefined, children: Number(children) || 0, active }
      const saved = destination ? await api.admin.updateDestination(destination.id, body) : await api.admin.createDestination(body)
      onSaved(saved)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell title={destination ? L(lang, 'Edit Destination', 'Изменить направление', "Yo'nalishni tahrirlash") : L(lang, 'Add Destination', 'Добавить направление', "Yo'nalish qo'shish")} onClose={onClose}>
      {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}
      <div>
        <FieldLabel>{L(lang, 'Name', 'Название', 'Nomi')}</FieldLabel>
        <input value={name} onChange={e => setName(e.target.value)} className={inputClass} style={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>{L(lang, 'Country', 'Страна', 'Davlat')}</FieldLabel>
          <input value={country} onChange={e => setCountry(e.target.value)} className={inputClass} style={inputStyle} />
        </div>
        <div>
          <FieldLabel>{L(lang, 'City', 'Город', 'Shahar')}</FieldLabel>
          <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>{L(lang, 'Region', 'Область', 'Viloyat')}</FieldLabel>
          <input value={region} onChange={e => setRegion(e.target.value)} className={inputClass} style={inputStyle} />
        </div>
        <div>
          <FieldLabel>{L(lang, 'Children', 'Детей', 'Bolalar soni')}</FieldLabel>
          <input type="number" min={0} value={children} onChange={e => setChildren(e.target.value)} className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div>
        <FieldLabel>{L(lang, 'Description', 'Описание', 'Tavsif')}</FieldLabel>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none leading-relaxed`} style={inputStyle} />
      </div>
      <div>
        <FieldLabel>{L(lang, 'Photo URL', 'URL фото', 'Rasm URL')}</FieldLabel>
        <div className="flex gap-2">
          <input value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://..." className={`${inputClass} flex-1`} style={inputStyle} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-60"
            style={{ background: 'var(--color-cream-dark)' }}
          >
            {uploading ? <Icon8 name="loading" size={18} color="7C4A1E" darkColor="D8B98C" className="animate-spin" /> : <Icon8 name="upload" size={18} color="7C4A1E" darkColor="D8B98C" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFile} />
        </div>
        {photo && (
          <img src={photo} alt="" className="mt-2 h-24 w-full object-cover rounded-xl" style={{ border: '1.5px solid var(--color-border)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} onLoad={e => { (e.target as HTMLImageElement).style.display = 'block' }} />
        )}
      </div>
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-warm-dark)' }}>
        <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4" />
        {L(lang, 'Active team accepted here', 'Команда активна здесь', 'Bu yerda jamoa faol')}
      </label>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
          {L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
        </button>
        <button onClick={handleSubmit} disabled={!canSubmit} className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
          {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin mx-auto" /> : L(lang, 'Save', 'Сохранить', 'Saqlash')}
        </button>
      </div>
    </ModalShell>
  )
}

function DestinationsTab({ lang, destinations, teams, onChanged }: { lang: Lang; destinations: DestinationDto[]; teams: TeamDto[]; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState<DestinationDto | null | 'new'>(null)
  const [deleting, setDeleting] = useState<DestinationDto | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!deleting) return
    setBusy(true)
    setError(null)
    try {
      await api.admin.deleteDestination(deleting.id)
      setDeleting(null)
      await onChanged()
    } catch (err) {
      setError(errMsg(err))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {editing && (
        <DestinationFormModal
          lang={lang}
          destination={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await onChanged() }}
        />
      )}
      {deleting && (
        <ConfirmModal
          title={L(lang, 'Delete destination?', 'Удалить направление?', "Yo'nalishni o'chirasizmi?")}
          message={L(lang, `"${deleting.name}" and all its teams will be permanently deleted.`, `«${deleting.name}» и все его команды будут удалены навсегда.`, `"${deleting.name}" va uning barcha jamoalari butunlay o'chiriladi.`)}
          confirmLabel={L(lang, 'Delete', 'Удалить', "O'chirish")}
          cancelLabel={L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-warm-dark)' }}>{L(lang, 'Destinations', 'Направления', "Yo'nalishlar")} ({destinations.length})</h2>
        <button onClick={() => setEditing('new')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
          <Icon8 name="plus" size={16} color="FFFFFF" />{L(lang, 'Add', 'Добавить', "Qo'shish")}
        </button>
      </div>
      {error && <p className="text-sm px-3 py-2 rounded-xl mb-4" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}

      <div className="space-y-2.5">
        {destinations.map(d => (
          <div key={d.id} className="flex items-center gap-3 p-3 rounded-2xl border" style={card}>
            <img src={d.photo} alt={d.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-warm-dark)' }}>{d.name}</p>
              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-warm-muted)' }}><Icon8 name="map-pin" size={12} color="B8875A" darkColor="C9A876" />{d.city}, {d.region}</p>
            </div>
            <div className="hidden sm:flex gap-4 text-xs text-center flex-shrink-0" style={{ color: 'var(--color-warm-muted)' }}>
              <div><div className="font-bold" style={{ color: '#E07A45' }}>{d.volunteers}</div>{L(lang, 'vol.', 'вол.', 'vol.')}</div>
              <div><div className="font-bold" style={{ color: '#5B9B6E' }}>{d.children}</div>{L(lang, 'child.', 'дет.', 'bola')}</div>
              <div><div className="font-bold" style={{ color: 'var(--color-warm-dark)' }}>{teams.filter(t => t.destId === d.id).length}</div>{L(lang, 'teams', 'команд', 'jamoa')}</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0" style={{ background: d.active ? 'rgba(91,155,110,0.15)' : 'rgba(184,135,90,0.15)', color: d.active ? '#3E7A52' : '#B8875A' }}>
              {d.active ? L(lang, 'Active', 'Активна', 'Faol') : L(lang, 'Inactive', 'Неактивна', 'Nofaol')}
            </span>
            <button onClick={() => setEditing(d)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream" style={{ color: 'var(--color-warm-mid)' }}><Icon8 name="pencil" size={14} color="7C4A1E" darkColor="D8B98C" /></button>
            <button onClick={() => setDeleting(d)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream" style={{ color: '#C4612E' }}><Icon8 name="trash" size={14} color="C4612E" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Teams ───────────────────────────────────────────────────────────────────
function TeamFormModal({ lang, team, destinations, users, onClose, onSaved }: { lang: Lang; team: TeamDto; destinations: DestinationDto[]; users: UserDto[]; onClose: () => void; onSaved: (t: TeamDto) => void }) {
  const [name, setName] = useState(team.name)
  const [description, setDescription] = useState(team.description)
  const [date, setDate] = useState(team.date)
  const [photo, setPhoto] = useState(team.photo)
  const [destId, setDestId] = useState(team.destId)
  const [leaderId, setLeaderId] = useState(team.leader)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await api.uploadFile(file)
      setPhoto(uploaded.url)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit() {
    setBusy(true)
    setError(null)
    try {
      const saved = await api.admin.updateTeam(team.id, { name: name.trim(), description: description.trim(), date: date.trim(), photo: photo.trim(), destId, leaderId })
      onSaved(saved)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell title={L(lang, 'Edit Team', 'Изменить команду', 'Jamoani tahrirlash')} onClose={onClose}>
      {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}
      <div>
        <FieldLabel>{L(lang, 'Name', 'Название', 'Nomi')}</FieldLabel>
        <input value={name} onChange={e => setName(e.target.value)} className={inputClass} style={inputStyle} />
      </div>
      <div>
        <FieldLabel>{L(lang, 'Destination', 'Направление', "Yo'nalish")}</FieldLabel>
        <select value={destId} onChange={e => setDestId(e.target.value)} className={inputClass} style={inputStyle}>
          {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div>
        <FieldLabel>{L(lang, 'Leader', 'Лидер', 'Yetakchi')}</FieldLabel>
        <select value={leaderId} onChange={e => setLeaderId(e.target.value)} className={inputClass} style={inputStyle}>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      <div>
        <FieldLabel>{L(lang, 'Description', 'Описание', 'Tavsif')}</FieldLabel>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none leading-relaxed`} style={inputStyle} />
      </div>
      <div>
        <FieldLabel>{L(lang, 'Trip date', 'Дата поездки', 'Safar sanasi')}</FieldLabel>
        <input value={date} onChange={e => setDate(e.target.value)} className={inputClass} style={inputStyle} />
      </div>
      <div>
        <FieldLabel>{L(lang, 'Photo URL', 'URL фото', 'Rasm URL')}</FieldLabel>
        <div className="flex gap-2">
          <input value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://..." className={`${inputClass} flex-1`} style={inputStyle} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-60"
            style={{ background: 'var(--color-cream-dark)' }}
          >
            {uploading ? <Icon8 name="loading" size={18} color="7C4A1E" darkColor="D8B98C" className="animate-spin" /> : <Icon8 name="upload" size={18} color="7C4A1E" darkColor="D8B98C" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFile} />
        </div>
        {photo && (
          <img src={photo} alt="" className="mt-2 h-24 w-full object-cover rounded-xl" style={{ border: '1.5px solid var(--color-border)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} onLoad={e => { (e.target as HTMLImageElement).style.display = 'block' }} />
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
          {L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
        </button>
        <button onClick={handleSubmit} disabled={busy || uploading || !name.trim()} className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
          {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin mx-auto" /> : L(lang, 'Save', 'Сохранить', 'Saqlash')}
        </button>
      </div>
    </ModalShell>
  )
}

function TeamsTab({ lang, teams, destinations, users, onChanged }: { lang: Lang; teams: TeamDto[]; destinations: DestinationDto[]; users: UserDto[]; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState<TeamDto | null>(null)
  const [deleting, setDeleting] = useState<TeamDto | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function destName(id: string) { return destinations.find(d => d.id === id)?.name ?? '—' }
  function userName(id: string) { return users.find(u => u.id === id)?.name ?? '—' }

  async function handleDelete() {
    if (!deleting) return
    setBusy(true)
    setError(null)
    try {
      await api.admin.deleteTeam(deleting.id)
      setDeleting(null)
      await onChanged()
    } catch (err) {
      setError(errMsg(err))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {editing && (
        <TeamFormModal lang={lang} team={editing} destinations={destinations} users={users} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await onChanged() }} />
      )}
      {deleting && (
        <ConfirmModal
          title={L(lang, 'Delete team?', 'Удалить команду?', "Jamoani o'chirasizmi?")}
          message={L(lang, `"${deleting.name}" will be permanently deleted along with its chat history.`, `«${deleting.name}» и её история чата будут удалены навсегда.`, `"${deleting.name}" va uning chat tarixi butunlay o'chiriladi.`)}
          confirmLabel={L(lang, 'Delete', 'Удалить', "O'chirish")}
          cancelLabel={L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}

      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-warm-dark)' }}>{L(lang, 'Teams', 'Команды', 'Jamoalar')} ({teams.length})</h2>
      {error && <p className="text-sm px-3 py-2 rounded-xl mb-4" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}

      <div className="space-y-2.5">
        {teams.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl border" style={card}>
            <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-warm-dark)' }}>{t.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-warm-muted)' }}>{destName(t.destId)} · {L(lang, 'led by', 'лидер', 'yetakchi')} {userName(t.leader)}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs flex-shrink-0" style={{ color: 'var(--color-warm-muted)' }}>
              <Icon8 name="conference-call" size={14} color="B8875A" darkColor="C9A876" />{t.memberIds.length}
            </div>
            <button onClick={() => setEditing(t)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream" style={{ color: 'var(--color-warm-mid)' }}><Icon8 name="pencil" size={14} color="7C4A1E" darkColor="D8B98C" /></button>
            <button onClick={() => setDeleting(t)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream" style={{ color: '#C4612E' }}><Icon8 name="trash" size={14} color="C4612E" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Users ───────────────────────────────────────────────────────────────────
function UserFormModal({ lang, user, isSelf, onClose, onSaved }: { lang: Lang; user: UserDto; isSelf: boolean; onClose: () => void; onSaved: (u: UserDto) => void }) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [location, setLocation] = useState(user.location)
  const [avatar, setAvatar] = useState(user.avatar ?? '')
  const [isAdmin, setIsAdmin] = useState(user.isAdmin)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await api.uploadFile(file)
      setAvatar(uploaded.url)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit() {
    setBusy(true)
    setError(null)
    try {
      const saved = await api.admin.updateUser(user.id, { name: name.trim(), bio, location: location.trim(), avatar: avatar.trim() || undefined, isAdmin })
      onSaved(saved)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell title={L(lang, 'Edit User', 'Изменить пользователя', 'Foydalanuvchini tahrirlash')} onClose={onClose}>
      {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img src={avatarSrc({ ...user, avatar })} alt={name} className="w-14 h-14 rounded-2xl object-cover" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}
          >
            {uploading ? <Icon8 name="loading" size={12} color="FFFFFF" className="animate-spin" /> : <Icon8 name="camera" size={12} color="FFFFFF" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
        </div>
        <div className="flex-1">
          <FieldLabel>{L(lang, 'Avatar URL', 'URL аватара', 'Avatar URL')}</FieldLabel>
          <input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div>
        <FieldLabel>{L(lang, 'Name', 'Имя', 'Ism')}</FieldLabel>
        <input value={name} onChange={e => setName(e.target.value)} className={inputClass} style={inputStyle} />
      </div>
      <div>
        <FieldLabel>{L(lang, 'Location', 'Местоположение', 'Manzil')}</FieldLabel>
        <input value={location} onChange={e => setLocation(e.target.value)} className={inputClass} style={inputStyle} />
      </div>
      <div>
        <FieldLabel>{L(lang, 'Bio', 'О себе', "O'zi haqida")}</FieldLabel>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className={`${inputClass} resize-none leading-relaxed`} style={inputStyle} />
      </div>
      <label className={`flex items-center gap-2 text-sm font-medium ${isSelf ? 'opacity-50' : ''}`} style={{ color: 'var(--color-warm-dark)' }}>
        <input type="checkbox" checked={isAdmin} disabled={isSelf} onChange={e => setIsAdmin(e.target.checked)} className="w-4 h-4" />
        {L(lang, 'Admin access', 'Права администратора', 'Administrator huquqi')}
        {isSelf && <span className="text-xs">({L(lang, "can't change your own", 'нельзя изменить свои', "o'zingiznikini o'zgartirib bo'lmaydi")})</span>}
      </label>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
          {L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
        </button>
        <button onClick={handleSubmit} disabled={busy || uploading || !name.trim()} className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
          {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin mx-auto" /> : L(lang, 'Save', 'Сохранить', 'Saqlash')}
        </button>
      </div>
    </ModalShell>
  )
}

function UsersTab({ lang, users, currentUser, onChanged }: { lang: Lang; users: UserDto[]; currentUser: UserDto; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState<UserDto | null>(null)
  const [deleting, setDeleting] = useState<UserDto | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!deleting) return
    setBusy(true)
    setError(null)
    try {
      await api.admin.deleteUser(deleting.id)
      setDeleting(null)
      await onChanged()
    } catch (err) {
      setError(errMsg(err))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {editing && <UserFormModal lang={lang} user={editing} isSelf={editing.id === currentUser.id} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await onChanged() }} />}
      {deleting && (
        <ConfirmModal
          title={L(lang, 'Delete user?', 'Удалить пользователя?', "Foydalanuvchini o'chirasizmi?")}
          message={L(lang, `"${deleting.name}" and all their moments, messages and memberships will be permanently deleted.`, `«${deleting.name}» и все его моменты, сообщения и участие в командах будут удалены навсегда.`, `"${deleting.name}" va uning barcha lahzalari, xabarlari va a'zoliklari butunlay o'chiriladi.`)}
          confirmLabel={L(lang, 'Delete', 'Удалить', "O'chirish")}
          cancelLabel={L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}

      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-warm-dark)' }}>{L(lang, 'Users', 'Пользователи', 'Foydalanuvchilar')} ({users.length})</h2>
      {error && <p className="text-sm px-3 py-2 rounded-xl mb-4" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}

      <div className="space-y-2.5">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl border" style={card}>
            <img src={avatarSrc(u)} alt={u.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-warm-dark)' }}>{u.name}</p>
                {u.isAdmin && <Icon8 name="security-checked" size={14} color="5B9B6E" className="flex-shrink-0" />}
              </div>
              <p className="text-xs truncate" style={{ color: 'var(--color-warm-muted)' }}>{u.email}</p>
            </div>
            <p className="hidden sm:block text-xs flex-shrink-0" style={{ color: 'var(--color-warm-muted)' }}>{u.location}</p>
            <button onClick={() => setEditing(u)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream" style={{ color: 'var(--color-warm-mid)' }}><Icon8 name="pencil" size={14} color="7C4A1E" darkColor="D8B98C" /></button>
            <button onClick={() => setDeleting(u)} disabled={u.id === currentUser.id} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream disabled:opacity-30" style={{ color: '#C4612E' }}><Icon8 name="trash" size={14} color="C4612E" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Moments ─────────────────────────────────────────────────────────────────
function MomentsTab({ lang, moments, users, onChanged }: { lang: Lang; moments: MomentDto[]; users: UserDto[]; onChanged: () => Promise<void> }) {
  const [deleting, setDeleting] = useState<MomentDto | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function userName(id: string) { return users.find(u => u.id === id)?.name ?? '—' }

  async function handleDelete() {
    if (!deleting) return
    setBusy(true)
    setError(null)
    try {
      await api.admin.deleteMoment(deleting.id)
      setDeleting(null)
      await onChanged()
    } catch (err) {
      setError(errMsg(err))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {deleting && (
        <ConfirmModal
          title={L(lang, 'Delete moment?', 'Удалить момент?', "Lahzani o'chirasizmi?")}
          message={L(lang, 'This moment will be permanently deleted.', 'Этот момент будет удалён навсегда.', "Bu lahza butunlay o'chiriladi.")}
          confirmLabel={L(lang, 'Delete', 'Удалить', "O'chirish")}
          cancelLabel={L(lang, 'Cancel', 'Отмена', 'Bekor qilish')}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}

      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-warm-dark)' }}>{L(lang, 'Moments', 'Моменты', 'Lahzalar')} ({moments.length})</h2>
      {error && <p className="text-sm px-3 py-2 rounded-xl mb-4" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}

      <div className="space-y-2.5">
        {moments.map(m => (
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl border" style={card}>
            {m.media[0]
              ? <img src={m.media[0].url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              : <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-cream)' }}><Icon8 name="image" size={20} color="B8875A" darkColor="C9A876" /></div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-warm-dark)' }}>{userName(m.userId)}</p>
              <p className="text-xs line-clamp-1" style={{ color: 'var(--color-warm-muted)' }}>{m.text || L(lang, '(no text)', '(без текста)', '(matn yoʻq)')}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs flex-shrink-0" style={{ color: 'var(--color-warm-muted)' }}>
              <Icon8 name="like" size={14} color="B8875A" darkColor="C9A876" />{m.likes}
            </div>
            <button onClick={() => setDeleting(m)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-cream" style={{ color: '#C4612E' }}><Icon8 name="trash" size={14} color="C4612E" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────────
export default function AdminPage({ lang, destinations, teams, users, moments, currentUser, reloadData }: {
  lang: Lang
  destinations: DestinationDto[]
  teams: TeamDto[]
  users: UserDto[]
  moments: MomentDto[]
  currentUser: UserDto
  reloadData: () => Promise<void>
}) {
  const [tab, setTab] = useState<Tab>('destinations')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'destinations', label: L(lang, 'Destinations', 'Направления', "Yo'nalishlar") },
    { id: 'teams', label: L(lang, 'Teams', 'Команды', 'Jamoalar') },
    { id: 'users', label: L(lang, 'Users', 'Пользователи', 'Foydalanuvchilar') },
    { id: 'moments', label: L(lang, 'Moments', 'Моменты', 'Lahzalar') },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      <div className="py-10 px-6" style={{ background: 'linear-gradient(135deg, #2D1B0E, #5A2E10)' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(224,122,69,0.25)' }}>
            <Icon8 name="security-checked" size={24} color="FBBF87" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>{L(lang, 'Admin Panel', 'Панель администратора', 'Admin panel')}</h1>
            <p className="text-white/60 text-sm">{L(lang, 'Manage all destinations, teams, users and moments', 'Управляйте направлениями, командами, пользователями и моментами', "Barcha yo'nalishlar, jamoalar, foydalanuvchilar va lahzalarni boshqaring")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors"
              style={tab === t.id ? { background: 'linear-gradient(135deg, #E07A45, #C4612E)', color: 'white' } : { background: 'var(--color-surface)', color: 'var(--color-warm-mid)', border: '1.5px solid var(--color-border)' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'destinations' && <DestinationsTab lang={lang} destinations={destinations} teams={teams} onChanged={reloadData} />}
        {tab === 'teams' && <TeamsTab lang={lang} teams={teams} destinations={destinations} users={users} onChanged={reloadData} />}
        {tab === 'users' && <UsersTab lang={lang} users={users} currentUser={currentUser} onChanged={reloadData} />}
        {tab === 'moments' && <MomentsTab lang={lang} moments={moments} users={users} onChanged={reloadData} />}
      </div>
    </div>
  )
}