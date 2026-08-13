import { useState, useRef } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { ApiError } from '@/shared/api'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { Moment, User } from '@/shared/types'
import { avatarSrc } from '@/shared/helpers'

export default function PostMomentModal({ onClose, onPost, lang, currentUser }: { onClose: () => void; onPost: (m: Moment) => void; lang: Lang; currentUser: User }) {
  const tr = TR[lang].profile
  const [text, setText] = useState('')
  const [previews, setPreviews] = useState<{ type: 'image' | 'video'; url: string; file: File }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      const type = file.type.startsWith('video') ? 'video' : 'image'
      setPreviews(p => [...p, { type, url, file }])
    })
    e.target.value = ''
  }

  async function handlePost() {
    if (!text.trim() && previews.length === 0) return
    setBusy(true)
    setError(null)
    try {
      const media = await Promise.all(previews.map(async p => {
        const uploaded = await api.uploadFile(p.file)
        return { type: uploaded.type, url: uploaded.url }
      }))
      const created = await api.moments.create({ text: text.trim(), media })
      onPost(created)
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
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.post}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream transition-colors" style={{ background: 'var(--color-cream-dark)' }}>
            <Icon8 name="cancel" size={16} color="7C4A1E" darkColor="D8B98C" />
          </button>
        </div>
        <div className="p-5">
          {error && <p className="text-sm px-3 py-2 rounded-xl mb-4" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}
          <div className="flex gap-3 mb-4">
            <img src={avatarSrc(currentUser)} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={tr.writeHere}
              rows={4}
              className="flex-1 resize-none text-sm outline-none rounded-2xl p-3 leading-relaxed"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', borderColor: 'var(--color-border)', border: '1.5px solid var(--color-border)' }}
            />
          </div>
          {previews.length > 0 && (
            <div className={`grid gap-2 mb-4 ${previews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {previews.map((p, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden" style={{ height: previews.length === 1 ? '200px' : '130px' }}>
                  {p.type === 'image'
                    ? <img src={p.url} alt="" className="w-full h-full object-cover" />
                    : <video src={p.url} className="w-full h-full object-cover" />
                  }
                  <button onClick={() => setPreviews(prev => prev.filter((_, j) => j !== i))} className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center">
                    <Icon8 name="cancel" size={12} color="FFFFFF" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFile} />
          <div className="flex items-center gap-3">
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors hover:opacity-80" style={{ background: 'var(--color-cream)', color: 'var(--color-warm-mid)', border: '1.5px solid var(--color-border)' }}>
              <Icon8 name="camera" size={16} color="7C4A1E" darkColor="D8B98C" />{tr.addPhoto}
            </button>
            <button onClick={handlePost} disabled={busy || (!text.trim() && previews.length === 0)} className="ml-auto px-6 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
              {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin" /> : tr.share}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}