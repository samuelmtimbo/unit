import { API } from '../../../../API'
import { isFrameRelativeValue } from '../../../../isFrameRelative'
import { BootOpt, System } from '../../../../system'
import { Style, Tag } from '../../../../system/platform/Style'
import { traverseTree, Tree } from '../../../../tree'
import { LayoutNode } from '../../../LayoutNode'
import { mergeAttr } from '../../../attr'
import {
  colorToHex,
  hexToRgba,
  RGBA,
  rgbaToHex,
  TRANSPARENT_RGBA,
} from '../../../color'
import { namespaceURI } from '../../../component/namespaceURI'
import { parseLayoutValue } from '../../../parseLayoutValue'
import {
  parseFrameRelativeUnit,
  parseRelativeUnit,
} from '../../../parseRelativeUnit'
import { parseTransform } from '../../../parseTransform'
import { applyStyle } from '../../../style'
import { parseFontSize } from '../../../util/style/getFontSize'
import { parseOpacity } from '../../../util/style/getOpacity'

export const LENGTH_STYLE_PROP_NAMES = [
  'width',
  'height',
  'maxWidth',
  'maxHeight',
  'fontSize',
]

export const isTextName = (tag: string) => {
  return ['text'].includes(tag)
}

export const isSVGName = (tag: string) => {
  return ['path', 'rect', 'circle', 'line', 'ellipse'].includes(tag)
}

const shouldExpandStyle = (style: Style) => {
  let {
    display: childDisplay = 'block',
    width: childWidthStr = 'auto',
    height: childHeightStr = 'auto',
  } = style

  const displayContents = childDisplay === 'contents'
  const fitWidth = childWidthStr === 'fit-content' || childWidthStr === 'auto'
  const fitHeight =
    childHeightStr === 'fit-content' || childHeightStr === 'auto'

  const shouldExpand = fitWidth || fitHeight || displayContents

  return shouldExpand
}

const maybeExpand = (
  parentTrait: LayoutNode,
  tag: Tag & { trait?: LayoutNode; element?: HTMLElement | SVGElement },
  path: number[],
  expandChild: (
    path: number[]
  ) => (Tag & { element?: HTMLElement | SVGElement })[]
) => {
  const shouldExpand = shouldExpandStyle(tag.style)

  if (shouldExpand) {
    expand(parentTrait, tag, path, expandChild)
  }
}

const expand = (
  parentTrait: LayoutNode,
  tag: Tag & { trait?: LayoutNode; element?: HTMLElement | SVGElement },
  path: number[],
  expandChild: (
    path: number[]
  ) => (Tag & { element?: HTMLElement | SVGElement })[]
) => {
  const childrenTags = expandChild(path)

  let i = 0

  for (const childTag of childrenTags) {
    const { container, element } = tagToElement(childTag, parentTrait, 'div')

    childTag.element = element

    tag.element.appendChild(container)

    maybeExpand(parentTrait, childTag, [...path, i], expandChild)

    i++
  }
}

const fitTreeChildren = (
  parentTrait: LayoutNode,
  parentNode: HTMLElement | SVGElement,
  tree: Tree<
    Tag & { trait?: LayoutNode; element?: HTMLElement | SVGElement }
  >[],
  path: number[],
  expandChild: (path: number[]) => Tag[]
) => {
  let i = 0

  for (const node of tree) {
    const childPath = [...path, i]

    const tag = node.value

    const parentTagName = parentNode.tagName.toLowerCase()

    const { container, element } = tagToElement(tag, parentTrait, parentTagName)

    node.value.element = element

    parentNode.appendChild(container)

    if (!node.children.length) {
      maybeExpand(parentTrait, tag, childPath, expandChild)
    }

    fitTreeChildren(parentTrait, element, node.children, childPath, expandChild)

    i++
  }
}

const tagToElement = (child: Tag, trait: LayoutNode, parentTagName: string) => {
  const { name, attr, style, textContent } = child

  let tag = name.replace('#', '').toLocaleLowerCase()

  const isText = isTextName(tag)
  const isSvg = isSVGName(tag)

  const tag_ = isText ? 'div' : tag

  let container: HTMLElement | SVGElement
  let element: HTMLElement | SVGElement

  if (isSvg || tag === 'svg') {
    element = window.document.createElementNS(namespaceURI, tag)

    if (isSvg && parentTagName !== 'svg') {
      const viewBox = attr['data-viewbox'] ?? '0 0 100 100'

      container = window.document.createElementNS(namespaceURI, 'svg')
      container.style.display = 'block'
      container.style.width = '100%'
      container.style.height = '100%'

      const parsedViewBox = viewBox.split(' ').map(Number.parseFloat)

      const strokeWidth =
        parseLayoutValue(
          style.strokeWidth ?? attr['stroke-width'] ?? '3px'
        )[0] + 3

      const newParsedViewBox = [
        parsedViewBox[0] + strokeWidth,
        parsedViewBox[1] + strokeWidth,
        parsedViewBox[2] - 2 * strokeWidth,
        parsedViewBox[3] - 2 * strokeWidth,
      ]

      const newViewBox = newParsedViewBox.join(' ')

      container.setAttribute('viewBox', newViewBox)

      container.appendChild(element)
    } else {
      container = element
    }
  } else {
    container = window.document.createElement(tag_)
    element = container
  }

  mergeAttr(element, attr)
  applyStyle(element, style)

  if (textContent) {
    container.textContent = textContent
  }

  if (isText) {
    container.style.display = 'inline'
  }

  const transformRelative = (name: string) => {
    return parseRelativeUnit(style[name], trait[name], trait[name])
  }

  for (const name of LENGTH_STYLE_PROP_NAMES) {
    let value = style[name]

    if (value !== undefined) {
      if (typeof value === 'number') {
        value = `${value}px`
      }

      if (isFrameRelativeValue(value)) {
        const length = transformRelative(name)

        container.style[name] = `${length}px`
      }
    }
  }

  return { element, container }
}

