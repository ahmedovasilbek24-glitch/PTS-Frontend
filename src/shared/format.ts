import type { Lang } from './i18n'
import { L } from './i18n'

// ─── Time formatting ──────────────────────────────────────────────────────────
export function timeAgo(iso: string, lang: Lang): string {
  const sec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  const units: [number, (n: number) => string][] = [
    [60, () => L(lang, 'Just now', 'Только что', 'Hozirgina')],
    [3600, n => L(lang, `${n} min ago`, `${n} мин. назад`, `${n} daqiqa oldin`)],
    [86400, n => L(lang, `${n} hour${n > 1 ? 's' : ''} ago`, `${n} ч. назад`, `${n} soat oldin`)],
    [604800, n => L(lang, `${n} day${n > 1 ? 's' : ''} ago`, `${n} дн. назад`, `${n} kun oldin`)],
    [2592000, n => L(lang, `${n} week${n > 1 ? 's' : ''} ago`, `${n} нед. назад`, `${n} hafta oldin`)],
    [31536000, n => L(lang, `${n} month${n > 1 ? 's' : ''} ago`, `${n} мес. назад`, `${n} oy oldin`)],
  ]
  if (sec < 60) return units[0][1](0)
  if (sec < units[1][0]) return units[1][1](Math.floor(sec / 60))
  if (sec < units[2][0]) return units[2][1](Math.floor(sec / 3600))
  if (sec < units[3][0]) return units[3][1](Math.floor(sec / 86400))
  if (sec < units[4][0]) return units[4][1](Math.floor(sec / 604800))
  if (sec < units[5][0]) return units[5][1](Math.floor(sec / 2592000))
  const years = Math.floor(sec / 31536000)
  return L(lang, `${years} year${years > 1 ? 's' : ''} ago`, `${years} г. назад`, `${years} yil oldin`)
}

export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}