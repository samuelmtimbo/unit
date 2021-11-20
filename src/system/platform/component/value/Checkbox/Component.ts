import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import {
  PropHandler,
  htmlPropHandler,
  inputPropHandler,
} from '../../../../../client/propHandler'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: boolean
  disabled?: boolean
}

export const DEFAULT_STYLE = {
  display: 'block',
  height: '100%',
  width: '100%',
  color: 'inherit',
  margin: '0',
  backgroundColor: '#00000000',
  padding: '0',
  // outline: 'none',
}

export default class Checkbox extends Element<HTMLInputElement, Props> {
  private _input_el: HTMLInputElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    let { style = {}, value = false } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = document.createElement('input')
    input_el.checked = value
    input_el.name = 'checkbox'
    input_el.value = 'checkbox'
    input_el.type = 'checkbox'

    input_el.addEventListener('change', (event: InputEvent) => {
      const { checked } = input_el
      event.stopImmediatePropagation()
      this.set('value', checked)
      this.dispatchEvent('change', checked)
    })

    input_el.addEventListener('input', (event: InputEvent) => {
      const { checked } = input_el
      event.stopImmediatePropagation()
      this.set('value', checked)
      this.dispatchEvent('input', checked)
    })

    applyStyle(input_el, style)

    this._input_el = input_el

    this._prop_handler = {
      ...htmlPropHandler(this._input_el, DEFAULT_STYLE),
      ...inputPropHandler(this._input_el, 'checked', false),
    }

    this.$element = input_el
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
