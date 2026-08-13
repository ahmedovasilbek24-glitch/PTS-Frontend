import { useState, useRef } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { ApiError } from '@/shared/api'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { User } from '@/shared/types'
import { avatarSrc } from '@/shared/helpers'

export default function EditProfileModal({ lang, user, onClose, onSaved }: { lang: Lang; user: User; onClose: () => void; onSaved: (u: User) => void }) {
  const tr = TR[lang].profile
  const [name, setName] = useState(user.name)
  const [location, setLocation] = useState(user.location)
  const [bio, setBio] = useState(user.bio)
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
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
      setError(err instanceof ApiError ? err.message : String(err))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit() {
    if (!name.trim()) return
    setBusy(true)
    setError(null)
    try {
      const updated = await api.users.updateMe({ name: name.trim(), location: location.trim(), bio, avatar: avatar || undefined })
      onSaved(updated)
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(45,27,14,0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white dark:bg-[var(--color-surface)] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.editProfile}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream transition-colors" style={{ background: 'var(--color-cream-dark)' }}>
            <Icon8 name="cancel" size={16} color="7C4A1E" darkColor="D8B98C" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img src={avatarSrc({ ...user, avatar })} alt={name} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-lg" />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}
              >
                {uploading ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin" /> : <Icon8 name="camera" size={16} color="FFFFFF" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.nameLabel}</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.locationLabel}</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.bioLabel}</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full resize-none px-4 py-3 rounded-2xl text-sm outline-none leading-relaxed"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 font-semibold transition-colors hover:bg-cream" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
              {tr.cancel}
            </button>
            <button onClick={handleSubmit} disabled={busy || uploading || !name.trim()} className="flex-1 py-3 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
              {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin mx-auto" /> : tr.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}