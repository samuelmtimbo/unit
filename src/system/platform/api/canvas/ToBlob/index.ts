import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { B } from '../../../../../types/interface/B'
import { CA } from '../../../../../types/interface/CA'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  canvas: CA
  quality: number
  type: string
}

export interface O<T> {
  blob: B
}

export default class ToBlob<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['canvas', 'quality', 'type'],
        o: ['blob'],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ canvas, quality, type }: I<T>, done: Done<O<T>>): Promise<void> {
    let _blob: Blob

    try {
      _blob = await canvas.toBlob(type, quality)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const blob = new (class _Blob extends $ implements B {
      __: string[] = ['ST']

      async blob(): Promise<Blob> {
        console.log('_Blob', 'read', _blob)
        return _blob
      }
    })(this.__system, this.__pod)

    done({
      blob,
    })
  }
}
