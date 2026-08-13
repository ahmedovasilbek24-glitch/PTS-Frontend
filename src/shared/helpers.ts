import type { User, Team, Destination, Moment } from './types'

// ─── Default avatar (data URI, no network dependency) ─────────────────────────
export const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23E8D5C4"/><circle cx="50" cy="38" r="18" fill="%23C4612E"/><ellipse cx="50" cy="88" rx="30" ry="24" fill="%23C4612E"/></svg>'
    .replace(/%23/g, '#')
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function avatarSrc(user: User | null | undefined) { return user?.avatar || DEFAULT_AVATAR }
export function getUserById(users: User[], id: string) { return users.find(u => u.id === id) }
export function getTeamById(teams: Team[], id: string) { return teams.find(t => t.id === id)! }
export function getDestById(destinations: Destination[], id: string) { return destinations.find(d => d.id === id)! }
export function getUserMoments(moments: Moment[], userId: string) { return moments.filter(m => m.userId === userId) }
export function getTeamsForDest(teams: Team[], destId: string) { return teams.filter(t => t.destId === destId) }