import { useState } from 'react'
import Icon8 from '@/shared/ui/Icon8'
import { TR, L } from '@/shared/i18n'
import type { Lang } from '@/shared/i18n'
import type { View, Destination } from '@/shared/types'

export default function DestinationsPage({ lang, setView, setSelectedDest, destinations }: { lang: Lang; setView: (v: View) => void; setSelectedDest: (id: string) => void; destinations: Destination[] }) {
  const tr = TR[lang].dest
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')

  const cities = Array.from(new Set(destinations.map(d => d.city)))
  const regions = Array.from(new Set(destinations.map(d => d.region)))

  const filtered = destinations.filter(d =>
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase()))
    && (!city || d.city === city)
    && (!region || d.region === region)
  )

  const hasFilters = !!search || !!city || !!region

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      <div className="py-12 px-6" style={{ background: 'linear-gradient(135deg, #2D1B0E, #5A2E10)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>{tr.title}</h1>
          <p className="text-white/70">{tr.sub}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters bar */}
        <div className="w-full bg-white dark:bg-[var(--color-surface)] rounded-3xl border p-5 mb-8 flex flex-col md:flex-row md:items-end gap-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.filters}</label>
            <div className="relative">
              <Icon8 name="search" size={16} color="B8875A" darkColor="C9A876" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={L(lang, 'Search destinations...', 'Поиск...', "Yo'nalishlarni qidirish...")}
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl text-sm outline-none"
                style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.city}</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            >
              <option value="">{tr.allCities}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-warm-mid)' }}>{tr.region}</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--color-cream)', color: 'var(--color-warm-dark)', border: '1.5px solid var(--color-border)' }}
            >
              <option value="">{tr.allRegions}</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setCity(''); setRegion('') }}
              className="w-full md:w-auto px-5 py-2.5 rounded-2xl text-xs font-semibold border transition-colors hover:bg-cream flex-shrink-0"
              style={{ borderColor: '#E07A45', color: '#E07A45', background: 'var(--color-surface)' }}
            >
              {tr.clear}
            </button>
          )}
        </div>

        {/* Destination cards */}
        <div className="w-full grid sm:grid-cols-2 gap-6">
          {filtered.map(dest => (
            <div key={dest.id} className="bg-white dark:bg-[var(--color-surface)] rounded-3xl overflow-hidden shadow-sm border transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer" style={{ borderColor: 'var(--color-border)' }} onClick={() => { setSelectedDest(dest.id); setView('dest-detail') }}>
              <div className="h-56 relative overflow-hidden">
                <img src={dest.photo} alt={dest.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,27,14,0.65) 0%, transparent 50%)' }} />
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: dest.active ? 'rgba(91,155,110,0.9)' : 'rgba(184,135,90,0.9)', color: 'white', backdropFilter: 'blur(4px)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {dest.active ? tr.active : tr.inactive}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>{dest.name}</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5"><Icon8 name="map-pin" size={12} color="FFFFFF" />{dest.city}, {dest.region}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-warm-mid)' }}>{dest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="font-bold" style={{ color: '#E07A45' }}>{dest.volunteers}</div>
                      <div className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{tr.volunteers}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: '#5B9B6E' }}>{dest.children}</div>
                      <div className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{tr.children}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: 'var(--color-warm-dark)' }}>{dest.teamIds.length}</div>
                      <div className="text-xs" style={{ color: 'var(--color-warm-muted)' }}>{L(lang, 'teams', 'команд', 'jamoa')}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#E07A45' }}>
                    {tr.viewTeams} <Icon8 name="chevron-right" size={16} color="E07A45" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="sm:col-span-2 text-center py-16 rounded-3xl border-2 border-dashed" style={{ borderColor: 'var(--color-border)', color: 'var(--color-warm-muted)' }}>
              {tr.noResults}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}