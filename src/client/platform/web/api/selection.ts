import { API } from '../../../../system'

export function webSelection(window: Window, prefix: string): API['selection'] {
  const containsSelection = (element) => {
    const selection = window.getSelection()

    if (selection) {
      const { anchorNode } = selection

      return element.contains(anchorNode)
    }
  }

  const removeSelection = () => {
    console.log('removeSelection')
    const selection = window.getSelection()

    selection.removeAllRanges()
  }

  const selection = {
    containsSelection,
    removeSelection,
  }

  return selection
}
