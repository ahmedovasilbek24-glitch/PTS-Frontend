import Icon8 from '@/shared/ui/Icon8'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, Team, Destination, User } from '@/shared/types'
import { getDestById, getTeamsForDest, getTeamById } from '@/shared/helpers'
import TeamCard from '@/features/teams/components/TeamCard'
import JoinConfirmModal from '@/features/teams/components/JoinConfirmModal'

export default function DestDetailPage({ destId, lang, setView, setSelectedTeam, joinConfirm, setJoinConfirm, onJoinConfirmed, allTeams, destinations, users }: { destId: string; lang: Lang; setView: (v: View) => void; setSelectedTeam: (id: string) => void; joinConfirm: string | null; setJoinConfirm: (id: string | null) => void; onJoinConfirmed: (id: string) => void; allTeams: Team[]; destinations: Destination[]; users: User[] }) {
  const dest = getDestById(destinations, destId)
  const teams = getTeamsForDest(allTeams, destId)
  const tr = TR[lang]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {joinConfirm && (
        <JoinConfirmModal
          team={getTeamById(allTeams, joinConfirm)}
          lang={lang}
          onConfirm={() => { onJoinConfirmed(joinConfirm); setJoinConfirm(null) }}
          onCancel={() => setJoinConfirm(null)}
        />
      )}
      <div className="relative h-80 overflow-hidden">
        <img src={dest.photo} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,27,14,0.8) 0%, transparent 50%)' }} />
        <button onClick={() => setView('destinations')} className="absolute top-5 left-5 w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
          <Icon8 name="back" size={20} color="FFFFFF" />
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Lora, serif' }}>{dest.name}</h1>
          <p className="text-white/80 flex items-center gap-1"><Icon8 name="map-pin" size={16} color="FFFFFF" />{dest.country}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-6 mb-8 border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
          <p className="leading-relaxed mb-5" style={{ color: 'var(--color-text-body)' }}>{dest.description}</p>
          <div className="flex gap-6">
            <div><span className="text-2xl font-bold" style={{ color: '#E07A45', fontFamily: 'Lora, serif' }}>{dest.volunteers}</span><span className="text-sm ml-1" style={{ color: 'var(--color-warm-muted)' }}>{tr.dest.volunteers}</span></div>
            <div><span className="text-2xl font-bold" style={{ color: '#5B9B6E', fontFamily: 'Lora, serif' }}>{dest.children}</span><span className="text-sm ml-1" style={{ color: 'var(--color-warm-muted)' }}>{tr.dest.children}</span></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.destDetail.teams}</h2>
        {teams.length === 0
          ? <p style={{ color: 'var(--color-warm-muted)' }}>{tr.destDetail.noTeams}</p>
          : <div className="grid sm:grid-cols-2 gap-5">
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                lang={lang}
                users={users}
                onJoin={() => setJoinConfirm(team.id)}
                onView={() => { setSelectedTeam(team.id); setView('team-detail') }}
              />
            ))}
          </div>
        }
      </div>
    </div>
  )
}