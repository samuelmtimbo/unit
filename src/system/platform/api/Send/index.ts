import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { CH } from '../../../../interface/CH'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

interface I<T> {
  unit: CH
  data: any
}

interface O<T> {}

export default class Send<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
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
