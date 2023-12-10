import { Dict } from '../types/Dict'
import { darkenColor, lightenColor } from './color'
import { Mode } from './mode'

export type Theme = 'light' | 'dark'

export const COLOR_GRAYSCALE_BASE00 = '#FCFCFC'
export const COLOR_GRAYSCALE_BASE01 = '#E5E5E5'
export const COLOR_GRAYSCALE_BASE02 = '#D3D3D3'
export const COLOR_GRAYSCALE_BASE03 = '#C2C2C2'
export const COLOR_GRAYSCALE_BASE04 = '#B0B0B0'
export const COLOR_GRAYSCALE_BASE05 = '#A1A1A1'
export const COLOR_GRAYSCALE_BASE06 = '#787878'
export const COLOR_GRAYSCALE_BASE07 = '#636363'
export const COLOR_GRAYSCALE_BASE08 = '#4D4D4D'
export const COLOR_GRAYSCALE_BASE09 = '#363636'
export const COLOR_GRAYSCALE_BASE10 = '#1F1F1F'
export const COLOR_GRAYSCALE_BASE11 = '#080808'

export const COLOR_RED = '#ff6666'
export const COLOR_LINK_RED = '#ff4d4d'
export const COLOR_OPAQUE_RED = '#ff0000'

export const COLOR_GREEN = '#00aa11'
export const COLOR_LINK_GREEN = '#0b8e14'
export const COLOR_OPAQUE_GREEN = '#3ac346'

export const COLOR_DARK_GREEN = '#007700'
export const COLOR_DARK_LINK_GREEN = '#085a01'
export const COLOR_DARK_OPAQUE_GREEN = '#079013'

export const COLOR_BLUE = '#0066ff'
export const COLOR_LINK_BLUE = '#1d62c9'

export const COLOR_CHARTREUSE = '#dfff00'
export const COLOR_LINK_CHARTREUSE = '#cddd00'

export const COLOR_DARK_CHARTREUSE = '#d84315' // orange
export const COLOR_DARK_LINK_CHARTREUSE = '#bf360c'

export const COLOR_WHITE = '#ffffff'

export const COLOR_YELLOW = '#ffcc00'
export const COLOR_LINK_YELLOW = '#ffbb00'

export const COLOR_DARK_YELLOW = '#ef6c00' // orange
export const COLOR_DARK_LINK_YELLOW = '#e65100'

export const COLOR_NONE = '#00000000'

export const COLOR_OPAQUE_CYAN = 'hsl(180, 70%, 40%)'

export const COLOR_MAGENTA = 'hsl(300, 100%, 40%)'
export const COLOR_OPAQUE_MAGENTA = 'hsl(300, 70%, 40%)'

export const COLOR_TEXT = COLOR_GRAYSCALE_BASE03
export const COLOR_SUB_TEXT = COLOR_GRAYSCALE_BASE06
export const COLOR_NEGATIVE_TEXT = COLOR_GRAYSCALE_BASE09
export const COLOR_NODE = COLOR_GRAYSCALE_BASE02
export const COLOR_LINK = COLOR_GRAYSCALE_BASE07
export const COLOR_HOVERED = COLOR_GRAYSCALE_BASE08
export const COLOR_SELECTED = COLOR_GRAYSCALE_BASE04
export const COLOR_COMPATIBLE = COLOR_GREEN

export const DARK_MODE_COLOR: Dict<string> = {
  change: COLOR_BLUE,
  remove: COLOR_RED,
  add: COLOR_GREEN,
  data: COLOR_CHARTREUSE,
}

export const LIGHT_MODE_COLOR: Dict<string> = {
  change: COLOR_BLUE,
  remove: COLOR_RED,
  add: COLOR_DARK_GREEN,
  data: COLOR_DARK_CHARTREUSE,
}

export const DARK_LINK_MODE_COLOR: Dict<string> = {
  add: COLOR_LINK_GREEN,
  remove: COLOR_LINK_RED,
  change: COLOR_LINK_BLUE,
  data: COLOR_LINK_CHARTREUSE,
}

export const LIGHT_LINK_MODE_COLOR: Dict<string> = {
  add: COLOR_DARK_LINK_GREEN,
  remove: COLOR_LINK_RED,
  change: COLOR_LINK_BLUE,
  data: COLOR_DARK_LINK_CHARTREUSE,
}

export const getActiveColor = ($theme: Theme): string => {
  if ($theme === 'dark') {
    return COLOR_YELLOW
  } else {
    return COLOR_DARK_YELLOW
  }
}

export const getThemeModeColor = (
  theme: Theme,
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

export const themeBackgroundColor = ($theme: Theme): string => {
  return $theme === 'dark' ? '#1f1f1f' : '#d1d1d1'
}

export const oppositeTheme = ($theme: Theme): Theme => {
  return $theme === 'dark' ? 'light' : 'dark'
}

export function applyTheme(
  theme: Theme,
  color: string,
  factor: number
): string {
  if (theme === 'dark') {
    return darkenColor(color, factor)
  } else {
    return lightenColor(color, factor)
  }
}

export function defaultThemeColor(theme: Theme): string {
  if (theme === 'dark') {
    return COLOR_GRAYSCALE_BASE00
  } else {
    return COLOR_GRAYSCALE_BASE11
  }
}
