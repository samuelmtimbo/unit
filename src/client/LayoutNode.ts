import { RGBA } from './color'

export type LayoutNode = {
  x: number
  y: number
  width: number
  height: number
  sx: number
  sy: number
  opacity: number
  fontSize: number
  color: RGBA
  background: RGBA
}
