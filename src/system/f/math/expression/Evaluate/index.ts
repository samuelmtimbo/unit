import { default as evaluatex } from 'evaluatex/dist/evaluatex'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  exp: string
  obj: { [name: string]: number }
}

export interface O<T> {
  value: number
}

export default class Evaluate<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['exp', 'obj'],
        o: ['value'],
      },
      config
    )
  }

  f({ exp, obj }: I<T>, done: Done<O<T>>): void {
    let value = NaN
    try {
      const fn = evaluatex(exp, {}, { latex: true })
      value = fn(obj)
    } catch {
      done(undefined, 'invalid expression and/or object')
      return
    }
    if (isNaN(value)) {
      done(undefined, 'cannot evaluate')
    } else {
      done({ value })
    }
  }
}
