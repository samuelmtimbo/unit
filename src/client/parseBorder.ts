export type IBorder = {
  width?: string
  style?: string
  color?: string
}

export function parseBorder(border: string): IBorder {
  // TODO
  const [width = '0px', style = 'solid', color = 'currentColor'] =
    border.split(' ')

  return {
    width: width || '0px',
    style,
    color,
  }
}
