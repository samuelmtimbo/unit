import namespaceURI from '../../component/namespaceURI'

export const makeRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  const sub_rectangle = document.createElementNS(namespaceURI, 'rect')

  sub_rectangle.setAttribute('strokeWidth', `${6}px`)
  sub_rectangle.setAttribute('stroke', `${color}`)
  sub_rectangle.setAttribute('fill', 'none')
  sub_rectangle.setAttribute('x', `${x}px`)
  sub_rectangle.setAttribute('y', `${y}px`)
  sub_rectangle.setAttribute('width', `${width}px`)
  sub_rectangle.setAttribute('height', `${height}px`)

  return sub_rectangle
}
