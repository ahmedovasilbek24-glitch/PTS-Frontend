import Icon8 from '@/shared/ui/Icon8'

export default function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
      <Icon8 name="loading" size={32} color="E07A45" className="animate-spin" />
    </div>
  )
}