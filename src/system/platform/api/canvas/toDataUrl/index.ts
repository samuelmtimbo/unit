import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID_TO_DATA_URL } from '../../../../_ids'

export interface I<T> {
  canvas: CA
  quality: number
  type: string
  done: any
}

export interface O<T> {
  url: string
}

export default class ToImageUrl<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['canvas', 'quality', 'type'],
        fo: ['url'],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
        output: {
          url: {},
        },
      },
      system,
      ID_TO_DATA_URL
    )
  }

  async f({ canvas, quality, type }: I<T>, done: Done<O<T>>): Promise<void> {
    let _url: string

    try {
      _url = await canvas.toDataUrl(type, quality)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({
      url: _url,
    })
  }
}
