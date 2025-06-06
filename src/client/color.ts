export type RGBA = [number, number, number, number]

export const _nameToColor = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  'indianred ': '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
}

export function isColorName(name: string): boolean {
  return _nameToColor[name]
}

export function nameToColor(name: string): string {
  return _nameToColor[name]
}

export function isHex(name: string): boolean {
  return /^#[a-fA-F0-9]+$/g.test(name)
}

const rgbaRegex =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/

export function isRgbaString(color: string): boolean {
  return rgbaRegex.test(color)
}

export function rgbaStringToHex(color: string): string {
  const [, r, g, b, a = '1'] = color.match(rgbaRegex)

  const alpha = Math.round(Number.parseFloat(a) * 255)

  return rgbaToHex_(
    Number.parseInt(r),
    Number.parseInt(g),
    Number.parseInt(b),
    alpha
  )
}

export function colorToHex(color: string): string {
  let hex: string

  if (isHex(color)) {
    hex = color
  } else if (isRgbaString(color)) {
    hex = rgbaStringToHex(color)
  } else {
    hex = nameToColor(color) ?? color
  }

  return hex
}

export function rgbaToHex_(r: number, g: number, b: number, a: number) {
  const hex =
    '#' +
    (0x100000000 + r * 0x1000000 + g * 0x10000 + b * 0x100 + a)
      .toString(16)
      .slice(1)
  return hex
}

export function rgbaToHex(rgba: RGBA): string {
  const [r, g, b, a] = rgba

  return rgbaToHex_(r, g, b, a)
}

export function hexToRgba(hex: string): RGBA {
  hex = hex.padEnd(9, 'f')

  hex = hex.slice(1)

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const a = Number.parseInt(hex.slice(6, 8), 16)

  return [r, g, b, a]
}

export function hexToHsv(hex: string): number[] {
  const [r, g, b] = hexToRgba(hex)
  const hsv = RGBToHSV(r, g, b)
  return hsv
}

export function hueToHex(h: number): string {
  h = h % 360

  let r
  let g
  let b
  let a = 255

  if (h >= 0 && h < 60) {
    r = 255
    g = Math.floor(((h - 0) / 60) * 255)
    b = 0
  } else if (h >= 60 && h < 120) {
    r = Math.floor(((120 - h) / 60) * 255)
    g = 255
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = Math.floor(((h - 120) / 60) * 255)
    b = 255
  } else if (h >= 180 && h < 240) {
    r = 0
    g = 255
    b = Math.floor(((240 - h) / 60) * 255)
  } else if (h >= 240 && h < 300) {
    r = 0
    g = 255
    b = Math.floor(((h - 240) / 60) * 255)
  } else {
    r = 255
    g = 0
    b = Math.round(((360 - h) / 60) * 255)
  }

  return rgbaToHex_(r, g, b, a)
}

// https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function RGBToHSV(r: number, g: number, b: number): number[] {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn
  rabs = r / 255
  gabs = g / 255
  babs = b / 255
  ;(v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs))
  diffc = (c) => (v - c) / 6 / diff + 1 / 2
  percentRoundFn = (num) => Math.round(num * 100) / 100
  if (diff === 0) {
    h = s = 0
  } else {
    s = diff / v
    rr = diffc(rabs)
    gg = diffc(gabs)
    bb = diffc(babs)

    if (rabs === v) {
      h = bb - gg
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb
    } else if (babs === v) {
      h = 2 / 3 + gg - rr
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }
  return [Math.round(h * 360), percentRoundFn(s * 100), percentRoundFn(v * 100)]
}

export function hslToHex(h: number, s: number, l: number): string {
  l = 1 - l

  s /= 100
  l /= 100

  let a = 255

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return rgbaToHex_(r, g, b, a)
}

export function hsvToRgba(h: number, s: number, v: number): number[] {
  h = h / 360
  s = s / 100
  v = v / 100

  let r: number
  let g: number
  let b: number

  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
    default:
      r = 0
      g = 0
      b = 0
      break
  }

  return [r * 255, g * 255, b * 255].map(Math.round)
}

export function hsvToHex(h: number, s: number, v: number): string {
  const [r, g, b, a] = hsvToRgba(h, s, v)
  const hex = rgbaToHex_(r, g, b, a)
  return hex
}

// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color

export function padZero(str: string, len: number = 2) {
  return pad('0', str, len)
}

export function padF(str: string, len: number = 2) {
  return pad('f', str, len)
}

export function pad(char: string, str: string, len: number = 2) {
  const zeros = new Array(len).join(char)

  return (zeros + str).slice(-len)
}

export function invertColor(hex: string, bw: boolean = true): string {
  hex = hex.slice(1)

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  if (hex.length !== 6) {
    throw new Error('invalid hex color')
  }

  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16)
  const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16)
  const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)

  return '#' + padZero(r) + padZero(g) + padZero(b)
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

export function setAlpha(color: string, alpha: number): string {
  const h = Math.floor(alpha * 16 * 16)
  const A0 = Math.floor(h / 16)
  const A1 = Math.floor(h % 16)
  const AS0 = A0.toString(16)
  const AS1 = A1.toString(16)
  const A = AS0 + AS1
  return color.substring(0, 7) + A
}

export function lightenColor(color: string, percent: number): string {
  const base = percent > 0 ? 'white' : 'black'

  return `color-mix(in srgb, ${color}, ${base} ${Math.abs(percent)}%)`
}

export function darkenColor(color: string, percent: number): string {
  return lightenColor(color, -percent)
}

export const TRANSPARENT_RGBA = hexToRgba('#00000000')
