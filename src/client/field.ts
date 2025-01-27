import { Style } from '../system/platform/Style'
import { Dict } from '../types/Dict'
import { identity } from '../util/identity'
import { Element } from './element'
import HTMLElement_ from './html'
import { inputPropHandler } from './propHandler'

export type InputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLFieldSetElement
  | HTMLDivElement

export function makeFieldInputEventHandler(
  component: Element,
  keyName: string = 'value',
  processValue: (value: string) => any = identity
) {
  return function (event: InputEvent, emit: boolean) {
    const value = component.$element[keyName]

    event.preventDefault()
    event.stopImmediatePropagation()

    const nextValue = processValue(value)

    if (emit) {
      component.set('value', nextValue)
    }

    component.dispatchEvent(event.type, nextValue)
  }
}

export class Field<
  E extends InputElement = any,
  P extends Dict<any> = Dict<any>,
> extends HTMLElement_<E, P> {
  constructor(
    $props: any,
    $system: any,
    $element: E,
    opt: {
      valueKey: string
      eventKey?: string
      emit?: boolean
      defaultStyle?: Style
      defaultValue?: any
      defaultAttr?: Dict<any>
      processValue?: (value: any) => any
      parseValue?: (value: string) => any
      propHandlers?: Dict<(value: any) => void>
      emitOnChange?: boolean
    }
  ) {
    const {
      valueKey,
      eventKey = valueKey,
      emit = true,
      defaultStyle,
      defaultAttr,
      defaultValue = '',
      processValue = (value) => value,
      parseValue = identity,
      propHandlers,
      emitOnChange = true,
    } = opt

    super($props, $system, $element, defaultStyle, defaultAttr, propHandlers)

    let { value = defaultValue } = $props

    this.$element[valueKey] = value

    const isInput =
      $element instanceof HTMLInputElement ||
      $element instanceof HTMLTextAreaElement ||
      $element instanceof HTMLSelectElement

    const inputEventHandler = makeFieldInputEventHandler(
      this,
      eventKey,
      processValue
    )

    this.$element.addEventListener('input', (event) =>
      inputEventHandler(event, emit)
    )
    this.$element.addEventListener('change', (event) =>
      inputEventHandler(event, emit && emitOnChange)
    )

    this.$propHandler = {
      ...this.$propHandler,
      ...(isInput
        ? inputPropHandler(
            this.$element as HTMLInputElement,
            valueKey,
            defaultValue,
            parseValue
          )
        : {
            value: (value: any | undefined) => {
              const value_ = parseValue(value)

              this.$element[valueKey] = value_ ?? ''
            },
          }),
    }
  }
}
