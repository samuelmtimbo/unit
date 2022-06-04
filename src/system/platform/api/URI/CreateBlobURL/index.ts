import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { B } from '../../../../../types/interface/B'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  blob: B
}

export interface O<T> {
  url: string
}

export default class CreateObjectURI<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['blob'],
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
      pod
    )
  }

  async f({ blob }: I<T>, done: Done<O<T>>): Promise<void> {
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
