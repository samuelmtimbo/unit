import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webSelection(window: Window, opt: BootOpt): API['selection'] {
  const containsSelection = (element) => {
    const selection = window.getSelection()

    if (selection) {
      const { anchorNode } = selection

      return element.contains(anchorNode)
    }
  }

  const removeSelection = () => {
    const selection = window.getSelection()

    selection.removeAllRanges()
  }

  const selection = {
    containsSelection,
    removeSelection,
  }

  return selection
}
