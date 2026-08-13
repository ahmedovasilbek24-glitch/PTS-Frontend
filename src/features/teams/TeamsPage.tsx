import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, Team, Destination, User } from '@/shared/types'
import { getTeamById } from '@/shared/helpers'
import JoinConfirmModal from './components/JoinConfirmModal'
import CreateTeamModal from './components/CreateTeamModal'
import TeamCard from './components/TeamCard'

export default function TeamsPage({ lang, setView, setSelectedTeam, joinConfirm, setJoinConfirm, onJoinConfirmed, teams, onTeamCreated, destinations, users }: { lang: Lang; setView: (v: View) => void; setSelectedTeam: (id: string) => void; joinConfirm: string | null; setJoinConfirm: (id: string | null) => void; onJoinConfirmed: (id: string) => void; teams: Team[]; onTeamCreated: (team: Team) => void; destinations: Destination[]; users: User[] }) {
  const tr = TR[lang].teams
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const filtered = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

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
      {createOpen && (
        <CreateTeamModal
          lang={lang}
          destinations={destinations}
          onClose={() => setCreateOpen(false)}
          onCreate={(team) => { setCreateOpen(false); onTeamCreated(team) }}
        />
      )}
      <div className="py-12 px-6" style={{ background: 'linear-gradient(135deg, #5B9B6E, #3E7A52)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>{tr.title}</h1>
              <p className="text-white/75 mt-1">{tr.sub}</p>
            </div>
            <button onClick={() => setCreateOpen(true)} className="px-4 py-2 rounded-2xl text-sm font-semibold bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
              {tr.create}
            </button>
          </div>
          <div className="relative">
            <Icon8 name="search" size={16} color="FFFFFF" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={L(lang, 'Search teams...', 'Поиск команд...', 'Jamoalarni qidirish...')} className="w-full max-w-md pl-11 pr-4 py-3 rounded-2xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)' }} />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(team => (
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
    </div>
  )
}