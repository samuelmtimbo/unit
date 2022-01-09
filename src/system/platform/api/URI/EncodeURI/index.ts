import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  uri: string
}

export interface O<T> {
  'UTF-8': string
}

export default class EncodeURI<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['uri'],
        o: ['UTF-8'],
      },
      {},
      system,
      pod
    )
  }

  f({ uri }: I<T>, done: Done<O<T>>): void {
    const {
      method: { encodeURI },
    } = this.__system

    if (!encodeURI) {
      done(undefined, 'Encode URI API not supported')
      return
    }

    const encoded = encodeURI(uri)

    done({ 'UTF-8': encoded })
  }
}
