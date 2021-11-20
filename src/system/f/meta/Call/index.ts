import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  unit: Unit
  method: string
  data: T
}

export interface O<T> {
  data: T
}

export interface R<T> {}

export default class Call<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['unit', 'method', 'data'],
        o: ['data'],
      },
      config,
      {
        input: {
          unit: {
            ref: true,
          },
        },
      }
    )
  }

  f({ unit, method, data }: I<T>, done: Done<O<T>>) {
    const $method = `$${method}`
    unit[$method].call(unit, data, (data, err) => {
      done({ data }, err)
    })
  }
}
