import HTMLElement_ from '../../../../../client/html'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  style?: Dict<string>
  src?: string
}

export default class Image_ extends HTMLElement_<HTMLImageElement, Props> {
  constructor($props: Props, $system: System, $element?: HTMLImageElement) {
    super(
      $props,
      $system,
      $system.api.document.createElement('img'),
      $system.style['image'],
      {},
      {
        src: (url: string | undefined) => {
          this.$element.src = url ?? ''
        },
      }
    )

    const { src } = this.$props

    if (src !== undefined) {
      this.$element.src = src
    }
  }
}
