import { isFrameRelativeValue } from '../isFrameRelative'
import { Style } from '../system/platform/Props'
import { getPathBoundingBox } from '../util/svg'
import { Component } from './component'
import { DEFAULT_FONT_SIZE } from './DEFAULT_FONT_SIZE'
import { extractTrait } from './extractTrait'
import { IOElement } from './IOElement'
import { LayoutNode } from './LayoutNode'
import { rawExtractStyle } from './rawExtractStyle'
import { expandSlot } from './reflectComponentBaseTrait'
import { rectsBoundingRect } from './util/geometry'
import { Size } from './util/geometry/types'
import { parseFontSize } from './util/style/getFontSize'

export function measureChildren(
  root: Component,
  component: Component,
  style: Style,
  fallbackTrait: LayoutNode,
  measureText: (text: string, fontSize: number) => Size,
  fitContent: boolean,
  getLeafStyle: (
    parent_trait: LayoutNode,
    leaf_path: string[],
    leaf_comp: Component
  ) => Style = (parent_trait, leaf_path, leaf_comp) =>
    extractStyle(root, leaf_comp, parent_trait, measureText, fitContent)
) {
  const { $system } = component

  const {
    api: {
      layout: { reflectChildrenTrait },
    },
  } = $system

  const parentChildren = component.$parentChildren

  const base = parentChildren.reduce((acc, child) => {
    const childBase = child.getRootBase()

    let child_path: string[] = []
    let c: Component = child
    let p = child.$parent

    while (p) {
      let z = component

      let drop = false

      while (z) {
        if (c.getSubComponentId(component.$parent)) {
          drop = true

          break
        }

        z = z.$parent
      }

      if (drop) {
        break
      }

      const subComponentId = p.getSubComponentId(c)

      child_path.unshift(subComponentId)

      c = p

      p = p.$parent
    }

    return [
      ...acc,
      ...childBase.map(([leaf_path, leaf_comp]) => [
        [...child_path, ...leaf_path],
        leaf_comp,
      ]),
    ]
  }, [])

  const base_style = base.map(([leaf_path, leaf_comp]) => {
    return getLeafStyle(fallbackTrait, leaf_path, leaf_comp)
  })

  const relative_base_style = base_style.filter(({ position }) => {
    return position !== 'fixed' && position !== 'absolute'
  }, [])

  const fitWidth = style['width'] === 'fit-content'
  const fitHeight = style['height'] === 'fit-content'

  const trait = extractTrait(component, measureText)

  if (fitWidth) {
    trait.width = fallbackTrait.width
  }
  if (fitHeight) {
    trait.height = fallbackTrait.height
  }

  const reflected_children_trait = reflectChildrenTrait(
    trait,
    style,
    relative_base_style,
    [],
    (path) => {
      return expandSlot(root, component, '', path, {}, (leaf_id, leaf_comp) => {
        return getLeafStyle(fallbackTrait, leaf_id.split('/'), leaf_comp)
      })
    }
  )

  const size = rectsBoundingRect(reflected_children_trait)

  return size
}

export function extractStyle(
  root: Component,
  component: Component,
  fallbackTrait: LayoutNode,
  measureText: (text: string, fontSize: number) => Size,
  fitContent: boolean = false,
  getLeafStyle: (
    parent_trait: LayoutNode,
    leaf_path: string[],
    leaf_comp: Component
  ) => Style = (parent_trait, leaf_path, leaf_comp) =>
    extractStyle(root, leaf_comp, parent_trait, measureText, fitContent)
): Style {
  const { $node } = component

  return _extractStyle(
    root,
    component,
    $node,
    fallbackTrait,
    measureText,
    fitContent,
    getLeafStyle
  )
}

export function _extractStyle(
  root: Component,
  component: Component,
  element: IOElement,
  fallbackTrait: LayoutNode,
  measureText: (text: string, fontSize: number) => Size,
  fitContent: boolean = false,
  getLeafStyle: (
    parent_trait: LayoutNode,
    leaf_path: string[],
    leaf_comp: Component
  ) => Style = (parent_trait, leaf_path, leaf_comp) =>
    extractStyle(root, leaf_comp, parent_trait, measureText, fitContent)
): Style {
  const style = rawExtractStyle(element)

  const fitWidth = style['width'] === 'fit-content'
  const fitHeight = style['height'] === 'fit-content'

  if (element instanceof Text) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

    const { width, height } = measureText(textContent, fontSize)

    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  if (
    element instanceof HTMLDivElement &&
    element.getAttribute('contenteditable') === 'true' &&
    (fitWidth || fitHeight)
  ) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

    const { width, height } = measureText(textContent, fontSize)

    if (fitWidth) {
      style['width'] = `${width}px`
    }

    if (fitHeight) {
      style['height'] = `${height}px`
    }
  }

  if (style['display'] === 'contents') {
    return {
      width: '100%',
      height: '100%',
    }
  }

  if (element instanceof HTMLCanvasElement) {
    const treatProp = (name: 'width' | 'height') => {
      const prop = component.getProp(name)

      if (prop !== undefined) {
        if (typeof prop === 'string') {
          if (isFrameRelativeValue(prop)) {
            const prop_num = prop.substring(0, prop.length - 2)

            style[name] = `${prop_num}%`
          } else {
            // TODO
          }
        } else {
          style[name] = `${prop}px`
        }
      } else {
        style[name] = `${element[name]}px`
      }
    }

    treatProp('width')
    treatProp('height')
  }

  if (element instanceof HTMLInputElement) {
    if (
      element.type === 'text' ||
      element.type === 'number' ||
      element.type === 'password'
    ) {
      if (style.height === 'fit-content') {
        const { value } = element

        const fontSize = element.style.fontSize

        const fontSizeNum = parseFontSize(fontSize) ?? DEFAULT_FONT_SIZE

        const { height } = measureText(value, fontSizeNum)

        style.height = `${height}px`
      }
    }

    if (element.type === 'range') {
      style.height = '18px'
    }
  } else if (element instanceof HTMLSelectElement) {
    style.height = '18px'
  }

  if (element instanceof SVGPathElement) {
    const d = element.getAttribute('d')

    const bb = getPathBoundingBox(d)

    style['width'] = `${bb.width}px`
    style['height'] = `${bb.height}px`

    // TODO
  }

  if (element instanceof SVGRectElement) {
    style['width'] = `${element.width.animVal.value}px`
    style['height'] = `${element.height.animVal.value}px`

    // TODO
  }

  if (element instanceof SVGCircleElement) {
    const r = element.r.animVal.value

    const width = 2 * r
    const height = width

    style['width'] = `${width}px`
    style['height'] = `${height}px`

    // TODO
  }

  if (fitContent) {
    if (fitWidth || fitHeight) {
      const { width, height } = measureChildren(
        root,
        component,
        style,
        fallbackTrait,
        measureText,
        fitContent,
        getLeafStyle
      )

      if (fitWidth) {
        style['width'] = `${width}px`
      }

      if (fitHeight) {
        style['height'] = `${height}px`
      }
    }
  }

  return style
}
