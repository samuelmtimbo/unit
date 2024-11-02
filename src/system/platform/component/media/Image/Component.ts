import HTMLElement_ from '../../../../../client/html'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
}

export default class Image_ extends HTMLElement_<HTMLImageElement, Props> {
  constructor($props: Props, $system: System, $element?: HTMLImageElement) {
    super(
      $props,
      $system,
      $system.api.document.createElement('img'),
      $system.style['image']
    )

    const { className, src } = this.$props

    if (className) {
      this.$element.className = className
    }
    if (src !== undefined) {
      this.$element.src = src
    }

    this.$propHandler = {
      ...this.$propHandler,
      src: (url: string | undefined) => {
        this.$element.src = url ?? ''
      },
    }
  }
}
