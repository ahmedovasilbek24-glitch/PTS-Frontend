import Icon8 from '@/shared/ui/Icon8'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { Team, User } from '@/shared/types'
import { avatarSrc, getUserById } from '@/shared/helpers'

export default function TeamCard({ team, lang, users, onJoin, onView }: { team: Team; lang: Lang; users: User[]; onJoin: () => void; onView: () => void }) {
  const tr = TR[lang].teams
  const leader = getUserById(users, team.leader)
  return (
    <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl overflow-hidden shadow-sm border transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ borderColor: 'var(--color-border)' }}>
      <div className="h-44 relative overflow-hidden">
        <img src={team.photo} alt={team.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,27,14,0.6) 0%, transparent 60%)' }} />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Lora, serif' }}>{team.name}</h3>
            <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1"><Icon8 name="clock" size={12} color="FFFFFF" />{tr.date}: {team.date}</p>
          </div>
          <div className="flex -space-x-2">
            {team.memberIds.slice(0, 3).map(id => (
              <img key={id} src={avatarSrc(getUserById(users, id))} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-white" />
            ))}
            {team.memberIds.length > 3 && <div className="w-7 h-7 rounded-full bg-amber-100 ring-2 ring-white flex items-center justify-center text-xs font-bold" style={{ color: '#E07A45' }}>+{team.memberIds.length - 3}</div>}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-warm-mid)' }}>{team.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <img src={avatarSrc(leader)} alt={leader?.name} className="w-6 h-6 rounded-full object-cover" />
          <span className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>Led by <span className="font-semibold" style={{ color: 'var(--color-warm-dark)' }}>{leader?.name}</span></span>
          <span className="ml-auto text-xs" style={{ color: 'var(--color-warm-muted)' }}>{team.memberIds.length} {tr.members}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onView} className="flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-colors hover:bg-cream" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
            View
          </button>
          <button onClick={onJoin} className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
            {tr.join}
          </button>
        </div>
      </div>
    </div>
  )
}