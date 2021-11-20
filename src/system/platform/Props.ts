import { Dict } from '../../types/Dict'

export type Style = Dict<string>

export interface _Props {
  className?: string
  style?: Style
  draggable?: boolean
}
