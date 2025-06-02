import { System } from '../system'
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
    super({ ...$props, style: { ...$defaultStyle, ...$props.style } }, $system)

    const { style, attr } = this.$props

    this.$element = $element

    applyAttr(this.$element, { ...$defaultAttr, ...attr }, {})
    applyDynamicStyle(this, this.$element, { ...$defaultStyle, ...style })

    this.$propHandler = {
      ...svgPropHandler(this, this.$element, $defaultStyle, {}),
      ...$propHandlers,
    }
  }

  onPropChanged(prop: any, current: any, prev): void {
    this.$propHandler[prop](current, prev)
  }
}
