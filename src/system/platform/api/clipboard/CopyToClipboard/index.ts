import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { textToClipboard } from '../../../../../client/util/web/clipboard'

export interface I<T> {
  text: any
}

export interface O<T> {}

export default class CopyToClipboard<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['text'],
        o: [],
      },
      config
    )
  }

  f({ text }: I<T>, done: Done<O<T>>): void {
    textToClipboard(text, (err) => {
      done({}, err)
    })
  }
}
