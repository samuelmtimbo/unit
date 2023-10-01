import { Component } from './component'
import { LayoutNode } from './LayoutNode'
import { Size } from './util/geometry/types'
import { getPosition, getRelativePosition } from './util/style/getPosition'
import { getSize } from './util/style/getSize'

export const extractTrait = (
  leaf_comp: Component,
  measureText: (text: string, fontSize: number) => Size
): LayoutNode => {
  const leaf_context = leaf_comp.$context

  let { $node } = leaf_comp

  if ($node instanceof HTMLElement || $node instanceof SVGElement) {
    let { width, height } = getSize($node)

    const { x, y } = getPosition($node)
    const { sx, sy } = leaf_comp.getScale()
    const fontSize: number = leaf_comp.getFontSize()
    const opacity: number = leaf_comp.getOpacity()

    width /= Math.abs(sx)
    height /= Math.abs(sy)

    return { x, y, width, height, sx, sy, opacity, fontSize }
  } else if ($node instanceof Text) {
    const fontSize = leaf_comp.getFontSize()

    let x: number
    let y: number
    let width: number
    let height: number
    let sx: number = 1
    let sy: number = 1
    let opacity: number = 1

    ;({ width = width, height = height } = getSize($node))

    const position = getRelativePosition($node, leaf_context.$element)

    let parent_trait: LayoutNode

    if (leaf_comp.$parent) {
      parent_trait = extractTrait(leaf_comp.$parent, measureText)
    } else {
      parent_trait = {
        x: leaf_context.$x + 2,
        y: leaf_context.$y + 2,
        width: leaf_context.$width,
        height: leaf_context.$height,
        sx: 1, // TODO
        sy: 1, // TODO
        opacity: 1,
        fontSize,
      }
    }

    x = position.x
    y = position.y

    return {
      x,
      y,
      width,
      height,
      sx,
      sy,
      opacity,
      fontSize,
    }
  }
}
