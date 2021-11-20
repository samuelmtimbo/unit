import ResizeObserver from 'resize-observer-polyfill'

export default function resizeWith($element: Element, $with: Element): void {
  const { width, height } = $with.getBoundingClientRect()

  $element.setAttribute('width', `${width}`)
  $element.setAttribute('height', `${height}`)

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      $element.setAttribute('width', `${width}`)
      $element.setAttribute('height', `${height}`)
    }
  })

  resizeObserver.observe($with)
}
