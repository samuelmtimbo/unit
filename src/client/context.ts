import { System } from '../system'
import { Dict } from '../types/Dict'
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
  $listenCount: Dict<number>
  $disabled: boolean
  $parent: Component | null
  $parent_unlisten: Unlisten | null
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

export interface Ref extends Dict<any[]> {}

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

export function setParent($context: Context, $parent: Component | null): void {
  $context.$parent = $parent

  const { $children } = $context

  for (const component of $children) {
    component.$parent = $parent
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
  // console.log('unmount')
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
  // console.log('resize', width, height)

  $context.$width = width
  $context.$height = height

  dispatchContextEvent($context, 'resize', { width, height })
}

export function setWidth($context: Context, width: number): void {
  // console.log('setWidth', width)
  const { $height } = $context
  resize($context, width, $height)
}

export function setHeight($context: Context, height: number): void {
  // console.log('setHeight', height)
  const { $width } = $context
  resize($context, $width, height)
}

export function setTheme($context: Context, $theme: Theme): void {
  if ($context.$theme === $theme) {
    return
  }
  $context.$theme = $theme
  // if ($theme === 'light') {
  //   $context.$element.style.filter = 'auto'
  // } else {
  //   $context.$element.style.filter = 'invert'
  // }
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
  $context.$children.push(component)

  // the component share $parent
  component.$parent = $context.$parent

  if ($context.$mounted) {
    component.mount($context)
  }

  return () => {
    const { $element } = component

    if ($context.$mounted) {
      component.unmount()
    }

    $context.$element.removeChild($element)

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
