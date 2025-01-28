import { System } from '../system'
import { PositionObserver } from '../types/global/PositionObserver'
import { Unlisten } from '../types/Unlisten'
import { last, remove } from '../util/array'
import { Component } from './component'
import { IOElement } from './IOElement'
import { Listenable } from './Listenable'
import { Theme } from './theme'

export interface Context extends Listenable {
  $system: System
  $mounted: boolean
  $disabled: boolean
  $parent: Context | null
  $element: HTMLElement
  $context: Context
  $x: number
  $y: number
  $sx: number
  $sy: number
  $rx: number
  $ry: number
  $rz: number
  $width: number
  $height: number
  $theme: Theme
  $color: string
  $children: Component[]
  $resizeObserver: ResizeObserver
  $positionObserver: PositionObserver
}

export function dispatchContextEvent(
  $context: Context,
  type: string,
  data: any = {}
): void {
  const { $element } = $context

  dispatchCustomEvent($element, type, data, false)
}

export function dispatchCustomEvent(
  $element: IOElement,
  type: string,
  detail: any = {},
  bubbles: boolean = true
) {
  $element.dispatchEvent(new CustomEvent(`_${type}`, { detail, bubbles }))
}

export function setParent($context: Context, $parent: Context | null): void {
  $context.$parent = $parent

  const { $children } = $context

  for (const component of $children) {
    // component.$parent = $parent
  }
}

export function mount($context: Context): void {
  $context.$mounted = true

  const { $element, $positionObserver, $resizeObserver } = $context

  const { width, height } = $element.getBoundingClientRect()

  $context.$width = width
  $context.$height = height

  const { x, y, sx, sy } = $positionObserver.observe($element)

  $context.$x = x
  $context.$y = y
  $context.$sx = sx
  $context.$sy = sy

  $resizeObserver.observe($element)

  for (const component of $context.$children) {
    component.mount($context)
  }
}

export function unmount($context: Context): void {
  $context.$mounted = false

  const { $element, $positionObserver, $resizeObserver } = $context

  $positionObserver.disconnect()

  $resizeObserver.unobserve($element)
  $resizeObserver.disconnect()

  for (const component of $context.$children) {
    component.unmount()
  }
}

export function resize($context: Context, width: number, height: number): void {
  $context.$width = width
  $context.$height = height

  dispatchContextEvent($context, 'resize', { width, height })
}

export function setTheme($context: Context, $theme: Theme): void {
  if ($context.$theme === $theme) {
    return
  }
  $context.$theme = $theme
  dispatchContextEvent($context, 'themechanged', {})
}

export function _setColor($context: Context, $color: string): void {
  if ($context.$color === $color) {
    return
  }
  $context.$color = $color
  $context.$element.style.color = $color
}

export function setColor($context: Context, $color: string): void {
  _setColor($context, $color)
  dispatchContextEvent($context, 'colorchanged', {})
}

export function appendChild(
  $context: Context,
  component: Component,
  { animate }: { animate?: boolean } = { animate: false }
): Unlisten {
  const { $element } = component

  $context.$element.appendChild($element)

  const base = component.getRootLeaves()

  for (const leaf of base) {
    $context.$element.appendChild(leaf.$element)
  }

  $context.$children.push(component)

  if ($context.$mounted) {
    component.mount($context)
  }

  return () => {
    if ($context.$mounted) {
      component.unmount()
    }

    const base = component.getRootLeaves()

    for (const leaf of base) {
      $context.$element.removeChild(leaf.$element)
    }

    remove($context.$children, component)

    return component
  }
}

export function enableContext($context: Context): void {
  // console.log('enableContext')
  $context.$disabled = false
  dispatchContextEvent($context, 'enabled', {})
}

export function disableContext($context: Context): void {
  // console.log('disableContext')
  $context.$disabled = true
  dispatchContextEvent($context, 'disabled', {})
}

export function focusContext($context: Context): void {
  // console.log('focusContext')
  const { $children } = $context
  if ($children.length > 0) {
    const component = last($children)
    component.focus()
  }
}

export function blurContext($context: Context): void {
  $context.$element.blur()
}
