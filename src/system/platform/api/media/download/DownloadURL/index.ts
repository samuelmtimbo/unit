import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { ID_DOWNLOAD_URL } from '../../../../../_ids'

export type I = {
  url: string
  name: string
}

export type O = {}

export default class DownloadURL extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['url', 'name'],
        o: [],
      },
      {},
      system,
      ID_DOWNLOAD_URL
    )
  }

  async f({ url, name }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        file: { downloadURL },
      },
    } = this.__system

    try {
      await downloadURL({ url, name })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({})
  }
}
