export function clearSelection(): void {
  const selection = window.getSelection()
  selection.removeAllRanges()
}
