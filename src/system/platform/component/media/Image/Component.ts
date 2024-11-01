import { Element } from '../../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
}

export default class Image_ extends Element<HTMLImageElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System, $element?: HTMLImageElement) {
    super($props, $system)

    const { className, style = {}, src } = this.$props

    const DEFAULT_STYLE = this.$system.style['image']

    $element = $element ?? this.$system.api.document.createElement('img')

    if (className) {
      $element.className = className
    }
    if (src !== undefined) {
      $element.src = src
    }

    this.$element = $element

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...htmlPropHandler(this, $element, DEFAULT_STYLE),
      src: (url: string | undefined) => {
        $element.src = url ?? ''
      },
    }
  }

  onPropChanged<K extends keyof Props>(prop: K, current: any): void {
    this._prop_handler[prop](current)
  }
}
