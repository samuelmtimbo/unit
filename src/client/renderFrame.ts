import { System } from '../system'
import { _removeChildren } from '../util/element'
import { Component } from './component'
import { Context, Fullwindow, resize, setParent } from './context'
import { stopAllPropagation, stopByPropagation } from './stopPropagation'
import { defaultThemeColor } from './theme'

export function renderFrame(
  $system: System,
  $parent: Component | null,
  $root: HTMLElement,
  $init: Partial<Context> = {}
): Context {
  const {
    api: {
      document: { ResizeObserver, PositionObserver },
    },
  } = $system

  _removeChildren($root)

  const $element = $root

  stopAllPropagation($element)

  const $fullwindow: Fullwindow[] = []

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
    ({ x, y, sx, sy, rx, ry, rz }): void => {
      $context.$x = x
      $context.$y = y
      $context.$sx = sx
      $context.$sy = sy
      $context.$rx = rx
      $context.$ry = ry
      $context.$rz = rz
    }
  )

  const $context: Context = {
    $system,
    $mounted: false,
    $disabled: false,
    $listenCount: {},
    $parent: null,
    $parent_unlisten: null,
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
    $fullwindow,
    $theme,
    $color,
    $fullwindow_i: -1,
    get $context() {
      return $context
    },
    $resizeObserver,
    $positionObserver,
    $listener: [],
    $unlisten: [],
    ...$init,
  }

  setParent($context, $parent)

  $system.context.push($context)

  for (const type of $system.customEvent) {
    const _type = `_${type}`
    stopByPropagation($element, _type)
  }

  return $context
}
