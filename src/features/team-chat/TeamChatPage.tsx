import { useState, useRef, useEffect } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, Team, User, Message } from '@/shared/types'
import { getUserById, getTeamById, avatarSrc } from '@/shared/helpers'
import { clockTime } from '@/shared/format'

export default function TeamChatPage({ teamId, lang, setView, teams, users, currentUser }: { teamId: string; lang: Lang; setView: (v: View) => void; teams: Team[]; users: User[]; currentUser: User }) {
  const team = getTeamById(teams, teamId)
  const tr = TR[lang].chat
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastTimeRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    lastTimeRef.current = undefined
    setMessages([])

    async function poll() {
      try {
        const fetched = await api.teams.messages(teamId, lastTimeRef.current)
        if (cancelled || fetched.length === 0) return
        lastTimeRef.current = fetched[fetched.length - 1].time
        setMessages(m => [...m, ...fetched])
      } catch {
        // transient network error — next poll will retry
      }
    }

    void poll()
    const interval = setInterval(() => { void poll() }, 3000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [teamId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendText() {
    const text = input.trim()
    if (!text) return
    setInput('')
    const sent = await api.teams.sendMessage(teamId, { text })
    lastTimeRef.current = sent.time
    setMessages(m => [...m, sent])
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const uploaded = await api.uploadFile(file)
      const sent = await api.teams.sendMessage(teamId, { imageUrl: uploaded.url })
      lastTimeRef.current = sent.time
      setMessages(m => [...m, sent])
    } finally {
      setUploading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendText() } }

  const members = team.memberIds.map(id => getUserById(users, id)).filter((u): u is User => !!u)

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shadow-sm bg-white dark:bg-[var(--color-surface)] z-10" style={{ borderColor: 'var(--color-border)' }}>
        <button onClick={() => setView('team-detail')} className="w-9 h-9 rounded-2xl flex items-center justify-center hover:bg-cream transition-colors" style={{ background: 'var(--color-cream)' }}>
          <Icon8 name="back" size={16} color="7C4A1E" darkColor="D8B98C" />
        </button>
        <div className="flex -space-x-2">
          {members.slice(0, 3).map(u => <img key={u.id} src={avatarSrc(u)} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: 'var(--color-warm-dark)' }}>{team.name}</p>
          <p className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{members.length} {L(lang, 'members', 'участников', "a'zo")}</p>
        </div>
        <Icon8 name="chat" size={20} color="5B9B6E" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-4">
        {messages.map(msg => {
          const user = getUserById(users, msg.userId)
          const isMe = msg.userId === currentUser.id
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && <img src={avatarSrc(user)} alt={user?.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />}
              <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMe && <p className="text-xs font-semibold px-1" style={{ color: 'var(--color-warm-mid)' }}>{user?.name}</p>}
                <div className={`rounded-2xl overflow-hidden ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} style={{ background: isMe ? 'linear-gradient(135deg, #E07A45, #C4612E)' : 'var(--color-surface)', border: isMe ? 'none' : '1.5px solid var(--color-border)' }}>
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="" className="max-w-full rounded-xl" style={{ maxHeight: '280px', objectFit: 'cover', display: 'block' }} />
                  )}
                  {msg.text && <p className="px-4 py-2.5 text-sm leading-relaxed" style={{ color: isMe ? 'white' : 'var(--color-warm-dark)' }}>{msg.text}</p>}
                </div>
                <p className="text-xs px-1" style={{ color: 'var(--color-warm-muted)' }}>{clockTime(msg.time)}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white dark:bg-[var(--color-surface)] border-t" style={{ borderColor: 'var(--color-border)' }}>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        <div className="flex items-end gap-2 p-2 rounded-3xl border" style={{ background: 'var(--color-cream)', borderColor: 'var(--color-border-soft)' }}>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 hover:bg-cream-dark transition-colors disabled:opacity-40" style={{ background: 'var(--color-surface)', color: 'var(--color-warm-mid)' }}>
            {uploading ? <Icon8 name="loading" size={16} color="7C4A1E" darkColor="D8B98C" className="animate-spin" /> : <Icon8 name="image" size={16} color="7C4A1E" darkColor="D8B98C" />}
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={tr.placeholder}
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none leading-5 max-h-32 py-2"
            style={{ color: 'var(--color-warm-dark)' }}
          />
          <button
            onClick={sendText}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}
          >
            <Icon8 name="send" size={16} color="FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  )
}