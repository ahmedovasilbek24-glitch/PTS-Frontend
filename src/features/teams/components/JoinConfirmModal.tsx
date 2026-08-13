import Icon8 from '@/shared/ui/Icon8'
import { TR } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { Team } from '@/shared/types'

export default function JoinConfirmModal({ team, onConfirm, onCancel, lang }: { team: Team; onConfirm: () => void; onCancel: () => void; lang: Lang }) {
  const tr = TR[lang].teams
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(45,27,14,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white dark:bg-[var(--color-surface)] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in">
        <div className="w-16 h-16 bg-amber-light rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Icon8 name="conference-call" size={32} color="E07A45" />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.confirmTitle}</h3>
        <p className="text-warm-muted mb-2" style={{ color: 'var(--color-warm-muted)' }}>{team.name}</p>
        <p className="text-sm mb-8" style={{ color: 'var(--color-warm-mid)' }}>{tr.confirmMsg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border-2 font-semibold transition-colors hover:bg-cream" style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}>
            {tr.no}
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
            {tr.yes}
          </button>
        </div>
      </div>
    </div>
  )
}