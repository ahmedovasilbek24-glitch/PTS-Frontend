import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { User, Moment } from '@/shared/types'
import { getUserById, avatarSrc } from '@/shared/helpers'
import PostMomentModal from '@/features/moments/components/PostMomentModal'
import MomentCard from '@/features/moments/components/MomentCard'
import EditProfileModal from './components/EditProfileModal'

export default function ProfilePage({ userId, lang, users, onProfileClick, isMe, currentUser, moments, onMomentPosted, onToggleLike, onUserUpdated }: { userId: string; lang: Lang; users: User[]; onProfileClick: (id: string) => void; isMe: boolean; currentUser: User; moments: Moment[]; onMomentPosted: (m: Moment) => void; onToggleLike: (moment: Moment) => void; onUserUpdated: (user: User) => void }) {
  const user = getUserById(users, userId)
  const userMoments = moments.filter(m => m.userId === userId).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  const tr = TR[lang].profile
  const [postOpen, setPostOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [following, setFollowing] = useState(false)
  const [followBusy, setFollowBusy] = useState(false)

  async function toggleFollow() {
    if (!user || followBusy) return
    setFollowBusy(true)
    try {
      const updated = following ? await api.users.unfollow(user.id) : await api.users.follow(user.id)
      setFollowing(!following)
      onUserUpdated(updated)
    } finally {
      setFollowBusy(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {postOpen && <PostMomentModal onClose={() => setPostOpen(false)} onPost={onMomentPosted} lang={lang} currentUser={currentUser} />}
      {editOpen && <EditProfileModal lang={lang} user={user} onClose={() => setEditOpen(false)} onSaved={onUserUpdated} />}

      {/* Profile header */}
      <div className="relative">
        <div className="h-40" style={{ background: 'linear-gradient(135deg, #E07A45, #5B9B6E)' }} />
        <div className="px-6 pb-6" style={{ background: 'var(--color-surface)' }}>
          <div className="flex items-end justify-between -mt-10 mb-4">
            <img src={avatarSrc(user)} alt={user.name} className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white shadow-lg" />
            {isMe
              ? <div className="flex gap-2">
                  <button onClick={() => setEditOpen(true)} className="w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-colors hover:bg-cream" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }} aria-label={tr.editProfile}>
                    <Icon8 name="pencil" size={16} color="E07A45" />
                  </button>
                  <button onClick={() => setPostOpen(true)} className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
                    {tr.post}
                  </button>
                </div>
              : <button onClick={toggleFollow} disabled={followBusy} className="px-5 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-colors disabled:opacity-50" style={following ? { background: '#E07A45', color: 'white', borderColor: '#E07A45' } : { borderColor: '#E07A45', color: '#E07A45' }}>
                  {following ? L(lang, 'Following', 'Подписан', 'Kuzatilmoqda') : L(lang, 'Follow', 'Подписаться', 'Kuzatish')}
                </button>
            }
          </div>
          <h2 className="text-xl font-bold mb-0.5" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{user.name}</h2>
          <p className="text-sm flex items-center gap-1 mb-2" style={{ color: 'var(--color-warm-muted)' }}><Icon8 name="map-pin" size={12} color="B8875A" darkColor="C9A876" />{user.location}</p>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-body)' }}>{user.bio}</p>
          <div className="flex gap-6">
            {[[userMoments.length, tr.moments], [user.followers, tr.followers], [user.following, tr.following]].map(([n, label]) => (
              <div key={String(label)} className="text-center">
                <div className="font-bold text-lg" style={{ color: 'var(--color-warm-dark)', fontFamily: 'Lora, serif' }}>{n}</div>
                <div className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sweet Moments */}
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.sweetMoments}</h3>
          <Icon8 name="like" size={20} color="E07A45" />
        </div>
        <p className="text-sm mb-8 italic" style={{ color: 'var(--color-warm-muted)' }}>{tr.sweetSub}</p>
        {userMoments.length === 0
          ? <div className="text-center py-16 rounded-3xl border-2 border-dashed" style={{ borderColor: 'var(--color-border)' }}>
              <Icon8 name="like" size={48} color="F0E4D3" darkColor="3A2818" className="mx-auto mb-3 block" />
              <p style={{ color: 'var(--color-warm-muted)' }}>{L(lang, 'No moments yet. Share your first!', 'Пока нет моментов.', "Hali lahzalar yo'q. Birinchisini ulashing!")}</p>
              {isMe && <button onClick={() => setPostOpen(true)} className="mt-4 px-6 py-2.5 rounded-2xl font-semibold text-white text-sm" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>{tr.post}</button>}
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {userMoments.map(m => <MomentCard key={m.id} moment={m} lang={lang} users={users} onProfileClick={onProfileClick} onToggleLike={onToggleLike} />)}
            </div>
        }
      </div>
    </div>
  )
}