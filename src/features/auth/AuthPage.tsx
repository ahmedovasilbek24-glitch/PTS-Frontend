import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import * as api from '@/shared/api'
import { ApiError } from '@/shared/api'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { User } from '@/shared/types'
import { UZ_REGIONS } from './regions'

export default function AuthPage({ lang, setLang, onAuthenticated }: { lang: Lang; setLang: (l: Lang) => void; onAuthenticated: (user: User) => void }) {
  const tr = TR[lang].auth
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const citiesForRegion = UZ_REGIONS.find(r => r.region === region)?.cities ?? []

  function handleRegionChange(next: string) {
    setRegion(next)
    setCity(UZ_REGIONS.find(r => r.region === next)?.cities[0] ?? '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const user = mode === 'login'
        ? await api.auth.login(email.trim(), password)
        : await api.auth.register({ email: email.trim(), password, name: name.trim(), location: city || region })
      onAuthenticated(user)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const inputWrap = 'relative'
  const inputIcon = 'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
  const inputClass = 'w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-colors focus:border-[#E07A45]'
  const inputStyle = { background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' } as const

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-cream)' }}>
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #2D1B0E, #5A2E10)' }}>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(224,122,69,0.35), transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(91,155,110,0.25), transparent 70%)' }} />
        <div className="relative text-center max-w-sm">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
            <Icon8 name="like" size={32} color="FFFFFF" filled />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>{tr.brand}</h1>
          <p className="text-white/70 leading-relaxed">{tr.tagline}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
              <Icon8 name="like" size={28} color="FFFFFF" filled />
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.brand}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-warm-muted)' }}>{tr.tagline}</p>
          </div>

          <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-6 sm:p-8 shadow-2xl border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex rounded-2xl p-1 mb-7" style={{ background: 'var(--color-cream)' }}>
              <button type="button" onClick={() => setMode('login')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={mode === 'login' ? { background: 'var(--color-surface)', color: '#E07A45', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: 'var(--color-warm-muted)' }}>
                {tr.login}
              </button>
              <button type="button" onClick={() => setMode('register')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={mode === 'register' ? { background: 'var(--color-surface)', color: '#E07A45', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: 'var(--color-warm-muted)' }}>
                {tr.register}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm px-3 py-2.5 rounded-xl" style={{ background: '#FCE8E0', color: '#C4612E' }}>{error}</p>}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.name}</label>
                  <div className={inputWrap}>
                    <Icon8 name="user" size={16} color="B8875A" darkColor="C9A876" className={inputIcon} />
                    <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.email}</label>
                <div className={inputWrap}>
                  <Icon8 name="mail" size={16} color="B8875A" darkColor="C9A876" className={inputIcon} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.password}</label>
                <div className={inputWrap}>
                  <Icon8 name="lock" size={16} color="B8875A" darkColor="C9A876" className={inputIcon} />
                  <input required type={showPassword ? 'text' : 'password'} minLength={mode === 'register' ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-11`} style={inputStyle} />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-warm-muted)' }} tabIndex={-1}>
                    {showPassword ? <Icon8 name="hide" size={16} color="B8875A" darkColor="C9A876" /> : <Icon8 name="visible" size={16} color="B8875A" darkColor="C9A876" />}
                  </button>
                </div>
              </div>
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.region}</label>
                    <select required value={region} onChange={e => handleRegionChange(e.target.value)} className="w-full px-3.5 py-3 rounded-2xl text-sm outline-none" style={inputStyle}>
                      <option value="" disabled>{tr.regionPlaceholder}</option>
                      {UZ_REGIONS.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.city}</label>
                    <select required disabled={!region} value={city} onChange={e => setCity(e.target.value)} className="w-full px-3.5 py-3 rounded-2xl text-sm outline-none disabled:opacity-50" style={inputStyle}>
                      {citiesForRegion.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" disabled={busy} className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
                {busy ? <Icon8 name="loading" size={16} color="FFFFFF" className="animate-spin" /> : (mode === 'login' ? tr.submitLogin : tr.submitRegister)}
              </button>
            </form>

            <p className="text-center text-xs mt-5" style={{ color: 'var(--color-warm-muted)' }}>
              {mode === 'login' ? tr.noAccount : tr.haveAccount}{' '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-semibold hover:underline" style={{ color: '#E07A45' }}>
                {mode === 'login' ? tr.switchToRegister : tr.switchToLogin}
              </button>
            </p>
          </div>

          <button onClick={() => setLang(lang === 'en' ? 'ru' : lang === 'ru' ? 'uz' : 'en')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border mx-auto mt-6 transition-colors hover:bg-cream" style={{ borderColor: 'var(--color-border-soft)', color: 'var(--color-warm-mid)' }}>
            <Icon8 name="globe" size={14} color="7C4A1E" darkColor="D8B98C" />
            {lang.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  )
}