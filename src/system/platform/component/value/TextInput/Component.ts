import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import {
  htmlPropHandler,
  inputPropHandler,
  PropHandler,
} from '../../../../../client/propHandler'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLInputElement } from '../../../../../types/global/dom'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  maxLength?: number
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  padding: '0',
  fontSize: '18px',
  // outlineColor: '#00000000',
  border: 'none',
  borderRadius: '0',
}

export default class TextInput extends Element<IHTMLInputElement, Props> {
  private _input_el: IHTMLInputElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    let { style = {}, value = '', maxLength, tabIndex } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = this.$system.api.document.createElement('input')
    input_el.spellcheck = false
    input_el.autocomplete = 'off'
    // input_el.autocomplete = 'disabled'
    // input_el.autocorrect = 'off'
    input_el.autocapitalize = 'off'
    input_el.inputMode = 'none'
    // input_el.inputMode = 'text'
    input_el.value = value
    input_el.type = 'text'

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

    if (maxLength !== undefined) {
      input_el.maxLength = maxLength
    }

    if (tabIndex !== undefined) {
      input_el.tabIndex = tabIndex
    }

    applyStyle(input_el, style)

    this._input_el = input_el

    this._prop_handler = {
      ...htmlPropHandler(this._input_el, DEFAULT_STYLE),
      ...inputPropHandler(this._input_el, 'value', ''),

      maxLength: (maxLength: number | undefined): void => {
        this._input_el.maxLength = maxLength
      },
    }

    this.$element = input_el
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  // TODO

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this._input_el.setSelectionRange(start, end, direction)
  }
}
