import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  text: string
}

export interface O<T> {}

export default class TextToClipboard<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['text'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  async f({ text }: I<T>, done: Done<O<T>>): Promise<void> {
    const {
      api: {
        clipboard: { writeText },
      },
    } = this.__system

    try {
      await writeText(text)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({})
  }
}
