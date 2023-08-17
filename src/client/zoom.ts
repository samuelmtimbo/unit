import { Point } from './util/geometry/types'

export type Zoom = { x: number; y: number; z: number }

export const zoomIdentity: Zoom = { z: 1, x: 0, y: 0 }

export const zoomTransformCenteredAt = (
  x: number,
  y: number,
  z: number,
  width: number,
  height: number
): Zoom => {
  return { z, x: x - width / 2 / z, y: y - height / 2 / z }
}

export const getTransform = (zoom: Zoom): string => {
  return `scale(${zoom.z}) translate(${-zoom.x}px, ${-zoom.y}px)`
}

export const zoomTransformCentered = (
  z: number,
  width: number,
  height: number
) => {
  return zoomTransformCenteredAt(width / 2, height / 2, z, width, height)
}

export const translate = (zoom: Zoom, x: number, y: number): Zoom => {
  return { z: zoom.z, x: zoom.x - x / zoom.z, y: zoom.y - y / zoom.z }
}

export const scale = (zoom: Zoom, z: number): Zoom => {
  return { z: z, x: zoom.x * z, y: zoom.y * z }
}

export const zoomInvert = (
  zoom: Zoom,
  x: number,
  y: number
): [number, number] => {
  return [(x - zoom.x) / zoom.z, (y - zoom.y) / zoom.z]
}

export const zoomInvertX = (zoom: Zoom, x: number): number => {
  return (x - zoom.x) / zoom.z
}

export const zoomInvertY = (zoom: Zoom, y: number): number => {
  return (y - zoom.y) / zoom.z
}

export const zoomApply = (zoom: Zoom, { x, y }: Point): Point => {
  return { x: zoomApplyX(zoom, x), y: zoomApplyY(zoom, y) }
}

export const zoomApplyX = (zoom: Zoom, x: number): number => {
  return x * zoom.z + zoom.x
}

export const zoomApplyY = (zoom: Zoom, y: number): number => {
  return y * zoom.z + zoom.y
}
