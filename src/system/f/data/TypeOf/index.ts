import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'

export type I = {
  a: any
}

export type O = {
  type: string
}

export default class TypeOf extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['type'],
      },
      config
    )
  }

  f({ a }: I, done: Done<O>): void {
    const t = typeof a
    switch (t) {
      case 'number':
        return done({ type: 'number' })
      case 'boolean':
        return done({ type: 'boolean' })
      case 'function':
        return done({ type: 'function' })
      case 'object':
        if (a === null) {
          return done({ type: 'null' })
        } else {
          if (a instanceof Unit) {
            return done({ type: 'unit' })
          }
          if (Array.isArray(a)) {
            return done({ type: 'array' })
          }
          return done({ type: 'object' })
        }
      case 'string':
        return done({ type: 'string' })
      case 'symbol':
        return done({ type: 'symbol' })
      case 'undefined':
        return done({ type: 'undefined' })
      default:
        return done({ type: 'undefined' })
    }
  }
}
