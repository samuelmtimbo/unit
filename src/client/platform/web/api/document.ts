import { API } from '../../../../API'
import { MethodNotImplementedError } from '../../../../exception/MethodNotImplementedError'
import { BootOpt } from '../../../../system'
import { PositionObserver_ } from '../../../PositionObserver'
import { NoopIntersectionObserver } from '../../../noop/IntersectionObserver'
import { NoopMutationObserver } from '../../../noop/MutationObserver'
import { NoopResizeObserver } from '../../../noop/ResizeObserver'

export function webDocument(
  window: Window,
  root: HTMLElement,
  opt: BootOpt
): API['document'] {
  const { document } = window

  // @ts-ignore
  const MutationObserver = window.MutationObserver || NoopMutationObserver

  // @ts-ignore
  const ResizeObserver = window.ResizeObserver || NoopResizeObserver

  const IntersectionObserver =
    // @ts-ignore
    window.IntersectionObserver || NoopIntersectionObserver

  const _document: API['document'] = {
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
    canSelectShadowDom: function (): boolean {
      // @ts-ignore
      return !!root.shadowRoot.getSelection
    },
    getSelection(): Selection {
      // @ts-ignore
      if (root.shadowRoot.getSelection) {
        // @ts-ignore
        return root.shadowRoot.getSelection()
      }

      return document.getSelection()
    },
    createRange(): Range {
      return document.createRange()
    },
    exitPictureInPicture(): Promise<void> {
      return document.exitPictureInPicture()
    },
    MutationObserver: MutationObserver,
    ResizeObserver: ResizeObserver,
    PositionObserver: PositionObserver_,
    IntersectionObserver: IntersectionObserver,
    pictureInPictureElement: document.pictureInPictureElement,
    addEventListener: function <K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void {
      return document.addEventListener(type, listener, options)
    },
    removeEventListener: function <K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void {
      return document.removeEventListener(type, listener, options)
    },
    exitFullscreen: function (): Promise<void> {
      throw new MethodNotImplementedError()
    },
    get visibilityState() {
      return document.visibilityState
    },
    get fullscreenElement() {
      return document.fullscreenElement
    },
    get documentElement() {
      return document.documentElement
    },
  }

  return _document
}
