import { MeasureTextFunction } from '../text'
import { hexToRgba, RGBA } from './color'
import { Component } from './component'
import { LayoutNode } from './LayoutNode'
import { getPosition, getRelativePosition } from './util/style/getPosition'
import { getSize } from './util/style/getSize'

export const extractTrait = (
  leafComp: Component,
  measureText: MeasureTextFunction
): LayoutNode => {
  const leaf_context = leafComp.$context

  let { $node } = leafComp

  if ($node instanceof HTMLElement || $node instanceof SVGElement) {
    let { width, height } = getSize($node)

    const { x, y } = getPosition($node)
    const { sx, sy } = leafComp.getScale()

    const fontSize: number = leafComp.getFontSize()
    const opacity: number = leafComp.getOpacity()
    const color: RGBA = leafComp.getColor()

    width /= Math.abs(sx)
    height /= Math.abs(sy)

    return { x, y, width, height, sx, sy, opacity, fontSize, color }
  } else if ($node instanceof Text) {
    const fontSize = leafComp.getFontSize()

    let x: number
    let y: number
    let width: number
    let height: number
    let sx: number = 1
    let sy: number = 1
    let opacity: number = 1
    let color: RGBA
    ;({ width = width, height = height } = getSize($node))

    let parentTrait: LayoutNode

    if (leafComp.$parent) {
      parentTrait = extractTrait(leafComp.$parent, measureText)

      color = leafComp.getColor()
    } else {
      const { $color } = leafComp.$context

      color = hexToRgba($color)
    }

    const position = getRelativePosition($node, leaf_context.$element)

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
    }
  }
}
