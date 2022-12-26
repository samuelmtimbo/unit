import { Field } from '../../../../client/field'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  value?: string
  id?: string
  className?: string
  style?: Dict<string>
  innerText?: string
  tabIndex?: number
  title?: string
  draggable?: boolean
}

const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Editable extends Field<
  HTMLDivElement & ElementContentEditable,
  Props
> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('div'), {
      valueKey: 'textContent',
      defaultStyle: DEFAULT_STYLE,
    })

    const { id, className, style, innerText, tabIndex, title, draggable } =
      this.$props

    this.$element.contentEditable = 'true'
    this.$element.spellcheck = false
    this.$element.inputMode = 'none'

    if (id !== undefined) {
      this.$element.id = id
    }
    if (className !== undefined) {
      this.$element.className = className
    }
    if (innerText) {
      this.$element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
    if (title) {
      this.$element.title = title
    }
    if (draggable !== undefined) {
      this.$element.draggable = draggable
    }
  }
}
