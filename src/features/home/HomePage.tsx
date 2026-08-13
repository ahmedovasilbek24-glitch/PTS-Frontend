import { useState, useEffect } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, User, Moment } from '@/shared/types'
import MomentCard from '@/features/moments/components/MomentCard'

export default function HomePage({ lang, setView, onProfileClick, users, moments, onToggleLike }: { lang: Lang; setView: (v: View) => void; setSelectedDest: (id: string) => void; onProfileClick: (id: string) => void; users: User[]; moments: Moment[]; onToggleLike: (moment: Moment) => void }) {
  const tr = TR[lang].home
  const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1400&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&h=800&fit=crop&auto=format',
  ]
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(id)
  }, [])

  const communityPosts = moments.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[85vh] min-h-[500px] overflow-hidden">
        {heroImages.map((src, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === heroIdx ? 1 : 0 }}>
            <img src={src} alt="Children" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(45,27,14,0.72) 0%, rgba(45,27,14,0.2) 60%, transparent 100%)' }} />

        {/* Hero dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} className={`rounded-full transition-all ${i === heroIdx ? 'w-6 h-2' : 'w-2 h-2'}`} style={{ background: i === heroIdx ? '#E07A45' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="px-6 sm:px-12 lg:px-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(224,122,69,0.25)', color: '#FBBF87', backdropFilter: 'blur(8px)', border: '1px solid rgba(224,122,69,0.3)' }}>
              <Icon8 name="like" size={12} filled color="FBBF87" /> 4,200+ Volunteers Worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
              {tr.heroTitle.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h1>
            <p className="text-white/85 text-lg mb-8 leading-relaxed max-w-lg">{tr.heroSub}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setView('destinations')} className="px-7 py-3.5 rounded-2xl font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
                {tr.cta}
              </button>
              <button onClick={() => setView('destinations')} className="px-7 py-3.5 rounded-2xl font-semibold transition-all hover:bg-white/20" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                {tr.explore}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="py-8 px-6" style={{ background: 'linear-gradient(135deg, #2D1B0E, #5A2E10)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[['4,200+', L(lang, 'Volunteers', 'Волонтёров', 'Volontyorlar')], ['340+', L(lang, 'Children Helped', 'Детей помогли', 'Yordam berilgan bolalar')], ['12', L(lang, 'Destinations', 'Направлений', "Yo'nalishlar")]].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'Lora, serif', color: '#FBBF87' }}>{num}</div>
              <div className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Children section */}
      <div className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>Eyes Full of Hope</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-warm-mid)' }}>
              {L(lang, 'These children are waiting for someone like you. Your time and love can change a life forever.', 'Эти дети ждут такого человека, как вы. Ваше время и любовь могут навсегда изменить чью-то жизнь.', "Bu bolalar sizga o'xshagan birovni kutmoqda. Sizning vaqtingiz va mehringiz kimningdir hayotini abadiy o'zgartirishi mumkin.")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&auto=format', tall: true },
              { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop&auto=format', tall: false },
              { url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop&auto=format', tall: false },
              { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=500&fit=crop&auto=format', tall: true },
            ].map((img, i) => (
              <div key={i} className={`rounded-3xl overflow-hidden ${img.tall ? 'row-span-2' : ''}`} style={{ height: img.tall ? '360px' : '170px' }}>
                <img src={img.url} alt="Child" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Moments */}
      <div className="py-16 px-6" style={{ background: 'var(--color-cream-dark)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Lora, serif', color: 'var(--color-warm-dark)' }}>{tr.community}</h2>
              <p className="text-base mt-2" style={{ color: 'var(--color-warm-mid)' }}>{tr.commSub}</p>
            </div>
            <button onClick={() => setView('community')} className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: '#E07A45' }}>
              See all <Icon8 name="chevron-right" size={16} color="E07A45" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {communityPosts.map(m => <MomentCard key={m.id} moment={m} lang={lang} users={users} onProfileClick={onProfileClick} onToggleLike={onToggleLike} />)}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #E07A45, #C4612E)' }}>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
          {L(lang, 'Ready to Make a Difference?', 'Готовы изменить мир?', "O'zgarish Yasashga Tayyormisiz?")}
        </h2>
        <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
          {L(lang, 'Join a team, find your destination, and start creating sweet moments today.', 'Присоединитесь к команде, найдите своё направление и начните создавать сладкие моменты.', "Jamoaga qo'shiling, yo'nalishingizni toping va bugundan shirin lahzalar yaratishni boshlang.")}
        </p>
        <button onClick={() => setView('teams')} className="px-8 py-4 bg-white rounded-2xl font-bold text-lg transition-all hover:shadow-xl active:scale-95" style={{ color: '#E07A45' }}>
          {L(lang, 'Browse Teams', 'Найти команду', "Jamoalarni Ko'rish")}
        </button>
      </div>
    </div>
  )
}