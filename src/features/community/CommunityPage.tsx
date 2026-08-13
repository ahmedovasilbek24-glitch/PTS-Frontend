import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { User, Moment } from '@/shared/types'
import { avatarSrc, getUserMoments } from '@/shared/helpers'
import MomentCard from '@/features/moments/components/MomentCard'

export default function CommunityPage({ lang, onProfileClick, users, moments, onToggleLike }: { lang: Lang; onProfileClick: (id: string) => void; users: User[]; moments: Moment[]; onToggleLike: (moment: Moment) => void }) {
  const tr = TR[lang].community
  const [search, setSearch] = useState('')
  const filtered = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    : null

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      <div className="py-12 px-6" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>{tr.title}</h1>
          <p className="text-white/80 mb-8">{tr.sub}</p>
          <div className="max-w-md mx-auto relative">
            <Icon8 name="search" size={16} color="FFFFFF" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={L(lang, 'Search volunteers...', 'Поиск волонтёров...', 'Volontyorlarni qidirish...')} className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)' }} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {filtered ? (
          <div>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-warm-dark)' }}>{L(lang, 'Volunteers', 'Волонтёры', 'Volontyorlar')}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {filtered.map(user => (
                <div key={user.id} onClick={() => onProfileClick(user.id)} className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-4 border cursor-pointer hover:shadow-md transition-all" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3 mb-3">
    <img src={avatarSrc(user)} alt={user.name} className="w-12 h-12 rounded-2xl object-cover" />
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--color-warm-dark)' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{user.location}</p>
                    </div>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--color-warm-mid)' }}>{user.bio}</p>
                  <div className="flex gap-3 mt-3 text-xs" style={{ color: 'var(--color-warm-muted)' }}>
                    <span>{user.followers} {TR[lang].profile.followers}</span>
                    <span>{getUserMoments(moments, user.id).length} {TR[lang].profile.moments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>Sweet Moments</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {moments.map(m => <MomentCard key={m.id} moment={m} lang={lang} users={users} onProfileClick={onProfileClick} onToggleLike={onToggleLike} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}