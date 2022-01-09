import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { J } from '../../../../../interface/J'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  obj: J
  key: string
}

export interface O<T> {
  has: boolean
}

export default class HasKey<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['obj', 'key'],
        o: ['data'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ obj, key }: I<T>, done: Done<O<T>>) {
    try {
      const has = await obj.hasKey(key)
      done({ has })
    } catch (err) {
      done(undefined, err)
    }
  }
}
