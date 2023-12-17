import { Style } from '@_unit/unit/lib/system/platform/Props'
import { Dict } from '../types/Dict'
import { IOElement } from './IOElement'

export function rawExtractStyle(element: IOElement): Style {
  if (element instanceof Text) {
    return {}
  }

  const _style: Dict<string> = {}

  const { style } = element

  for (let i = 0; i < style.length; i++) {
    const key = style[i]
    const value = style.getPropertyValue(key)

    _style[key] = value
  }

  return _style
}
