import { System } from '../system'
import { removeChildren } from '../util/element'
import { Context, resize } from './context'
import { stopByPropagation } from './stopPropagation'
import { defaultThemeColor } from './theme'

export function renderFrame(
  $system: System,
  $parent: Context | null,
  $root: HTMLElement,
  $init: Partial<Context> = {}
): Context {
  const {
    api: {
      document: { ResizeObserver, PositionObserver },
    },
  } = $system

  removeChildren($root)

  const $element = $root

  const $theme = 'dark'

  const $color = defaultThemeColor($theme)

  $element.style.color = $color

  const $resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]

    const { width, height } = entry.contentRect

    resize($context, width, height)
  })

  const $positionObserver = new PositionObserver(
    $system,
    (x, y, sx, sy, rx, ry, rz): void => {
      $context.$x = x
      $context.$y = y
      $context.$sx = sx
      $context.$sy = sy
      $context.$rx = rx
      $context.$ry = ry
      $context.$rz = rz
    }
  )

  const $children = []

  const $context: Context = {
    $system,
    $mounted: false,
    $disabled: false,
    $parent,
    $width: 0,
    $height: 0,
    $x: 0,
    $y: 0,
    $sx: 1,
    $sy: 1,
    $rx: 0,
    $ry: 0,
    $rz: 0,
    $element,
    $theme,
    $color,
    $children,
    get $context() {
      return $context
    },
    $resizeObserver,
    $positionObserver,
    ...$init,
  }

  $system.context.push($context)

  for (const type of $system.customEvent) {
    const _type = `_${type}`
    stopByPropagation($element, _type)
  }

  return $context
}
