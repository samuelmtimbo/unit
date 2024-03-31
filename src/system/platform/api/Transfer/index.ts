import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { W } from '../../../../types/interface/W'
import { ID_TRANSFER } from '../../../_ids'

interface I<T> {
  window: W
  opt: {}
  data: $
}

interface O<T> {}

export default class Transfer<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['window', 'opt', 'data'],
        o: [],
      },
      {
        input: {
          window: {
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

  async f({ window, data }: I<T>, done: Done<O<T>>) {
    try {
      let transferable: any

      try {
        transferable = await data.raw()
      } catch (err) {
        done(undefined, err.message)

        return
      }

      window.postMessage(transferable, '*', [transferable])
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
