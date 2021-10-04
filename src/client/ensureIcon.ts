import { System } from '../boot'
import namespaceURI from './component/namespaceURI'
import ICONS from './icons'

export const SPRITESHEET_ID = '__SYSTEM__SPRITESHEET__'

export const SPRITESHEET_VIEWBOX = '0 0 24 24'

export const ensureIcon = ($system: System, id: string): void => {
  const {
    $flag: { __SYSTEM__SPRITESHEET__MAP__ },
    $foreground: { $sprite },
  } = $system

  if (__SYSTEM__SPRITESHEET__MAP__[id]) {
    return
  }

  let d = ICONS[id]
  if (!d) {
    return
  }

  const symbol_el = document.createElementNS(namespaceURI, 'symbol')
  symbol_el.id = id
  symbol_el.setAttribute('viewBox', SPRITESHEET_VIEWBOX)

  const path_el = document.createElementNS(namespaceURI, 'path')
  path_el.setAttribute('d', d)

  symbol_el.appendChild(path_el)

  $sprite.appendChild(symbol_el)

  __SYSTEM__SPRITESHEET__MAP__[id] = true
}
