import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
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
  done: any
}

export default class ToDataUrl<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['canvas', 'quality', 'type'],
        fo: ['url'],
        i: [],
        o: ['done'],
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
    let url: string

    try {
      url = await canvas.toDataUrl(type, quality)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({
      url,
    })
  }

  b() {
    this._output.done.push(true)
  }
}
