import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { ApiError } from '@/shared/api'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { Destination, Team } from '@/shared/types'

export default function CreateTeamModal({ lang, destinations, onClose, onCreate }: { lang: Lang; destinations: Destination[]; onClose: () => void; onCreate: (team: Team) => void }) {
  const tr = TR[lang].teams
  const [name, setName] = useState('')
  const [destId, setDestId] = useState(destinations[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!name.trim() || !description.trim() || !date.trim() || !destId) return
    setBusy(true)
    setError(null)
    try {
      const team = await api.teams.create({
        name: name.trim(),
        destId,
        description: description.trim(),
        date: date.trim(),
      })
      onCreate(team)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const canSubmit = name.trim() && description.trim() && date.trim() && destId && !busy

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(45,27,14,0.5)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white dark:bg-[var(--color-surface)] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.createTitle}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream transition-colors" style={{ background: 'var(--color-cream-dark)' }}>
            <Icon8 name="cancel" size={16} color="7C4A1E" darkColor="D8B98C" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.nameLabel}</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={tr.namePlaceholder}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.destLabel}</label>
            <select
              value={destId}
              onChange={e => setDestId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            >
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.descLabel}</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={tr.descPlaceholder}
              rows={3}
              className="w-full resize-none px-4 py-3 rounded-2xl text-sm outline-none leading-relaxed"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.dateLabel}</label>
            <input
              value={date}
              onChange={e => setDate(e.target.value)}
              placeholder={tr.datePlaceholder}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 font-semibold transition-colors hover:bg-cream" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
              {tr.cancel}
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit} className="flex-1 py-3 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
              {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin mx-auto" /> : tr.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}