import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLInputElement } from '../../../../../types/global/dom'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  show?: boolean
}

export const DEFAULT_STYLE = {
  '-webkit-text-security': 'disc',
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  textAlign: 'center',
  padding: '0',
  fontSize: '18px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
}

export default class PasswordField extends Element<IHTMLInputElement, Props> {
  private _input_el: IHTMLInputElement

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    let { style = {}, value = '', show = false } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = this.$system.api.document.createElement('input')
    input_el.value = value
    // input_el.type = 'password'
    input_el.type = 'text'
    input_el.autocomplete = 'false'
    applyStyle(input_el, style)

    input_el.addEventListener('change', (event: InputEvent) => {
      const value = input_el.value
      event.preventDefault()
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('change', value)
    })

    input_el.addEventListener('input', (event: InputEvent) => {
      const value = input_el.value
      event.preventDefault()
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

  // TODO

  public setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this._input_el.setSelectionRange(start, end, direction)
  }

  public focus(options: FocusOptions | undefined = { preventScroll: true }) {
    this._input_el.focus(options)
  }

  public blur() {
    this._input_el.blur()
  }
}
