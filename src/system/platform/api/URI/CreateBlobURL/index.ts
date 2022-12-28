import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { ID_CREATE_BLOB_URL } from '../../../../_ids'

export interface I<T> {
  blob: B
  init: {}
}

export interface O<T> {
  url: string
}

export default class CreateObjectURI<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['blob', 'init'],
        o: ['url'],
      },
      {
        input: {
          blob: {
            ref: true,
          },
        },
      },
      system,
      ID_CREATE_BLOB_URL
    )
  }

  async f({ blob, init }: I<T>, done: Done<O<T>>): Promise<void> {
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
      done(undefined, err.message)

      return
    }

    done({ url })
  }
}
