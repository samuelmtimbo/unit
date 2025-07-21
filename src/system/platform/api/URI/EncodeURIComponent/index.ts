import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { ID_ENCODE_URI_COMPONENT } from '../../../../_ids'

export interface I<T> {
  text: string
}

export interface O<T> {
  uri: string
}

export default class EncodeURIComponent<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['text'],
        o: ['uri'],
      },
      {},
      system,
      ID_ENCODE_URI_COMPONENT
    )
  }

  f({ text }: I<T>, done: Done<O<T>>, fail: Fail): void {
    const {
      api: {
        uri: { encodeURIComponent },
      },
    } = this.__system

    let uri

    try {
      uri = encodeURIComponent(text)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ uri })
  }
}
