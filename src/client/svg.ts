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
    DEFAULT_STYLE: Dict<any>
  ) {
    super($props, $system)

    const { style, attr = {} } = this.$props

    this.$element = $element

    if (attr) {
      applyAttr(this.$element, attr)
    }

    applyDynamicStyle(this, this.$element, { ...DEFAULT_STYLE, ...style })

    this.$propHandler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
    }
  }

  onPropChanged<K extends keyof P>(prop: any, current: any): void {
    this.$propHandler[prop as string](current)
  }
}
