import { System } from '../system'
import { keys } from '../system/f/object/Keys/f'
import { Dict } from '../types/Dict'
import { applyAttr } from './attr'
import { Element } from './element'
import { Handler, svgPropHandler } from './propHandler'
import { applyDynamicStyle } from './style'

export class SVGElement_<
  T extends SVGElement = any,
  P extends Dict<any> = Dict<any>,
> extends Element<T, P> {
  protected $propHandler: Record<string, Handler>

  constructor(
    $props: P,
    $system: System,
    $element: T,
    $defaultStyle: Dict<any>,
    $defaultAttr: Dict<any> = {},
    $propHandlers: Dict<(value: any) => void>
  ) {
    super($props, $system)

    const { style, attr } = this.$props

    this.$element = $element

    const $controlled = new Set([...keys($propHandlers), 'style'])

    applyAttr(this.$element, { ...$defaultAttr, ...attr }, {}, $controlled)
    applyDynamicStyle(this, this.$element, { ...$defaultStyle, ...style })

    this.$propHandler = {
      ...svgPropHandler(this, this.$element, $defaultStyle, {}, $controlled),
      ...$propHandlers,
    }
  }

  onPropChanged<K extends keyof P>(prop: any, current: any): void {
    this.$propHandler[prop as string](current)
  }
}
