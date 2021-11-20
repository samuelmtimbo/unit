import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  uri: string
}

export interface O<T> {
  'UTF-8': string
}

export default class EncodeURI<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['uri'],
        o: ['UTF-8'],
      },
      config
    )
  }

  f({ uri }: I<T>, done: Done<O<T>>): void {
    if (!this.$system) {
      // BOT('screenshot')
      const error = new Error('not attached to a system')
      throw error
    }

    const {
      method: { encodeURI },
    } = this.$system

    if (!encodeURI) {
      done(undefined, 'Encode URI API not supported')
      return
    }

    const encoded = encodeURI(uri)

    done({ 'UTF-8': encoded })
  }
}
