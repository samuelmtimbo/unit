import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  attr?: Dict<string>
  width?: number | string
  height?: number | string
  stroke?: string
  strokeWidth?: number
  preserveAspectRatio?: string
  viewBox?: string
  title?: string
  tabIndex?: number
}

export default class SVGSVG extends SVGElement_<SVGSVGElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'svg'),
      $system.style['svg']
    )

    const {
      className,
      stroke = 'currentColor',
      strokeWidth = 0,
      viewBox,
      preserveAspectRatio = 'none',
      title,
      tabIndex = -1,
    } = $props

    if (className !== undefined) {
      this.$element.classList.value = className
    }
    if (viewBox) {
      this.$element.setAttribute('viewBox', viewBox)
    }
    if (preserveAspectRatio) {
      this.$element.setAttribute('preserveAspectRatio', preserveAspectRatio)
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
    if (stroke !== undefined) {
      this.$element.setAttribute('stroke', `${stroke}`)
    }
    if (strokeWidth !== undefined) {
      this.$element.setAttribute('stroke-width', `${strokeWidth}`)
    }
    if (title) {
      const title_el = this.$system.api.document.createElementNS(
        namespaceURI,
        'title'
      )
      title_el.innerHTML = title
      this.$element.appendChild(title_el)
    }

    this.$element.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    this.$propHandler = {
      ...this.$propHandler,
      viewBox: (viewBox: string | undefined) => {
        if (viewBox === undefined) {
          this.$element.removeAttribute('viewBox')
        } else {
          this.$element.setAttribute('viewBox', viewBox)
        }
      },
      width: (width: number | undefined) => {
        if (width === undefined) {
          this.$element.removeAttribute('width')
        } else {
          this.$element.setAttribute('width', `${width}`)
        }
      },
      height: (height: number | undefined) => {
        if (height === undefined) {
          this.$element.removeAttribute('height')
        } else {
          this.$element.setAttribute('height', `${height}`)
        }
      },
      strokeWidth: (strokeWidth: number | undefined) => {
        if (strokeWidth === undefined) {
          this.$element.removeAttribute('stroke-width')
        } else {
          this.$element.setAttribute('stroke-width', `${strokeWidth}`)
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this.$propHandler[prop](current)
  }
}
