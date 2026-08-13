import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import type { Lang } from '@/shared/i18n'
import type { Moment, User } from '@/shared/types'
import { getUserById, avatarSrc } from '@/shared/helpers'
import { timeAgo } from '@/shared/format'

export default function MomentCard({ moment, lang, users, onProfileClick, onToggleLike }: { moment: Moment; lang: Lang; users: User[]; onProfileClick: (userId: string) => void; onToggleLike: (moment: Moment) => void }) {
  const user = getUserById(users, moment.userId)
  const [busy, setBusy] = useState(false)

  async function handleLike() {
    if (busy) return
    setBusy(true)
    try { onToggleLike(moment) } finally { setBusy(false) }
  }

  return (
    <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl overflow-hidden shadow-sm border" style={{ borderColor: 'var(--color-border)' }}>
      {moment.media && moment.media.length > 0 && (
        <div className={`grid gap-0.5 ${moment.media.length === 1 ? '' : 'grid-cols-2'}`}>
          {moment.media.map((m, i) => (
            <div key={i} className="relative overflow-hidden" style={{ height: moment.media!.length === 1 ? '220px' : '140px' }}>
              {m.type === 'video'
                ? <video src={m.url} className="w-full h-full object-cover" controls />
                : <img src={m.url} alt="" className="w-full h-full object-cover" />
              }
            </div>
          ))}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <img src={avatarSrc(user)} alt={user?.name} onClick={() => onProfileClick(moment.userId)} className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-white shadow" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm cursor-pointer hover:underline" style={{ color: 'var(--color-warm-dark)' }} onClick={() => onProfileClick(moment.userId)}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{timeAgo(moment.time, lang)}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-body)' }}>{moment.text}</p>
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-sm font-medium transition-all"
          style={{ color: moment.liked ? '#E07A45' : 'var(--color-warm-muted)' }}
        >
          <Icon8
            name="like"
            size={16}
            filled={moment.liked}
            color={moment.liked ? 'E07A45' : 'B8875A'}
            darkColor={moment.liked ? 'E07A45' : 'C9A876'}
            className={`transition-all ${moment.liked ? 'scale-110' : ''}`}
          />
          {moment.likes}
        </button>
      </div>
    </div>
  )
}