import { API, BootOpt } from '../../../../system'
import { MutationObserver_ } from '../../../MutationObserver_'
import { PositionObserver } from '../../../PositionObserver'
import { ResizeObserver_ } from '../../../ResizeObserver_'

export function webDocument(
  window: Window,
  root: HTMLElement,
  opt: BootOpt
): API['document'] {
  const { document } = window

  // @ts-ignore
  const MutationObserver = window.MutationObserver || MutationObserver_

  // @ts-ignore
  const ResizeObserver = window.ResizeObserver || ResizeObserver_

  const _document = {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K
    ): HTMLElementTagNameMap[K] {
      return document.createElement(tagName)
    },
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: 'http://www.w3.org/2000/svg',
      qualifiedName: K
    ): SVGElementTagNameMap[K] {
      return document.createElementNS(namespaceURI, qualifiedName)
    },
    createTextNode(text: string): Text {
      return document.createTextNode(text)
    },
    elementFromPoint(x: number, y: number): Element {
      return root.shadowRoot.elementFromPoint(x, y)
    },
    elementsFromPoint(x: number, y: number): Element[] {
      return root.shadowRoot.elementsFromPoint(x, y)
    },
    MutationObserver: MutationObserver,
    ResizeObserver: ResizeObserver,
    PositionObserver: PositionObserver,
  }

  return _document
}
