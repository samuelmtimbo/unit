import { API } from '../../../../API'
import { BootOpt } from '../../../../system'
import { Style } from '../../../../system/platform/Props'
import { LayoutNode } from '../../../LayoutNode'
import { parseTransform } from '../../../parseTransform'
import { applyStyle } from '../../../style'
import { parseFontSize } from '../../../util/style/getFontSize'
import { parseOpacity } from '../../../util/style/getOpacity'

const fitChildren = (
  window: Window,
  parentTrait: LayoutNode,
  parentNode: HTMLElement,
  children: Style[],
  path: number[],
  childrenFontSize: number[],
  childrenOpacity: number[],
  childrenSx: number[],
  childrenSy: number[],
  expandChild: (path: number[]) => Style[]
) => {
  let i = 0

  for (const childStyle of children) {
    const childNode = window.document.createElement('div')

    let {
      display: childDisplay = 'block',
      width: childWidthStr = '',
      height: childHeightStr = '',
      'font-size': childFontSizeStr,
      opacity: childOpacityStr = '1',
      transform: childTransform = '',
    } = childStyle

    const [
      childTransformX,
      childTransformY,
      childScaleX,
      childScaleY,
      childRotateX,
      childRotateY,
      childRotateZ,
    ] = parseTransform(childTransform, parentTrait.width, parentTrait.height)

    const childOpacity = parseOpacity(childOpacityStr)

    let fontSize =
      (childFontSizeStr && parseFontSize(childFontSizeStr)) ||
      parentTrait.fontSize

    const fontSizeUnit = childFontSizeStr?.match(/(px|em|rem|pt|vw|vh|%)$/)?.[1]

    if (fontSizeUnit === 'vw') {
      fontSize *= parentTrait.width / 100
    }

    if (fontSizeUnit === 'vh') {
      fontSize *= parentTrait.height / 100
    }

    const sx = parentTrait.sx * childScaleX
    const sy = parentTrait.sy * childScaleY

    const displayContents = childDisplay === 'contents'
    const fitWidth = childWidthStr === 'fit-content'
    const fitHeight =
      childHeightStr === 'fit-content' || childHeightStr === 'auto'

    if (fitWidth || fitHeight || displayContents) {
      const childPath = [...path, i]

      const childChildrenStyle = expandChild(childPath)

      fitChildren(
        window,
        { ...parentTrait, fontSize },
        childNode,
        childChildrenStyle,
        childPath,
        [],
        [],
        [],
        [],
        expandChild
      )
    }

    childrenFontSize.push(fontSize)
    childrenOpacity.push(childOpacity)
    childrenSx.push(sx)
    childrenSy.push(sy)

    applyStyle(childNode, childStyle)

    parentNode.appendChild(childNode)

    i++
  }
}

export function webLayout(window: Window, opt: BootOpt): API['layout'] {
  const animation: API['layout'] = {
    reflectChildrenTrait: function (
      parentTrait: LayoutNode,
      parentStyle: Style,
      childrenStyle: Style[],
      path: number[] = [],
      expandChild: (path: number[]) => Style[]
    ): LayoutNode[] {
      const parentNode = window.document.createElement('div')

      applyStyle(parentNode, parentStyle)

      parentNode.style.position = 'absolute'
      parentNode.style.left = `${parentTrait.x}px`
      parentNode.style.top = `${parentTrait.y}px`
      parentNode.style.width = `${parentTrait.width}px`
      parentNode.style.height = `${parentTrait.height}px`
      // parentNode.style.transform = `scale(${parentTrait.sx}, ${parentTrait.sy})`
      parentNode.style.transform = ``
      parentNode.style.fontSize = `${parentTrait.fontSize}px`
      parentNode.style.opacity = 'hidden'

      const childrenFontSize: number[] = []
      const childrenOpacity: number[] = []
      const childrenSx: number[] = []
      const childrenSy: number[] = []

      fitChildren(
        window,
        parentTrait,
        parentNode,
        childrenStyle,
        path,
        childrenFontSize,
        childrenOpacity,
        childrenSx,
        childrenSy,
        expandChild
      )

      window.document.body.appendChild(parentNode)

      const childrenTrait: LayoutNode[] = []

      for (let i = 0; i < childrenStyle.length; i++) {
        const childStyle = childrenStyle[i]
        const childFontSize = childrenFontSize[i]
        const childOpacity = childrenOpacity[i]
        const childSx = childrenSx[i]
        const childSy = childrenSy[i]

        const childNode = parentNode.children.item(i) as HTMLElement

        const rect = childNode.getBoundingClientRect()

        let x = rect.x
        let y = rect.y

        const childTrait: LayoutNode = {
          x,
          y,
          width: rect.width,
          height: rect.height,
          opacity: childOpacity,
          fontSize: childFontSize,
          sx: childSx,
          sy: childSy,
        }

        childrenTrait.push(childTrait)
      }

      window.document.body.removeChild(parentNode)

      return childrenTrait
    },
  }

  return animation
}
