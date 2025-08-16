import { isTextField } from '../../isTextField'

export const setNodeApparentTextContent = (node: Node, textContent: string) => {
  if (node instanceof HTMLElement) {
    if (isTextField(node)) {
      ;(node as HTMLTextAreaElement).value = textContent

      return
    }
  }

  return node.textContent
}
