import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_APPEND } from '../../../../_ids'

export interface I<T> {
  'a[]': A
  a: T
}

export interface O<T> {}

export default class Push<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a[]', 'a'],
        o: [],
      },
      {
        input: {
          'a[]': {
            ref: true,
          },
        },
      },
      system,
      ID_APPEND
    )
  }

  async f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): Promise<void> {
    await _a.append(a)

    done({})
  }
}
