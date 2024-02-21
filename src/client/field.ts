import { Style } from '../system/platform/Style'
import { Dict } from '../types/Dict'
import { $Element } from '../types/interface/async/$Element'
import { identity } from '../util/identity'
import { Element } from './element'
import { htmlPropHandler, inputPropHandler, PropHandler } from './propHandler'
import { applyStyle } from './style'

export type InputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLDivElement

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

    const isInput =
      $element instanceof HTMLInputElement ||
      $element instanceof HTMLTextAreaElement ||
      $element instanceof HTMLSelectElement

    const inputEventHandler = makeFieldInputEventHandler(
      this,
      valueKey,
      processValue
    )

    this.$element.addEventListener('change', inputEventHandler)
    this.$element.addEventListener('input', inputEventHandler)

    this._prop_handler = {
      ...htmlPropHandler(this, this.$element, defaultStyle),
      ...(isInput
        ? inputPropHandler(
            this.$element as HTMLInputElement,
            valueKey,
            defaultValue
          )
        : {
            value: (value: any | undefined) => {
              this.$element[valueKey] = value
            },
          }),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
