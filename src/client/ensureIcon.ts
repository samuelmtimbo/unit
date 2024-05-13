import { System } from '../system'
import { namespaceURI } from './component/namespaceURI'

export const SYSTEM_SPRITESHEET_ID = '__SYSTEM__SPRITESHEET__'
export const SPRITESHEET_VIEWBOX = '0 0 24 24'

export const ensureIcon = (system: System, id: string): void => {
  const {
    api: {
      document: { createElementNS },
    },
    cache: { spriteSheetMap },
    foreground: { sprite },
    icons,
  } = system

  if (spriteSheetMap[id]) {
    return
  }

  let d = icons[id]

  if (!d) {
    return
  }

  const symbol_el = createElementNS(namespaceURI, 'symbol')
  symbol_el.id = id
  symbol_el.setAttribute('viewBox', SPRITESHEET_VIEWBOX)

  const path_el = createElementNS(namespaceURI, 'path')
  path_el.setAttribute('d', d)

  symbol_el.appendChild(path_el)

  sprite.appendChild(symbol_el)

  spriteSheetMap[id] = true
}
