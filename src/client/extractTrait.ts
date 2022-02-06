import { LayoutNode } from '../system/platform/component/app/Graph/Component'
import { Component } from './component'
import { addVector, Size } from './util/geometry'
import { getPosition } from './util/style/getPosition'
import { getSize } from './util/style/getSize'

export const extractTrait = (
  leaf_comp: Component,
  measureText: (text: string, fontSize: number) => Size
): LayoutNode => {
  const leaf_context = leaf_comp.$context

  const leaf_context_position = { x: leaf_context.$x, y: leaf_context.$y }

  if (
    leaf_comp.$element instanceof HTMLElement ||
    leaf_comp.$element instanceof SVGElement
  ) {
    const relative_position = getPosition(
      leaf_comp.$element,
      leaf_context.$element
    )

    const position = addVector(leaf_context_position, relative_position)
    const size = getSize(leaf_comp.$element)

    const fontSize: number = leaf_comp.getFontSize()
    const opacity: number = leaf_comp.getOpacity()

    let x: number = position.x
    let y: number = position.y

    let width: number = size.width
    let height: number = size.height

    return { x, y, width, height, k: 1, opacity, fontSize }
  } else if (leaf_comp.$element instanceof Text) {
    const fontSize = leaf_comp.getFontSize()

    const { textContent } = leaf_comp.$element

    let x: number
    let y: number
    // let width: number
    // let height: number
    let k: number = 1
    let opacity: number = 1

    const { width, height } = measureText(textContent, fontSize)

    const position = getPosition(leaf_comp.$element, leaf_context.$element)

    let parent_trait: LayoutNode

    if (leaf_comp.$parent) {
      parent_trait = extractTrait(leaf_comp.$parent, measureText)
    } else {
      parent_trait = {
        x: leaf_context.$x + 2,
        y: leaf_context.$y + 2,
        width: leaf_context.$width,
        height: leaf_context.$height,
        k: 1,
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
      k,
      opacity,
      fontSize,
    }
  }
}
