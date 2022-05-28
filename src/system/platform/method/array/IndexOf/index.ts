import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { A } from '../../../../../types/interface/A'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  'a[]': A
  a: T
}

export interface O<T> {
  i: number
}

export default class IndexOf<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a[]', 'a'],
        o: ['i'],
      },
      {
        input: {
          'a[]': {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): Promise<void> {
    const i = await _a.indexOf(a)
    done({
      i,
    })
  }
}
