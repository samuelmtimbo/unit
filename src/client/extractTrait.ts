import { System } from '../system'
import { MeasureTextFunction } from '../text'
import { hexToRgba, RGBA, TRANSPARENT_RGBA } from './color'
import { Component } from './component'
import { LayoutNode } from './LayoutNode'
import { getPosition, getRelativePosition } from './util/style/getPosition'
import { getSize } from './util/style/getSize'

export const extractTrait = (
  system: System,
  component: Component,
  measureText: MeasureTextFunction
): LayoutNode => {
  const leafContext = component.$context

  let { $node } = component

  if (component.$wrapElement && component.$wrapElement.isConnected) {
    $node = component.$wrapElement
  }

  if ($node instanceof HTMLElement || $node instanceof SVGElement) {
    let { width, height } = getSize(system, $node)

    const { x, y } = getPosition($node)
    const { sx, sy } = component.getScale()

    const fontSize: number = component.getFontSize()
    const opacity: number = component.getOpacity()
    const color: RGBA = component.getColor()
    const background: RGBA = component.getBackgroundColor()

    width /= Math.abs(sx)
    height /= Math.abs(sy)

    return { x, y, width, height, sx, sy, opacity, fontSize, color, background }
  } else if ($node instanceof Text) {
    const fontSize = component.getFontSize()

    let x: number
    let y: number
    let width: number
    let height: number
    let sx: number = 1
    let sy: number = 1
    let opacity: number = 1
    let color: RGBA
    let background: RGBA
    ;({ width, height } = getSize(system, $node))

    let parentTrait: LayoutNode

    if (component.$domParent && component.$domParent.$mounted) {
      parentTrait = extractTrait(system, component.$domParent, measureText)

      color = component.getColor()
    } else if (component.$mounted) {
      const { $color } = component.$context

      color = hexToRgba($color)
    }

    background = TRANSPARENT_RGBA

    const position = getRelativePosition(system, $node, leafContext.$element)

    x = position.x
    y = position.y

    color = parentTrait.color

    return {
      x,
      y,
      width,
      height,
      sx,
      sy,
      opacity,
      fontSize,
      color,
      background,
    }
  }
}
