import { System } from '../../../system'
import { IOElement } from '../../IOElement'

export default function createFullwindow(system: System): IOElement {
  const {
    api: {
      document: { createElement },
    },
  } = system

  const container = createElement('div')

  container.className = '__fullwindow'

  container.style.position = 'absolute'
  container.style.display = 'flex'
  container.style.flexWrap = 'wrap'
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.top = '0'
  container.style.left = '0'
  container.style.contain = 'size layout style paint'
  container.style.overflow = 'auto'

  return container
}
