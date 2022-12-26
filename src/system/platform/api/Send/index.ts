import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { CH } from '../../../../types/interface/CH'
import { ID_SEND } from '../../../_ids'

interface I<T> {
  unit: CH
  data: any
}

interface O<T> {}

export default class Send<T> extends Functional<I<T>, O<T>> {
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
        },
      },
      system,
      ID_SEND
    )
  }

  async f({ unit, data }: I<T>, done: Done<O<T>>) {
    try {
      await unit.send(data)
    } catch (err) {
      done(undefined, err.message)
      return
    }
    done({})
  }
}
