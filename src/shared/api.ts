// Client for the pts-backend ASP.NET Core API (see ../../pts-backent).
// Auth is a JWT stored in an httpOnly cookie set by the server, so every
// request goes with `credentials: 'include'` and no token handling here.

export const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5162'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: init?.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function get<T>(path: string) {
  return request<T>(path)
}
function post<T>(path: string, body?: unknown) {
  return request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) })
}
function put<T>(path: string, body?: unknown) {
  return request<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) })
}
function del<T>(path: string) {
  return request<T>(path, { method: 'DELETE' })
}

// ─── DTOs (mirror PtsBackend.Dtos) ────────────────────────────────────────────
export interface UserDto {
  id: string
  name: string
  email: string
  avatar: string | null
  bio: string
  location: string
  joined: string
  followers: number
  following: number
  momentsCount: number
  isAdmin: boolean
}

export interface DestinationDto {
  id: string
  name: string
  country: string
  city: string
  region: string
  active: boolean
  description: string
  photo: string
  volunteers: number
  children: number
  teamIds: string[]
}

export interface TeamDto {
  id: string
  name: string
  destId: string
  description: string
  leader: string
  memberIds: string[]
  date: string
  photo: string
}

export interface MomentMediaDto {
  type: 'image' | 'video'
  url: string
}

export interface MomentDto {
  id: string
  userId: string
  text: string
  media: MomentMediaDto[]
  likes: number
  time: string
  liked: boolean
}

export interface MessageDto {
  id: string
  userId: string
  text: string | null
  imageUrl: string | null
  time: string
}

export interface UploadResult {
  url: string
  type: 'image' | 'video'
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  login: (email: string, password: string) => post<UserDto>('/api/auth/login', { email, password }),
  register: (body: { email: string; password: string; name: string; avatar?: string; bio?: string; location?: string }) =>
    post<UserDto>('/api/auth/register', body),
  logout: () => post<{ ok: boolean }>('/api/auth/logout'),
  me: () => get<UserDto>('/api/auth/me'),
}

// ─── Destinations ──────────────────────────────────────────────────────────────
export const destinations = {
  list: (params?: { search?: string; city?: string; region?: string }) => {
    const qs = new URLSearchParams()
    if (params?.search) qs.set('search', params.search)
    if (params?.city) qs.set('city', params.city)
    if (params?.region) qs.set('region', params.region)
    const suffix = qs.toString() ? `?${qs}` : ''
    return get<DestinationDto[]>(`/api/destinations${suffix}`)
  },
  get: (id: string) => get<DestinationDto>(`/api/destinations/${id}`),
  teams: (id: string) => get<TeamDto[]>(`/api/destinations/${id}/teams`),
}

// ─── Teams ─────────────────────────────────────────────────────────────────────
export const teams = {
  list: (search?: string) => get<TeamDto[]>(`/api/teams${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  get: (id: string) => get<TeamDto>(`/api/teams/${id}`),
  create: (body: { name: string; destId: string; description: string; date: string; photo?: string }) =>
    post<TeamDto>('/api/teams', body),
  join: (id: string) => post<TeamDto>(`/api/teams/${id}/join`),
  messages: (id: string, since?: string) =>
    get<MessageDto[]>(`/api/teams/${id}/messages${since ? `?since=${encodeURIComponent(since)}` : ''}`),
  sendMessage: (id: string, body: { text?: string; imageUrl?: string }) =>
    post<MessageDto>(`/api/teams/${id}/messages`, body),
}

// ─── Moments ───────────────────────────────────────────────────────────────────
export const moments = {
  list: () => get<MomentDto[]>('/api/moments'),
  create: (body: { text?: string; media?: { type: 'image' | 'video'; url: string }[] }) =>
    post<MomentDto>('/api/moments', body),
  like: (id: string) => post<MomentDto>(`/api/moments/${id}/like`),
  unlike: (id: string) => del<MomentDto>(`/api/moments/${id}/like`),
}

// ─── Users ─────────────────────────────────────────────────────────────────────
export const users = {
  list: (search?: string) => get<UserDto[]>(`/api/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  updateMe: (body: Partial<{ name: string; bio: string; location: string; avatar: string }>) => put<UserDto>('/api/users/me', body),
  get: (id: string) => get<UserDto>(`/api/users/${id}`),
  follow: (id: string) => post<UserDto>(`/api/users/${id}/follow`),
  unfollow: (id: string) => del<UserDto>(`/api/users/${id}/follow`),
  moments: (id: string) => get<MomentDto[]>(`/api/users/${id}/moments`),
}

// ─── Uploads ───────────────────────────────────────────────────────────────────
export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)
  return request<UploadResult>('/api/uploads', { method: 'POST', body: form })
}

// ─── AI Assistant ──────────────────────────────────────────────────────────────
export const ai = {
  chat: (message: string, history: { role: 'user' | 'assistant'; content: string }[], lang: string) =>
    post<{ reply: string }>('/api/ai/chat', { message, history, lang }),
}

// ─── Admin ─────────────────────────────────────────────────────────────────────
export const admin = {
  createDestination: (body: { name: string; country: string; city: string; region: string; description: string; photo?: string; children?: number; active?: boolean }) =>
    post<DestinationDto>('/api/admin/destinations', body),
  updateDestination: (id: string, body: Partial<{ name: string; country: string; city: string; region: string; description: string; photo: string; children: number; active: boolean }>) =>
    put<DestinationDto>(`/api/admin/destinations/${id}`, body),
  deleteDestination: (id: string) => del<void>(`/api/admin/destinations/${id}`),

  updateTeam: (id: string, body: Partial<{ name: string; description: string; date: string; photo: string; destId: string; leaderId: string }>) =>
    put<TeamDto>(`/api/admin/teams/${id}`, body),
  deleteTeam: (id: string) => del<void>(`/api/admin/teams/${id}`),

  updateUser: (id: string, body: Partial<{ name: string; bio: string; location: string; avatar: string; isAdmin: boolean }>) =>
    put<UserDto>(`/api/admin/users/${id}`, body),
  deleteUser: (id: string) => del<void>(`/api/admin/users/${id}`),

  deleteMoment: (id: string) => del<void>(`/api/admin/moments/${id}`),
  deleteMessage: (id: string) => del<void>(`/api/admin/messages/${id}`),
}