export function webLayout(window: Window, opt: BootOpt): API['layout'] {
  const layout = {
    reflectTreeTrait: function (
      system: System,
      parentTrait: LayoutNode,
      tree: Tree<Tag & { trait?: LayoutNode; element?: HTMLElement }>[],
      expandChild: (path: number[]) => Tag[]
    ): void {
      const parentNode = system.api.document.createElement('div')

      parentNode.style.position = 'absolute'
      parentNode.style.left = `${parentTrait.x}px`
      parentNode.style.top = `${parentTrait.y}px`
      parentNode.style.width = `${parentTrait.width}px`
      parentNode.style.height = `${parentTrait.height}px`
      parentNode.style.transform = ``
      parentNode.style.fontSize = `${parentTrait.fontSize}px`
      parentNode.style.visibility = 'hidden'
      parentNode.style.margin = '0'
      parentNode.style.color = rgbaToHex(parentTrait.color)

      fitTreeChildren(parentTrait, parentNode, tree, [], expandChild)

      system.foreground.layout.appendChild(parentNode)

      for (const root of tree) {
        traverseTree(root, null, (node, parent) => {
          const { name, attr, style, element } = node.value

          const computedStyle = window.getComputedStyle(element)
          const rect = element.getBoundingClientRect()

          let { x, y, width, height } = rect

          if (isSVGName(name) && parent && parent.value.name === 'svg') {
            const strokeWidth =
              parseLayoutValue(
                style.strokeWidth ?? attr['stroke-width'] ?? '3px'
              )[0] + 3

            x -= strokeWidth
            y -= strokeWidth
            width += 2 * strokeWidth
            height += 2 * strokeWidth
          }

          let {
            opacity: childOpacityStr = '1',
            transform: childTransform = '',
            fontSize: fontSizeStr = '',
          } = style

          const [
            childTransformX,
            childTransformY,
            childScaleX,
            childScaleY,
            childRotateX,
            childRotateY,
            childRotateZ,
          ] = parseTransform(
            childTransform,
            parentTrait.width,
            parentTrait.height
          )

          let childFontSizeStr = computedStyle.fontSize

          let fontSize =
            (childFontSizeStr &&
              parseFontSize(
                childFontSizeStr,
                parentTrait.width,
                parentTrait.height,
                parentTrait.fontSize
              )) ||
            parentTrait.fontSize

          let opacity = parseOpacity(childOpacityStr)

          opacity *= ((parent && parent.value.trait.opacity) || 1) ?? 1

          const fontSizeUnit =
            fontSizeStr?.match(/(px|em|rem|pt|vw|vh|%)$/)?.[1] ?? 'px'

          if (fontSizeUnit === 'vw') {
            fontSize = parseFrameRelativeUnit(fontSizeStr, parentTrait.width)
          }

          if (fontSizeUnit === 'vh') {
            fontSize = parseFrameRelativeUnit(fontSizeStr, parentTrait.height)
          }

          if (fontSizeUnit === 'em') {
            fontSize *= parentTrait.fontSize
          }

          const sx = parentTrait.sx * childScaleX
          const sy = parentTrait.sy * childScaleY

          let color: RGBA

          if (computedStyle.color) {
            const hex: string = colorToHex(computedStyle.color)

            color = (hex && hexToRgba(hex)) || parentTrait.color
          } else {
            color = parentTrait.color
          }

          let background: RGBA = TRANSPARENT_RGBA

          if (computedStyle.backgroundColor) {
            const hex: string = colorToHex(computedStyle.backgroundColor)

            background = (hex && hexToRgba(hex)) || TRANSPARENT_RGBA
          }

          node.value.trait = {
            x,
            y,
            width,
            height,
            opacity,
            fontSize,
            sx,
            sy,
            color,
            background,
          }
        })
      }

      system.foreground.layout.removeChild(parentNode)
    },
  }

  return layout
}
