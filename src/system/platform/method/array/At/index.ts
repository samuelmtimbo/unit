import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { A } from '../../../../../interface/A'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  'a[]': A
  i: number
}

export interface O<T> {
  'a[i]': T
}

export default class At<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a[]', 'i'],
        o: ['a[i]'],
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

  async f({ 'a[]': _a, i }: I<T>, done: Done<O<T>>): Promise<void> {
    const l = await _a.length()
    if (i >= 0 && i < l) {
      const _a_i = await _a.at(i)
      done({ 'a[i]': _a_i })
    } else {
      done(undefined, 'index out of boundary')
    }
  }
}
