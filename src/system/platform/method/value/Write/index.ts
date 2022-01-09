import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { V } from '../../../../../interface/V'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  value: V
  data: T
}

export interface O<T> {
  data: any
}

export default class Write<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      },
      system,
      pod
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
