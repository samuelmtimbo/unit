import * as assert from '../util/assert'

export type IStyleMargin = {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

export function parseMargin(margin: string): IStyleMargin {
  // TODO
  const [top = '0px', right = top, bottom = top, left = right] =
    margin.split(' ')

  return {
    left: left || '0px',
    top: top || '0px',
    right: right || '0px',
    bottom: bottom || '0px',
  }
}

assert.deepEqual(parseMargin(''), {
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
})

assert.deepEqual(parseMargin('1px'), {
  top: '1px',
  right: '1px',
  bottom: '1px',
  left: '1px',
})

assert.deepEqual(parseMargin('1px 2px'), {
  top: '1px',
  right: '2px',
  bottom: '1px',
  left: '2px',
})
