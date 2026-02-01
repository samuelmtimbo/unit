import { System } from '../../system'
import { namespaceURI } from '../component/namespaceURI'
import { getElementSize } from '../getSize'
import { IOElement } from '../IOElement'
import { PositionObserver_ } from '../PositionObserver'

const STROKE_WIDTH: number = 2

export function attachFocus(system: System): void {
  const {
    root,
    foreground: { svg },
    api: {
      document: { createElementNS, ResizeObserver, PositionObserver },
    },
  } = system

  let following = null

  const outline = createElementNS(namespaceURI, 'rect')

  outline.style.display = 'block'
  outline.style.strokeWidth = `${STROKE_WIDTH}px`
  outline.style.stroke = 'cyan'
  outline.style.fill = 'none'
  outline.style.opacity = '0.5'
  outline.style.zIndex = '1'
  outline.style.pointerEvents = 'none'

  svg.appendChild(outline)

  const translate = (x: number, y: number): void => {
    outline.setAttribute('x', `${x}`)
    outline.setAttribute('y', `${y}`)
  }

  const resize = (width: number, height: number): void => {
    outline.setAttribute('width', `${width}`)
    outline.setAttribute('height', `${height}`)

    const dasharray = `${width / 4} ${width / 2} ${width / 4 + 0.01} 0 ${
      height / 4
    } ${height / 2} ${height / 4} 0`

    outline.style.strokeDasharray = dasharray
  }

  const show = () => {
    outline.style.opacity = '0.5'
  }

  const hide = () => {
    outline.style.opacity = '0'
  }

  let _x = 0
  let _y = 0
  let _sx = 1
  let _sy = 1
  let _width = 0
  let _height = 0

  let _scaled_width = 0
  let _scaled_height = 0

  const resize_callback = (entries: ResizeObserverEntry[]): void => {
    const entry = entries[0]

    const { borderBoxSize } = entry

    const { inlineSize: width, blockSize: height } = borderBoxSize[0]

    if (width === 0 || height === 0) {
      return
    }

    _width = width
    _height = height

    _scaled_width = _width
    _scaled_height = _height

    update()
  }

  const position_callback = (
    x: number,
    y: number,
    sx: number,
    sy: number,
    rx: number,
    ry: number,
    rz: number,
    px: number,
    py: number
  ): void => {
    _x = x + px
    _y = y + py
    _sx = sx
    _sy = sy

    _scaled_width = _width * _sx
    _scaled_height = _height * _sy

    update()
  }

  const update = () => {
    translate(_x, _y)
    resize(_scaled_width, _scaled_height)
  }

  const resize_observer: ResizeObserver = new ResizeObserver(resize_callback)
  const position_observer: PositionObserver_ = new PositionObserver(
    system,
    position_callback
  )

  const follow = (target: IOElement) => {
    const is_html = target instanceof HTMLElement

    if (following) {
      if (is_html) {
        position_observer.disconnect()
        resize_observer.unobserve(following)
        resize_observer.disconnect()
      } else {
        throw new Error('not HTML')
      }
    }

    const { width, height } = getElementSize(this.$system, target)

    _width = width / _sx
    _height = height / _sy

    _scaled_width = width
    _scaled_height = height

    if (is_html) {
      const { x, y, sx, sy } = position_observer.observe(target)

      resize_observer.observe(target)

      _x = x
      _y = y
      _sx = sx
      _sy = sy
    } else {
      throw new Error('not HTML')
    }

    update()

    following = target
  }

  root.addEventListener(
    'focus',
    (event: FocusEvent) => {
      const { target } = event

      if (
        target instanceof HTMLElement ||
        target instanceof Text ||
        target instanceof SVGElement
      ) {
        follow(target)

        show()
      } else {
        throw new Error('what is this `EventTarget`?')
      }
    },
    { capture: true, passive: true }
  )

  root.addEventListener(
    'blur',
    (event: FocusEvent) => {
      const { relatedTarget } = event

      if (relatedTarget) {
        if (
          relatedTarget instanceof HTMLElement ||
          relatedTarget instanceof Text ||
          relatedTarget instanceof SVGElement
        ) {
          follow(relatedTarget)
        } else {
          throw new Error('what is this `EventTarget`?')
        }
      } else {
        hide()
      }
    },
    { capture: true, passive: true }
  )

  // follow(root)
}
