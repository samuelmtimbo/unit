import { Style } from '../system/platform/Props'
import { Dict } from '../types/Dict'
import { $Element } from '../types/interface/async/$Element'
import { identity } from '../util/identity'
import { Element } from './element'
import { htmlPropHandler, inputPropHandler, PropHandler } from './propHandler'
import applyStyle from './style'

export type InputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | (HTMLDivElement & ElementContentEditable)

export function makeFieldInputEventHandler<E extends InputElement>(
  component: Element,
  keyName: string = 'value',
  processValue: (element: E, value: string) => any = identity
) {
  return function (event: InputEvent) {
    const value = this[keyName]

    event.preventDefault()
    event.stopImmediatePropagation()

    const nextValue = processValue(component.$element, value)

    component.set('value', nextValue)
    component.dispatchEvent(event.type, nextValue)
  }
}

export class Field<
  E extends InputElement = any,
  P extends object = {},
  U extends $Element = $Element
> extends Element<E, P, U> {
  private _prop_handler: PropHandler

  constructor(
    $props: any,
    $system: any,
    $element: E,
    opt: {
      valueKey: string
      defaultStyle?: Style
      defaultValue?: any
      processValue?: ($element: E, value: string) => any
      propHandlers?: Dict<(value: any) => void>
    }
  ) {
    super($props, $system)

    const {
      valueKey,
      defaultStyle,
      defaultValue = '',
      processValue = ($element, value) => value,
    } = opt

    let { style = {}, value = defaultValue } = $props

    style = { ...defaultStyle, ...style }

    this.$element = $element

    this.$element[valueKey] = value

    applyStyle($element, style)

    const inputEventHandler = makeFieldInputEventHandler(
      this,
      valueKey,
      processValue
    )

    this.$element.addEventListener('change', inputEventHandler)
    this.$element.addEventListener('input', inputEventHandler)

    this._prop_handler = {
      ...htmlPropHandler(this, defaultStyle),
      ...inputPropHandler(this.$element, valueKey, defaultValue),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
