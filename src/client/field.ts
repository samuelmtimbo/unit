import { Style } from '../system/platform/Props'
import { Dict } from '../types/Dict'
import { $Element } from '../types/interface/async/$Element'
import { identity } from '../util/identity'
import { Element } from './element'
import { htmlPropHandler, inputPropHandler, PropHandler } from './propHandler'
import applyStyle from './style'

export function makeFieldInputEventHandler(
  component: Element,
  keyName: string = 'value',
  processValue: (value: string) => any = identity
) {
  return function (event: InputEvent) {
    const value = this[keyName]

    event.preventDefault()
    event.stopImmediatePropagation()

    const nextValue = processValue(value)

    component.set('value', nextValue)
    component.dispatchEvent(event.type, nextValue)
  }
}

export class Field<
  E extends
    | HTMLInputElement
    | HTMLTextAreaElement
    | (HTMLDivElement & ElementContentEditable) = any,
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
      processValue?: (value: string) => any
      propHandlers?: Dict<(value: any) => void>
    }
  ) {
    super($props, $system)

    const {
      valueKey,
      defaultStyle,
      defaultValue = '',
      processValue = identity,
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
