
// Real icons hotlinked from icons8.com (img.icons8.com CDN)
const BASE = 'https://img.icons8.com'

function hex(c: string) {
  return c.replace('#', '').trim().toUpperCase()
}

export interface Icon8Props {
  /** icons8 icon slug, e.g. "home", "map-pin" */
  name: string
  /** rendered width/height in px */
  size: number
  /** icon color for light mode (hex, with or without #) */
  color: string
  /** icon color for dark mode, if it should differ from `color` */
  darkColor?: string
  /** use the solid "ios-filled" icon set instead of the outline "ios" set */
  filled?: boolean
  className?: string
}

export default function Icon8({ name, size, color, darkColor, filled = false, className = '' }: Icon8Props) {
  const style = filled ? 'ios-filled' : 'ios'
  const light = hex(color)
  const dark = darkColor ? hex(darkColor) : light
  const src = (c: string) => `${BASE}/${style}/100/${c}/${name}.png`

  if (light === dark) {
    return <img src={src(light)} width={size} height={size} alt="" draggable={false} className={className} />
  }
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size, lineHeight: 0 }}>
      <img src={src(light)} width={size} height={size} alt="" draggable={false} className="block dark:hidden" />
      <img src={src(dark)} width={size} height={size} alt="" draggable={false} className="hidden dark:block" />
    </span>
  )
}