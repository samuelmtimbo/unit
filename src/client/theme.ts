import { Dict } from '../types/Dict'
import { Mode } from './mode'

export const GRAYSCALE_BASE00 = '#FCFCFC'
export const GRAYSCALE_BASE01 = '#E5E5E5'
export const GRAYSCALE_BASE02 = '#D3D3D3'
export const GRAYSCALE_BASE03 = '#C2C2C2'
export const GRAYSCALE_BASE04 = '#B0B0B0'
export const GRAYSCALE_BASE05 = '#A1A1A1'
export const GRAYSCALE_BASE06 = '#787878'
export const GRAYSCALE_BASE07 = '#636363'
export const GRAYSCALE_BASE08 = '#4D4D4D'
export const GRAYSCALE_BASE09 = '#363636'
export const GRAYSCALE_BASE10 = '#1F1F1F'
export const GRAYSCALE_BASE11 = '#080808'

export const RED = '#ff6666'
export const LINK_RED = '#ff4d4d'
export const OPAQUE_RED = '#ff0000'

export const GREEN = '#00aa11'
export const LINK_GREEN = 'hsla(124, 85%, 30%, 1)'
export const OPAQUE_GREEN = 'rgba(58, 195, 70, 0.24)'

export const BLUE = '#0066ff'
export const LINK_BLUE = '#1d62c9'

export const CHARTREUSE = '#dfff00'
export const LINK_CHARTREUSE = '#cddd00'
export const DARK_CHARTREUSE = '#d84315' // organge
export const DARK_LINK_CHARTREUSE = '#bf360c'

export const LIGHT_GRAY = GRAYSCALE_BASE02
export const GRAY = GRAYSCALE_BASE06
export const DARK_GRAY = GRAYSCALE_BASE10

export const WHITE = 'white'

export const YELLOW = '#ffcc00'
export const LINK_YELLOW = '#ffbb00'

export const DARK_YELLOW = '#ef6c00' // orange
export const DARK_LINK_YELLOW = '#e65100'

export const NONE = '#00000000'

export const CYAN = 'hsl(180, 100%, 40%)'
export const OPAQUE_CYAN = 'hsl(180, 70%, 40%)'

export const MAGENTA = 'hsl(300, 100%, 40%)'
export const OPAQUE_MAGENTA = 'hsl(300, 70%, 40%)'

export const TEXT_COLOR = GRAYSCALE_BASE03
export const SUB_TEXT_COLOR = GRAYSCALE_BASE06
export const NEGATIVE_TEXT_COLOR = GRAYSCALE_BASE09
export const NODE_COLOR = GRAYSCALE_BASE02
export const LINK_COLOR = GRAYSCALE_BASE07
export const HOVERED_COLOR = GRAYSCALE_BASE08
export const SELECTED_COLOR = GRAYSCALE_BASE04
export const COMPATIBLE_COLOR = GREEN

export const DARK_MODE_COLOR: Dict<string> = {
  change: BLUE,
  remove: RED,
  add: GREEN,
  data: CHARTREUSE,
}

export const LIGHT_MODE_COLOR: Dict<string> = {
  change: BLUE,
  remove: RED,
  add: GREEN,
  data: DARK_CHARTREUSE,
}

export const DARK_LINK_MODE_COLOR: Dict<string> = {
  add: LINK_GREEN,
  remove: LINK_RED,
  change: LINK_BLUE,
  data: LINK_CHARTREUSE,
}

export const LIGHT_LINK_MODE_COLOR: Dict<string> = {
  add: LINK_GREEN,
  remove: LINK_RED,
  change: LINK_BLUE,
  data: DARK_LINK_CHARTREUSE,
}

export const getActiveColor = ($theme: 'dark' | 'light'): string => {
  if ($theme === 'dark') {
    return YELLOW
  } else {
    return DARK_YELLOW
  }
}

export const getThemeModeColor = (
  theme: 'dark' | 'light',
  mode: Mode,
  _default: string
) => {
  if (theme === 'dark') {
    return DARK_MODE_COLOR[mode] || _default
  } else {
    return LIGHT_MODE_COLOR[mode] || _default
  }
}

export const getThemeLinkModeColor = (theme: string, mode: Mode): string => {
  if (theme === 'dark') {
    return DARK_LINK_MODE_COLOR[mode]
  } else {
    return LIGHT_LINK_MODE_COLOR[mode]
  }
}

export const themeBackgroundColor = ($theme: 'light' | 'dark'): string => {
  return $theme === 'dark' ? '#1f1f1f' : '#d1d1d1'
}

export const oppositeTheme = ($theme: 'light' | 'dark'): 'light' | 'dark' => {
  return $theme === 'dark' ? 'light' : 'dark'
}

export const randomColorString = (): string => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function randomColorArray(n: number): string[] {
  const array: string[] = []
  for (let i = 0; i < n; i++) {
    array.push(randomColorString())
  }
  return array
}

// TODO
export function RGBStrToRGB(str: string): [number, number, number] {
  return [0, 0, 0]
}

export function RGBtoHSL(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h
  let s
  let l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
    }
    h /= 6
  }

  return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)]
}

export function defaultThemeColor(theme: 'light' | 'dark'): string {
  if (theme === 'dark') {
    return GRAYSCALE_BASE00
  } else {
    return GRAYSCALE_BASE11
  }
}

// TODO Performance
export function applyTheme(
  theme: 'light' | 'dark',
  color: string,
  factor: number
): string {
  if (theme === 'dark') {
    return darkenColor(color, factor)
  } else {
    return lightenColor(color, factor)
  }
}

export function setAlpha(color: string, alpha: number): string {
  const h = Math.floor(alpha * 16 * 16)
  const A0 = h / 16
  const A1 = h % 16
  const AS0 = A0.toString(16)
  const AS1 = A1.toString(16)
  const A = AS0 + AS1
  return color.substring(0, 7) + A
}

// set color `percent` closer to #ffffff
export function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.slice(1), 16)
  const amt = Math.round(2.55 * percent)
  const r = num >> 16
  const g = (num >> 8) & 0x00ff
  const b = num & 0x0000ff
  // const R = r + amt
  // const G = g + amt
  // const B = b + amt
  percent += 100
  const p = percent / 100
  const R = Math.round(r * p)
  const G = Math.round(g * p)
  const B = Math.round(b * p)

  const _color =
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)

  return _color
}

export function darkenColor(color: string, percent: number): string {
  return lightenColor(color, -percent)
}
