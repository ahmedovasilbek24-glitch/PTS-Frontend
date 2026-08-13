import { useEffect, useRef, useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { ApiError } from '@/shared/api'
import { L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'

type ChatRole = 'user' | 'assistant'
interface ChatMsg { role: ChatRole; content: string }

function welcomeText(lang: Lang) {
  return L(
    lang,
    "Hi! I'm the Volunteer Connect assistant. Ask me about destinations, teams, or how to get started volunteering.",
    'Привет! Я ассистент Volunteer Connect. Спросите меня о направлениях, командах или о том, как начать волонтёрство.',
    "Salom! Men Volunteer Connect yordamchisiman. Yo'nalishlar, jamoalar yoki volontyorlikni qanday boshlash haqida so'rang."
  )
}

export default function AiChat({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open, busy])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setError(null)
    const history = messages
    const nextMessages: ChatMsg[] = [...history, { role: 'user', content: text }]
    setMessages(nextMessages)
    setBusy(true)
    try {
      const { reply } = await api.ai.chat(text, history, lang)
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send() }
  }

  return (
    <>
      {open && (
        <div
          className="fixed z-50 bottom-24 right-5 sm:right-6 w-[calc(100vw-2.5rem)] sm:w-96 max-h-[70vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Icon8 name="sparkling" size={16} color="FFFFFF" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">{L(lang, 'AI Assistant', 'AI Ассистент', 'AI Yordamchi')}</p>
              <p className="text-[11px] text-white/75 leading-tight">{L(lang, 'Volunteer Connect', 'Volunteer Connect', 'Volunteer Connect')}</p>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
              <Icon8 name="cancel" size={16} color="FFFFFF" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto chat-scroll px-3.5 py-3.5 space-y-3" style={{ background: 'var(--color-cream)' }}>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
                <Icon8 name="bot" size={14} color="FFFFFF" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]" style={{ background: 'var(--color-surface)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}>
                {welcomeText(lang)}
              </div>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
                    <Icon8 name="bot" size={14} color="FFFFFF" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                  style={m.role === 'user'
                    ? { background: 'linear-gradient(135deg, #E07A45, #C4612E)', color: 'white' }
                    : { background: 'var(--color-surface)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
                  <Icon8 name="bot" size={14} color="FFFFFF" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5" style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
                  <Icon8 name="loading" size={16} color="B8875A" darkColor="C9A876" className="animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs px-3 py-2 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 flex-shrink-0 border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
            <div className="flex items-end gap-2 p-1.5 rounded-2xl border" style={{ background: 'var(--color-cream)', borderColor: 'var(--color-border-soft)' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={L(lang, 'Ask something...', 'Спросите что-нибудь...', 'Nimadir so\'rang...')}
                rows={1}
                className="flex-1 bg-transparent text-sm outline-none resize-none leading-5 max-h-24 py-2 px-2"
                style={{ color: 'var(--color-warm-dark)' }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || busy}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}
              >
                <Icon8 name="send" size={16} color="FFFFFF" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="AI Assistant"
        className="fixed z-50 bottom-5 right-5 sm:right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}
      >
        {open ? <Icon8 name="cancel" size={24} color="FFFFFF" /> : <Icon8 name="bot" size={24} color="FFFFFF" />}
      </button>
    </>
  )
}