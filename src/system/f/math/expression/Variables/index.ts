import { default as evaluatex } from 'evaluatex/dist/evaluatex'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  exp: string
}

export interface O<T> {
  names: string[]
}

export default class Variables<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['exp'],
        o: ['names'],
      },
      config
    )
  }

  f({ exp }: I<T>, done: Done<O<T>>): void {
    const fn = evaluatex(exp, {}, { latex: true })
    const set = {}
    const names = fn.tokens
      .reduce((acc: string[], token: any) => {
        if (token.type === 'SYMBOL' && !set[token.value]) {
          set[token.value] = true
          acc.push(token.value)
        }
        return acc
      }, [])
      .sort()
    done({ names })
  }
}
