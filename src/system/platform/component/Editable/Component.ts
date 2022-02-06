import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { htmlPropHandler } from '../../../../client/propHandler'
import { Pod } from '../../../../pod'
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
  data?: Dict<string>
}

const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Editable extends Element<HTMLDivElement, Props> {
  private _div_el: HTMLDivElement

  private _prop_handler

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      id,
      className,
      style,
      innerText,
      tabIndex,
      title,
      draggable,
      data = {},
    } = this.$props

    const $element = this.$system.api.document.createElement('div')

    $element.contentEditable = 'true'

    if (id !== undefined) {
      $element.id = id
    }
    if (className !== undefined) {
      $element.className = className
    }
    applyStyle($element, { ...DEFAULT_STYLE, ...style })
    if (innerText) {
      $element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }
    if (title) {
      $element.title = title
    }
    if (draggable !== undefined) {
      // $element.setAttribute('draggable', draggable.toString())
      $element.draggable = draggable
    }
    $element.spellcheck = false
    if (data !== undefined) {
      for (const key in data) {
        const d = data[key]
        $element.dataset[key] = d
      }
    }

    $element.addEventListener('change', (event) => {
      const value = $element.textContent
      event.preventDefault()
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('change', value)
    })

    $element.addEventListener('input', (event) => {
      const value = $element.textContent
      event.preventDefault()
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('input', value)
    })

    this._prop_handler = {
      ...htmlPropHandler(this._div_el, DEFAULT_STYLE),
      value: (value: string | undefined = '') => {
        this._div_el.textContent = value
      },
    }

    this._div_el = $element

    this.$element = $element
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
