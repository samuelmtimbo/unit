import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { ID_DOWNLOAD_TEXT } from '../../../../../_ids'

export type I = {
  text: string
  name: string
  mimetype: string
  charset: string
}

export type O = {}

export default class DownloadText extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['text', 'name', 'mimetype', 'charset'],
        o: [],
      },
      {},
      system,
      ID_DOWNLOAD_TEXT
    )
  }

  async f(
    { text: text, name, mimetype, charset }: I,
    done: Done<O>
  ): Promise<void> {
    const {
      api: {
        file: { downloadText },
      },
    } = this.__system

    try {
      await downloadText({ text, name, mimetype, charset })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({})
  }
}
