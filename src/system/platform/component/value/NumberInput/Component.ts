import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: number
  max?: number
  min?: number
  disabled?: boolean
}

export const DEFAULT_STYLE = {
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

export default class NumberInput extends Element<HTMLInputElement, Props> {
  private _input_el: HTMLInputElement

  constructor($props: Props) {
    super($props)

    let { style = {}, value = 0, min, max } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const input_el = document.createElement('input')
    input_el.value = `${value}`
    input_el.type = 'number'
    // BUG
    // Chrome
    // inputMode 'none' not working on mobile for input type number
    input_el.inputMode = 'none'
    applyStyle(input_el, style)

    if (min !== undefined) {
      input_el.min = `${min}`
    }

    if (max !== undefined) {
      input_el.max = `${max}`
    }

    input_el.addEventListener('change', (event: InputEvent) => {
      event.stopImmediatePropagation()
      const { value } = input_el

      let data = Number.parseFloat(value)

      if (isNaN(data)) {
        // value is not a valid number
        if (value === '') {
          input_el.value = ''
          data = 0
        }
      }

      this.set('value', value)

      this.dispatchEvent('change', data)
    })

    input_el.addEventListener('input', (event: InputEvent) => {
      event.stopImmediatePropagation()
      let { value } = input_el

      let data = Number.parseFloat(value)

      if (isNaN(data)) {
        input_el.value = ''
        data = 0
        value = ''
      }

      this.set('value', value)

      this.dispatchEvent('input', data)
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
      const value = current || 0
      this._input_el.value = `${value}`
    } else if (prop === 'min') {
      if (current === undefined) {
        this._input_el.removeAttribute('min')
      } else {
        this._input_el.min = `${current}`
      }
    } else if (prop === 'max') {
      if (current === undefined) {
        this._input_el.removeAttribute('max')
      } else {
        this._input_el.max = `${current}`
      }
    }
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this._input_el.setSelectionRange(start, end, direction)
  }

  getValue({}: {}, callback: (data: number) => void): void {
    const value = Number.parseFloat(this._input_el.value || '0')
    callback(value)
  }

  setValue(
    { value }: { value: number },
    callback: (data: number) => void
  ): void {
    this._input_el.value = value.toString()
    callback(value)
  }
}
