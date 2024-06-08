import { Size } from './client/util/geometry/types'

export type MeasureTextFunction = (
  text: string,
  fontSize: number,
  maxWidth: number
) => Size
