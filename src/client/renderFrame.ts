import ResizeObserver from 'resize-observer-polyfill'
import { _removeChildren } from '../util/element'
import { Component } from './component'
import { Context, Fullwindow, resize, setParent } from './context'
import { PositionObserver } from './PositionObserver'
import { stopAllPropagation } from './stopPropagation'
import { defaultThemeColor } from './theme'

export function renderFrame(
  $parent: Component | null,
  $root: HTMLElement,
  $init: Partial<Context> = {}
): Context {
  _removeChildren($root)

  const $element = $root

  stopAllPropagation($element)

  const $fullwindow: Fullwindow[] = []

  const $theme = 'dark'

  const $color = defaultThemeColor($theme)

  $element.style.color = $color

  const $resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      resize($context, width, height)
      // if ($context.$width !== width || $context.$height !== height) {
      // } else {
      //   console.log('Good old first resize!')
      // }
    }
  })

  const $positionObserver = new PositionObserver(
    (x: number, y: number, sx: number, sy: number): void => {
      // console.log('x', x, 'y', y, 'sx', sx, 'sy', sy)
      $context.$x = x
      $context.$y = y
      $context.$sx = sx
      $context.$sy = sy
    }
  )

  const $context: Context = {
    $system: null,
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

  return $context
}
