import Icon8 from '@/shared/ui/Icon8'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, Theme, User } from '@/shared/types'
import { avatarSrc } from '@/shared/helpers'

// ─── Nav ─────────────────────────────────────────────────────────────────────
export default function Nav({ view, setView, lang, setLang, onMyProfile, theme, onToggleTheme, currentUser, onLogout }: { view: View; setView: (v: View) => void; lang: Lang; setLang: (l: Lang) => void; onMyProfile: () => void; theme: Theme; onToggleTheme: () => void; currentUser: User; onLogout: () => void }) {
  const tr = TR[lang].nav
  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'home', label: tr.home, icon: 'home' },
    { id: 'destinations', label: tr.destinations, icon: 'map-pin' },
    { id: 'teams', label: tr.teams, icon: 'conference-call' },
    { id: 'profile', label: tr.profile, icon: 'user' },
  ]
  if (currentUser.isAdmin) {
    navItems.push({ id: 'admin', label: L(lang, 'Admin', 'Админ', 'Admin'), icon: 'security-checked' })
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[var(--color-surface)]/95 border-b shadow-sm" style={{ borderColor: 'var(--color-border)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full pl-[31px] pr-[31px] h-16 flex items-center gap-4">
        <button onClick={() => setView('home')} className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
            <Icon8 name="like" size={16} color="FFFFFF" filled />
          </div>
          <span className="font-bold hidden sm:block" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>VolunteerConnect</span>
        </button>

        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map(item => {
            const active = view === item.id
            return (
              <button key={item.id} onClick={() => item.id === 'profile' ? onMyProfile() : setView(item.id as View)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: active ? 'var(--color-cream)' : 'transparent', color: active ? '#E07A45' : 'var(--color-warm-mid)' }}>
                <Icon8 name={item.icon} size={16} color={active ? 'E07A45' : '7C4A1E'} darkColor={active ? 'E07A45' : 'D8B98C'} />{item.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} aria-label="Toggle dark mode" className="w-8 h-8 flex items-center justify-center rounded-xl border transition-colors hover:bg-cream" style={{ borderColor: 'var(--color-border-soft)', color: 'var(--color-warm-mid)' }}>
            {theme === 'dark' ? <Icon8 name="sun" size={14} color="D8B98C" /> : <Icon8 name="moon" size={14} color="7C4A1E" />}
          </button>
          <button onClick={() => setLang(lang === 'en' ? 'ru' : lang === 'ru' ? 'uz' : 'en')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hover:bg-cream" style={{ borderColor: 'var(--color-border-soft)', color: 'var(--color-warm-mid)' }}>
            <Icon8 name="globe" size={14} color="7C4A1E" darkColor="D8B98C" />
            {lang.toUpperCase()}
          </button>
          <button onClick={onMyProfile} className="flex items-center gap-2">
            <img src={avatarSrc(currentUser)} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow" />
          </button>
          <button onClick={onLogout} aria-label="Log out" className="w-8 h-8 flex items-center justify-center rounded-xl border transition-colors hover:bg-cream" style={{ borderColor: 'var(--color-border-soft)', color: 'var(--color-warm-mid)' }}>
            <Icon8 name="logout-rounded-left" size={14} color="7C4A1E" darkColor="D8B98C" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t flex" style={{ borderColor: 'var(--color-border)' }}>
        {navItems.map(item => {
          const active = view === item.id
          return (
            <button key={item.id} onClick={() => item.id === 'profile' ? onMyProfile() : setView(item.id as View)} className="flex-1 flex flex-col items-center py-2 gap-0.5" style={{ color: active ? '#E07A45' : 'var(--color-warm-muted)' }}>
              <Icon8 name={item.icon} size={16} color={active ? 'E07A45' : 'B8875A'} darkColor={active ? 'E07A45' : 'C9A876'} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}