import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { B } from '../../../../types/interface/B'
import { CH } from '../../../../types/interface/CH'
import { ID_TRANSFER } from '../../../_ids'

interface I<T> {
  unit: CH
  data: B
}

interface O<T> {}

export default class Transfer<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'data'],
        o: [],
      },
      {
        input: {
          unit: {
            ref: true,
          },
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_TRANSFER
    )
  }

  async f({ unit, data }: I<T>, done: Done<O<T>>) {
    try {
      await unit.send(data)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
