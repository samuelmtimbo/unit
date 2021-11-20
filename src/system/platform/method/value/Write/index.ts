import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { V } from '../../../../../interface/V'

export interface I<T> {
  value: V
  data: T
}

export interface O<T> {
  data: any
}

export default class Write<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super(
      {
        i: ['value', 'data'],
        o: ['data'],
      },
      {
        input: {
          value: {
            ref: true,
          },
        },
      }
    )
  }

  async f({ value, data }: I<T>, done: Done<O<T>>) {
    try {
      await value.write(data)
      done({ data })
    } catch (err) {
      done(undefined, err)
    }
  }
}
