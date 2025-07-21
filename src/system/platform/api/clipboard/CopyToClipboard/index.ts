import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { ID_COPY_TO_CLIPBOARD } from '../../../../_ids'

export interface I<T> {
  text: string
}

export interface O<T> {}

export default class CopyToClipboard<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['text'],
        o: [],
      },
      {},
      system,
      ID_COPY_TO_CLIPBOARD
    )
  }

  async f({ text }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    const {
      api: {
        clipboard: { writeText },
      },
    } = this.__system

    try {
      await writeText(text)
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
