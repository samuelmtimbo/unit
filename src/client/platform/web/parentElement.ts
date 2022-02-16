import { System } from '../../../system'
import { IHTMLDivElement } from '../../../types/global/dom'

export default function parentElement($system: System): IHTMLDivElement {
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
