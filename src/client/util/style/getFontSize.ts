import { IOElement } from '../../IOElement'

export function parseFontSizeStr(fontSize: string): {
  value: number
  unit: string
} {
  const value = Number.parseFloat(fontSize.substring(0, fontSize.length - 2))
  const unit = fontSize.slice(-2)

  return { value, unit }
}

export function getFontSize(
  element: IOElement,
  width: number,
  height: number,
  parentFontSize: number
): number | undefined {
  if (element instanceof Text) {
    return
  }

  const { fontSize } = element.style

  if (fontSize) {
    return parseFontSize(fontSize, width, height, parentFontSize)
  }
}

export function parseFontSize(
  fontSize: string,
  width: number,
  height: number,
  parentFontSize: number
): number {
  const { value, unit } = parseFontSizeStr(fontSize)

  let value_ = value

  if (unit === 'vw') {
    value_ = (value_ * width) / 100
  } else if (unit === 'vh') {
    value_ = (value_ * height) / 100
  } else if (unit === 'em') {
    return value * parentFontSize
  }

  return value_
}
