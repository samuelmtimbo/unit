import Iframe from '../system/platform/component/Iframe/Component'
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

  let { $element } = leaf_comp

  if (leaf_comp instanceof Iframe) {
    $element = leaf_comp._iframe_el
  }

  // const leaf_context_position = {
  //   x: leaf_context.$x,
  //   y: leaf_context.$y,
  // }

  if ($element instanceof HTMLElement || $element instanceof SVGElement) {
    // const relative_position = getRelativePosition(
    //   $element,
    //   leaf_context.$element
    // )

    // let { x, y } = addVector(leaf_context_position, relative_position)

    let { width, height } = getSize($element)

    const { x, y } = getPosition($element)
    const { sx, sy } = leaf_comp.getScale()
    const fontSize: number = leaf_comp.getFontSize()
    const opacity: number = leaf_comp.getOpacity()

    width /= Math.abs(sx)
    height /= Math.abs(sy)

    return { x, y, width, height, sx, sy, opacity, fontSize }
  } else if ($element instanceof Text) {
    const fontSize = leaf_comp.getFontSize()

    let x: number
    let y: number
    let width: number
    let height: number
    let sx: number = 1
    let sy: number = 1
    let opacity: number = 1

    ;({ width = width, height = height } = getSize($element))

    const position = getRelativePosition($element, leaf_context.$element)

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
