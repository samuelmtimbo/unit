import { System } from '../../boot'
import namespaceURI from '../component/namespaceURI'
import { SPRITESHEET_ID } from '../ensureIcon'

export function attachSprite($system: System): void {
  const { $root } = $system

  const sprite = document.createElementNS(namespaceURI, 'svg')

  sprite.id = SPRITESHEET_ID

  sprite.style.display = 'none'

  $root.appendChild(sprite)

  $system.$foreground.$sprite = sprite
}
