import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  display: 'block',
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  padding: '0',
  fontSize: '12px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
}

export default class ColorInput extends Element<HTMLInputElement, Props> {
  private _input_el: HTMLInputElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    let { style = {}, value = '#000000', tabIndex = -1 } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = document.createElement('input')
    input_el.value = value
    input_el.type = 'color'
    input_el.tabIndex = tabIndex

    applyStyle(input_el, style)

    input_el.addEventListener('change', (event) => {
      const value = input_el.value
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('change', value)
    })

    input_el.addEventListener('input', (event) => {
      const value = input_el.value
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('input', value)
    })

    this._input_el = input_el

    this.$element = input_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this.$element.className = current
    } else if (prop === 'style') {
      applyStyle(this._input_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'value') {
      this._input_el.value = current || ''
    }
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this._input_el.setSelectionRange(start, end, direction)
  }

  public focus(options?: FocusOptions | undefined) {
    this._input_el.focus(options)
  }

  public blur() {
    this._input_el.blur()
  }
}
