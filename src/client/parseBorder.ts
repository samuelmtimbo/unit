import * as assert from '../util/assert'

export type IBorder = {
  width?: string
  style?: string
  color?: string
}

export function parseBorder(border: string): IBorder {
  // TODO
  const [width = '0px', style = 'solid', color = 'currentColor'] = border.split(' ')

  return {
    width: width || '0px',
    style,
    color,
  }
}


assert.deepEqual(parseBorder(''), {
  width: '0px',
  style: 'solid',
  color: 'currentColor',
})

assert.deepEqual(parseBorder('1px'), {
  width: '1px',
  style: 'solid',
  color: 'currentColor',
})

assert.deepEqual(parseBorder('1px solid white'), {
  width: '1px',
  style: 'solid',
  color: 'white',
})
