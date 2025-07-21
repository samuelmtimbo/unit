import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { ID_CREATE_OBJECT_URL } from '../../../../_ids'

export interface I<T> {
  blob: B
  init: {}
}

export interface O<T> {
  url: string
  done: any
}

export default class CreateObjectURI<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['blob', 'init'],
        fo: ['url'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          blob: {
            ref: true,
          },
        },
      },
      system,
      ID_CREATE_OBJECT_URL
    )
  }

  async f({ blob, init }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    const {
      api: {
        url: { createObjectURL },
      },
    } = this.__system

    let url: string

    const _blob = await blob.blob()

    try {
      url = await createObjectURL(_blob)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ url })
  }

  b() {
    this._output.done.push(true)
  }
}
