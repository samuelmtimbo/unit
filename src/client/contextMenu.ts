import { Component } from './component'

export function preventContextMenu(
  component: Component<HTMLElement | SVGElement>
) {
  component.$element.oncontextmenu = function () {
    return false
  }
}
