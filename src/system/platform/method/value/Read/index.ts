import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { V } from '../../../../../interface/V'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  value: V
  any: string
}

export interface O<T> {
  data: T
}

export default class Read<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['value', 'any'],
        o: ['data'],
      },
      {
        input: {
          value: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ value, any }: I<T>, done: Done<O<T>>) {
    try {
      const data = await value.read()
      done({ data })
    } catch (err) {
      done(undefined, err)
    }
  }
}
