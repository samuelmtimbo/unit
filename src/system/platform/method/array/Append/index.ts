import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { A } from '../../../../../interface/A'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  'a[]': A
  a: T
}

export interface O<T> {}

export default class Append<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a[]', 'a'],
        o: [],
      },
      {
        input: {
          arr: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): Promise<void> {
    await _a.append(a)
    done({})
  }
}
