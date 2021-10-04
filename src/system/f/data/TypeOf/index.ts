import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { SISO } from '../../../../SISO'

export default class TypeOf extends SISO<any, string> {
  constructor(config?: Config) {
    super(
      {
        input: 'a',
        output: 'type',
      },
      config
    )
  }

  s(a: any): string {
    const t = typeof a
    switch (t) {
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'function':
        return 'function'
      case 'object':
        if (a === null) {
          return 'null'
        } else {
          if (a instanceof Unit) {
            return 'unit'
          }
          if (Array.isArray(a)) {
            return 'array'
          }
          return 'object'
        }
      case 'string':
        return 'string'
      case 'symbol':
        return 'symbol'
      case 'undefined':
        return 'undefined'
      default:
        return 'undefined'
    }
  }
}
