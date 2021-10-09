import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'
import {
  basePropHandler,
  inputPropHandler,
  PropHandler,
} from '../../propHandler'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
}

export const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  textAlign: 'left',
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  fontSize: '21px',
  display: 'flex',
  justifyContent: 'center',
  background: 'none',
  backgroundColor: '#00000000',
  padding: '0',
  border: 'none',
  overflowX: 'hidden',
  overflowY: 'auto',
  resize: 'none',
  // outline: 'none',
  boxSizing: 'border-box',
  color: '#C2C2C2',
}

export default class Map extends Element<HTMLTextAreaElement, Props> {
  private _text_area_el: HTMLTextAreaElement

  private _prop_handler: PropHandler

  constructor($props: Props) {
    super($props)

    let { style = {}, value = '' } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const text_area_el = document.createElement('textarea')
    text_area_el.spellcheck = false
    text_area_el.autocomplete = 'off'
    // text_area_el.autocorrect = 'off'
    text_area_el.autocapitalize = 'off'
    text_area_el.value = value
    text_area_el.inputMode = 'none'
    applyStyle(text_area_el, style)

    text_area_el.addEventListener('change', (event: InputEvent) => {
      const { value } = this._text_area_el
      event.stopImmediatePropagation()
      this.set('value', value)
      this._dispatch_change()
    })
    text_area_el.addEventListener('input', (event: InputEvent) => {
      const { value } = this._text_area_el
      event.stopImmediatePropagation()
      this.set('value', value)
      this._dispatch_input()
    })

    this._text_area_el = text_area_el

    this._prop_handler = {
      ...basePropHandler(this._text_area_el, DEFAULT_STYLE),
      ...inputPropHandler(this._text_area_el, 'value', ''),
    }

    this.$element = text_area_el
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  private _dispatch_input = () => {
    const value = this._text_area_el.value
    this.dispatchEvent('input', value)
  }

  private _dispatch_change = () => {
    const value = this._text_area_el.value
    this.dispatchEvent('change', value)
  }
}
