import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_AT_1 } from '../../../../_ids'

export interface I<T> {
  a: A
  i: number
  done: any
}

export interface O<T> {
  'a[i]': T
}

export default class At1<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['a', 'i'],
        fo: ['a[i]'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
        output: {
          'a[i]': {
            ref: true,
          },
        },
      },
      system,
      ID_AT_1
    )
  }

  async f({ a, i }: I<T>, done: Done<O<T>>): Promise<void> {
    let _a_i: T

    try {
      const l = await a.length()

      if (i >= 0 && i < l) {
        _a_i = await a.at(i)
      } else {
        done(undefined, 'index out of boundary')

        return
      }
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({ 'a[i]': _a_i })
  }

  public onIterDataInputData(name: string, data: any): void {
    this._forward_empty('a[i]')

    this._backward('i')
    this._backward('a')

    this._backward('done')
  }
}
