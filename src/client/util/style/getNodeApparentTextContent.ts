import { isTextField } from '../../isTextField'

export const getNodeApparentTextContent = (node: Node) => {
  if (node instanceof HTMLElement) {
    if (isTextField(node)) {
      return (node as HTMLTextAreaElement).value
    }
  }

  return node.textContent
}
