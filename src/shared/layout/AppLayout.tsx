import type { ReactNode } from 'react'
import type { Lang } from '@/shared/i18n'
import type { View, Theme, User } from '@/shared/types'
import Nav from './Nav'
import AiChat from '@/features/ai-assistant/AiChat'

export default function AppLayout({ isChat, lang, navProps, children }: {
  isChat: boolean
  lang: Lang
  navProps: {
    view: View
    setView: (v: View) => void
    setLang: (l: Lang) => void
    onMyProfile: () => void
    theme: Theme
    onToggleTheme: () => void
    currentUser: User
    onLogout: () => void
  }
  children: ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {!isChat && <Nav lang={lang} {...navProps} />}
      {children}
      {!isChat && <AiChat lang={lang} />}
    </div>
  )
}