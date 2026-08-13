import Icon8 from '@/shared/ui/Icon8'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, Team, Destination, User } from '@/shared/types'
import { getTeamById, getDestById, getUserById, avatarSrc } from '@/shared/helpers'
import JoinConfirmModal from './components/JoinConfirmModal'

export default function TeamDetailPage({ teamId, lang, setView, onProfileClick, joinConfirm, setJoinConfirm, onJoinConfirmed, teams, destinations, users }: { teamId: string; lang: Lang; setView: (v: View) => void; onProfileClick: (id: string) => void; joinConfirm: string | null; setJoinConfirm: (id: string | null) => void; onJoinConfirmed: (id: string) => void; teams: Team[]; destinations: Destination[]; users: User[] }) {
  const team = getTeamById(teams, teamId)
  const dest = getDestById(destinations, team.destId)
  const members = team.memberIds.map(id => getUserById(users, id)).filter((u): u is User => !!u)
  const tr = TR[lang]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {joinConfirm && (
        <JoinConfirmModal
          team={getTeamById(teams, joinConfirm)}
          lang={lang}
          onConfirm={() => { onJoinConfirmed(joinConfirm); setJoinConfirm(null) }}
          onCancel={() => setJoinConfirm(null)}
        />
      )}
      <div className="relative h-64 overflow-hidden">
        <img src={team.photo} alt={team.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,27,14,0.75) 0%, transparent 50%)' }} />
        <button onClick={() => setView('teams')} className="absolute top-5 left-5 w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
          <Icon8 name="back" size={20} color="FFFFFF" />
        </button>
        <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>{team.name}</h1>
            <p className="text-white/75 text-sm flex items-center gap-1 mt-0.5"><Icon8 name="map-pin" size={12} color="FFFFFF" />{dest.name}</p>
          </div>
          <button onClick={() => setJoinConfirm(team.id)} className="px-5 py-2.5 rounded-2xl font-semibold text-white text-sm" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
            {tr.teams.join}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-5 mb-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <p className="leading-relaxed mb-4" style={{ color: 'var(--color-text-body)' }}>{team.description}</p>
          <div className="flex items-center gap-3 text-sm p-3 rounded-2xl" style={{ background: 'var(--color-cream)' }}>
            <Icon8 name="clock" size={16} color="E07A45" />
            <span style={{ color: 'var(--color-warm-mid)' }}>{tr.teams.date}: <strong>{team.date}</strong></span>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-5 mb-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-bold mb-4 text-lg" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>
            {L(lang, 'Team Members', 'Участники', "Jamoa a'zolari")} ({members.length})
          </h3>
          <div className="space-y-3">
            {members.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream transition-colors cursor-pointer" onClick={() => onProfileClick(user.id)}>
                <img src={avatarSrc(user)} alt={user.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-warm-dark)' }}>{user.name}</p>
                    {user.id === team.leader && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--color-badge-bg)', color: 'var(--color-badge-text)' }}>{L(lang, 'Leader', 'Лидер', 'Yetakchi')}</span>}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--color-warm-muted)' }}>{user.location}</p>
                </div>
                <Icon8 name="chevron-right" size={16} color="B8875A" darkColor="C9A876" className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Open chat button */}
        <button onClick={() => setView('chat')} className="w-full flex items-center justify-center gap-3 py-4 rounded-3xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #5B9B6E, #3E7A52)' }}>
          <Icon8 name="chat" size={20} color="FFFFFF" />
          {L(lang, 'Open Team Chat', 'Открыть Чат Команды', 'Jamoa Chatini Ochish')}
        </button>
      </div>
    </div>
  )
}