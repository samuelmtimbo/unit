import { System } from '../../system'
import namespaceURI from '../component/namespaceURI'
import { SPRITESHEET_ID } from '../ensureIcon'

export function attachSprite(system: System): void {
  const {
    root,
    api: {
      document: { createElementNS },
    },
  } = system

  const sprite = createElementNS(namespaceURI, 'svg')

  sprite.id = SPRITESHEET_ID

  sprite.style.display = 'none'

  root.shadowRoot.appendChild(sprite)

  system.foreground.sprite = sprite
}
