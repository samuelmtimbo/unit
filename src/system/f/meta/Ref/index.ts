import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { staticfy } from '../../../../spec/staticfy'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { J } from '../../../../types/interface/J'
import { V } from '../../../../types/interface/V'
import { Unlisten } from '../../../../types/Unlisten'
import { ID_REF } from '../../../_ids'

export interface I<T extends Dict<any>, K extends keyof T> {
  obj: J<T>
  key: K
}

export interface O<T extends Dict<any>, K extends keyof T> {
  value: T[K]
}

export default class Ref<T, K extends keyof T> extends Functional<
  I<T, K>,
  O<T, K>
> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key'],
        o: ['value'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
        output: {
          value: {
            ref: true,
          },
        },
      },
      system,
      ID_REF
    )
  }

  private _unlisten: Unlisten

  async f({ obj, key }: I<T, K>, done): Promise<void> {
    let _value

    try {
      _value = await obj.get(key)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    this._unlisten = obj.subscribe([], key, (type, key, data) => {
      if (type === 'delete') {
        this.err('key value not found')

        this._forward_empty('value')
      }
    })

    const value = new (class _Value extends $ implements V {
      async read(): Promise<any> {
        _value = await obj.get(key)
        const v = staticfy(_value)
        return v
      }

      async write(data: any): Promise<void> {
        return obj.set(key, data)
      }
    })(this.__system)

    done({ value })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }
  }
}
