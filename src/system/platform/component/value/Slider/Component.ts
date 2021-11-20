import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: number
  min?: number
  max?: number
  disabled?: boolean
}

export const DEFAULT_STYLE = {
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  textAlign: 'center',
  padding: '0',
  margin: '0',
  fontSize: '12px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export default class Slider extends Element<HTMLInputElement, Props> {
  private _input_el: HTMLInputElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    let { style = {}, value = '0', min = 0, max = 100 } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = document.createElement('input')
    input_el.value = `${value}`
    input_el.type = 'range'
    input_el.min = `${min}`
    input_el.max = `${max}`
    applyStyle(input_el, style)
    this._input_el = input_el

    input_el.addEventListener('change', (event: InputEvent) => {
      const value = Number.parseInt(input_el.value, 10)
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('change', value)
    })

    input_el.addEventListener('input', (event: InputEvent) => {
      const value = Number.parseInt(input_el.value, 10)
      event.stopImmediatePropagation()
      this.set('value', value)
      this.dispatchEvent('input', value)
    })

    this.$element = input_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this.$element.className = current
    } else if (prop === 'style') {
      applyStyle(this._input_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'value') {
      this._input_el.value = `${current || '0'}`
    } else if (prop === 'min') {
      this._input_el.min = `${current}`
    } else if (prop === 'max') {
      this._input_el.max = `${current}`
    }
  }
}
