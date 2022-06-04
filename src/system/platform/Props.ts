import { Dict } from '../../types/Dict'

export type Style = Dict<string>
// export type Style = ElementCSSInlineStyle

export interface _Props {
  className?: string
  style?: Style
  draggable?: boolean
}
