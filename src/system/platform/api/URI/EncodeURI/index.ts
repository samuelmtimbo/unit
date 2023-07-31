import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_ENCODE_URI } from '../../../../_ids'

export interface I<T> {
  uri: string
}

export interface O<T> {
  'UTF-8': string
}

export default class EncodeURI<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['uri'],
        o: ['UTF-8'],
      },
      {},
      system,
      ID_ENCODE_URI
    )
  }

  f({ uri }: I<T>, done: Done<O<T>>): void {
    const {
      api: {
        uri: { encodeURI },
      },
    } = this.__system

    let encoded

    try {
      encoded = encodeURI(uri)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ 'UTF-8': encoded })
  }
}
