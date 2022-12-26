import { IOElement } from '../../IOElement'
import { parseTransformXY } from '../../parseTransformXY'

export type Scale = {
  sx: number
  sy: number
}

export function getScale(element: IOElement): Scale {
  if (element instanceof HTMLElement) {
    const { transform } = element.style

    const { offsetWidth, offsetHeight } = element

    const [
      _transform_x,
      _transform_y,
      sx,
      sy,
      _rotate_x,
      _rotate_y,
      _rotate_z,
    ] = parseTransformXY(transform, offsetWidth, offsetHeight)

    return { sx, sy }
  } else {
    // TODO
    return { sx: 1, sy: 1 }
  }
}
