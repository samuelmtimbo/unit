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

export default class Checkbox extends Element<IHTMLInputElement, Props> {
  private _input_el: IHTMLInputElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    let { style = {}, value = false } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = this.$system.api.document.createElement('input')
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
