import { System } from '../system'
import { Dict } from '../types/Dict'
import { applyAttr } from './attr'
import { Element } from './element'
import { Handler, htmlPropHandler } from './propHandler'
import { applyDynamicStyle } from './style'

export default class HTMLElement_<
  T extends HTMLElement,
  P extends Dict<any>,
> extends Element<T, P> {
  protected $propHandler: Record<string, Handler>
  protected $defaultStyle: Dict<any>

  constructor(
    $props: P,
    $system: System,
    $element: T,
    $defaultStyle: Dict<any>,
    $defaultAttr: Dict<any> = {},
    $propHandlers: Dict<(value: any) => void> = {}
  ) {
    super({ ...$props, style: { ...$defaultStyle, ...$props.style } }, $system)

    const { className, style, attr } = this.$props

    this.$element = $element
    this.$defaultStyle = $defaultStyle

    if (className) {
      this.$element.className = className
    }

    applyAttr(this.$element, { ...$defaultAttr, ...attr }, {})
    applyDynamicStyle(this, this.$element, { ...$defaultStyle, ...style })

    this.$propHandler = {
      ...htmlPropHandler(this, this.$element, $defaultStyle, $defaultAttr),
      ...$propHandlers,
    }
  }

  onPropChanged(prop: any, current: any, prev: any) {
    this.$propHandler[prop](current, prev)
  }
}
