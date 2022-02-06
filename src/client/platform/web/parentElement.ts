import { System } from '../../../system'

export default function parentElement($system: System): HTMLDivElement {
  const {
    api: {
      document: { createElement },
    },
  } = $system

  const $parent = createElement('div')

  $parent.className = '__parent'
  $parent.style.display = 'contents'

  return $parent
}
