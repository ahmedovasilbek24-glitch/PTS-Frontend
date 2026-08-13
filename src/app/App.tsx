import { useState, useEffect, useCallback } from 'react'
import * as api from '@/shared/api'
import type { Lang } from '@/shared/i18n'
import type { View, Theme, Destination, Team, User, Moment } from '@/shared/types'
import FullScreenLoader from '@/shared/layout/FullScreenLoader'
import AppLayout from '@/shared/layout/AppLayout'
import AuthPage from '@/features/auth/AuthPage'
import HomePage from '@/features/home/HomePage'
import DestinationsPage from '@/features/destinations/DestinationsPage'
import DestDetailPage from '@/features/destinations/DestDetailPage'
import TeamsPage from '@/features/teams/TeamsPage'
import TeamDetailPage from '@/features/teams/TeamDetailPage'
import TeamChatPage from '@/features/team-chat/TeamChatPage'
import ProfilePage from '@/features/profile/ProfilePage'
import CommunityPage from '@/features/community/CommunityPage'
import AdminPage from '@/features/admin/AdminPage'

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>('home')
  const [lang, setLang] = useState<Lang>('en')
  const [selectedDest, setSelectedDest] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [joinConfirm, setJoinConfirm] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('vc-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // ─── Auth ────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    api.auth.me()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthChecked(true))
  }, [])

  // ─── Data (loaded once a user is signed in) ───────────────────────────────
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [moments, setMoments] = useState<Moment[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const loadData = useCallback(async () => {
    setDataLoaded(false)
    const [d, t, u, m] = await Promise.all([
      api.destinations.list(),
      api.teams.list(),
      api.users.list(),
      api.moments.list(),
    ])
    setDestinations(d)
    setTeams(t)
    setUsers(u)
    setMoments(m)
    setDataLoaded(true)
  }, [])

  useEffect(() => {
    if (currentUser) void loadData()
  }, [currentUser, loadData])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('vc-theme', theme)
  }, [theme])

  function onToggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  function onAuthenticated(user: User) {
    setCurrentUser(user)
  }

  async function onLogout() {
    await api.auth.logout().catch(() => {})
    setCurrentUser(null)
    setDataLoaded(false)
    setView('home')
  }

  function onProfileClick(userId: string) {
    setSelectedProfile(userId)
    setView('profile')
  }

  function onMyProfile() {
    if (!currentUser) return
    setSelectedProfile(currentUser.id)
    setView('profile')
  }

  async function onJoinConfirmed(teamId: string) {
    const updated = await api.teams.join(teamId)
    setTeams(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedTeam(teamId)
    setView('team-detail')
  }

  function onTeamCreated(team: Team) {
    setTeams(prev => [team, ...prev])
    setSelectedTeam(team.id)
    setView('team-detail')
  }

  function onMomentPosted(moment: Moment) {
    setMoments(prev => [moment, ...prev])
  }

  async function onToggleLike(moment: Moment) {
    setMoments(prev => prev.map(m => m.id === moment.id ? { ...m, liked: !m.liked, likes: m.liked ? m.likes - 1 : m.likes + 1 } : m))
    try {
      const updated = moment.liked ? await api.moments.unlike(moment.id) : await api.moments.like(moment.id)
      setMoments(prev => prev.map(m => m.id === updated.id ? updated : m))
    } catch {
      setMoments(prev => prev.map(m => m.id === moment.id ? moment : m))
    }
  }

  function onUserUpdated(user: User) {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u))
    setCurrentUser(prev => prev && prev.id === user.id ? user : prev)
  }

  const isChat = view === 'chat'

  if (!authChecked) return <FullScreenLoader />
  if (!currentUser) return <AuthPage lang={lang} setLang={setLang} onAuthenticated={onAuthenticated} />
  if (!dataLoaded) return <FullScreenLoader />

  return (
    <AppLayout
      isChat={isChat}
      lang={lang}
      navProps={{
        view,
        setView,
        setLang,
        onMyProfile,
        theme,
        onToggleTheme,
        currentUser,
        onLogout,
      }}
    >
      {view === 'home' && (
        <HomePage lang={lang} setView={setView} setSelectedDest={(id) => { setSelectedDest(id); setView('dest-detail') }} onProfileClick={onProfileClick} users={users} moments={moments} onToggleLike={onToggleLike} />
      )}
      {view === 'destinations' && (
        <DestinationsPage lang={lang} setView={setView} setSelectedDest={setSelectedDest} destinations={destinations} />
      )}
      {view === 'dest-detail' && selectedDest && (
        <DestDetailPage
          destId={selectedDest}
          lang={lang}
          setView={setView}
          setSelectedTeam={setSelectedTeam}
          joinConfirm={joinConfirm}
          setJoinConfirm={setJoinConfirm}
          onJoinConfirmed={onJoinConfirmed}
          allTeams={teams}
          destinations={destinations}
          users={users}
        />
      )}
      {view === 'teams' && (
        <TeamsPage
          lang={lang}
          setView={setView}
          setSelectedTeam={setSelectedTeam}
          joinConfirm={joinConfirm}
          setJoinConfirm={setJoinConfirm}
          onJoinConfirmed={onJoinConfirmed}
          teams={teams}
          onTeamCreated={onTeamCreated}
          destinations={destinations}
          users={users}
        />
      )}
      {view === 'team-detail' && selectedTeam && (
        <TeamDetailPage
          teamId={selectedTeam}
          lang={lang}
          setView={setView}
          onProfileClick={onProfileClick}
          joinConfirm={joinConfirm}
          setJoinConfirm={setJoinConfirm}
          onJoinConfirmed={onJoinConfirmed}
          teams={teams}
          destinations={destinations}
          users={users}
        />
      )}
      {view === 'chat' && selectedTeam && (
        <TeamChatPage teamId={selectedTeam} lang={lang} setView={setView} teams={teams} users={users} currentUser={currentUser} />
      )}
      {view === 'profile' && selectedProfile && (
        <ProfilePage
          userId={selectedProfile}
          lang={lang}
          users={users}
          onProfileClick={onProfileClick}
          isMe={selectedProfile === currentUser.id}
          currentUser={currentUser}
          moments={moments}
          onMomentPosted={onMomentPosted}
          onToggleLike={onToggleLike}
          onUserUpdated={onUserUpdated}
        />
      )}
      {view === 'community' && (
        <CommunityPage lang={lang} onProfileClick={onProfileClick} users={users} moments={moments} onToggleLike={onToggleLike} />
      )}
      {view === 'admin' && currentUser.isAdmin && (
        <AdminPage lang={lang} destinations={destinations} teams={teams} users={users} moments={moments} currentUser={currentUser} reloadData={loadData} />
      )}
    </AppLayout>
  )
}