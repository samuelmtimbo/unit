import { Point } from './util/geometry'

export type Zoom = { k: number; x: number; y: number }

export const zoomIdentity: Zoom = { k: 1, x: 0, y: 0 }

export const zoomTransformCenteredAt = (
  x: number,
  y: number,
  k: number,
  width: number,
  height: number
) => {
  return { k, x: x - width / 2 / k, y: y - height / 2 / k }
}

export const getTransform = (zoom: Zoom): string => {
  return `scale(${zoom.k}) translate(${-zoom.x}px, ${-zoom.y}px)`
}

export const zoomTransformCentered = (
  k: number,
  width: number,
  height: number
) => {
  return zoomTransformCenteredAt(width / 2, height / 2, k, width, height)
}

export const translate = (zoom: Zoom, x: number, y: number): Zoom => {
  return { k: zoom.k, x: zoom.x - x / zoom.k, y: zoom.y - y / zoom.k }
}

export const scale = (zoom: Zoom, k: number): Zoom => {
  return { k, x: zoom.x * k, y: zoom.y * k }
}

export const zoomInvert = (
  zoom: Zoom,
  x: number,
  y: number
): [number, number] => {
  return [(x - zoom.x) / zoom.k, (y - zoom.y) / zoom.k]
}

export const zoomInvertX = (zoom: Zoom, x: number): number => {
  return (x - zoom.x) / zoom.k
}

export const zoomInvertY = (zoom: Zoom, y: number): number => {
  return (y - zoom.y) / zoom.k
}

export const zoomApply = (zoom: Zoom, { x, y }: Point): Point => {
  return { x: zoomApplyX(zoom, x), y: zoomApplyY(zoom, y) }
}

export const zoomApplyX = (zoom: Zoom, x: number): number => {
  return x * zoom.k + zoom.x
}

export const zoomApplyY = (zoom: Zoom, y: number): number => {
  return y * zoom.k + zoom.y
}
