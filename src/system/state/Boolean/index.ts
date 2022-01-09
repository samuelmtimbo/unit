import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { V } from '../../../interface/V'
import { Pod } from '../../../pod'
import { System } from '../../../system'

export interface I<T> {
  init: boolean
  done: any
}

export interface O<T> {}

export default class Boolean<T>
  extends Semifunctional<I<T>, O<T>>
  implements V
{
  private _test: boolean

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['init'],
        fo: [],
        i: ['done'],
        o: [],
      },
      {
        output: {
          arr: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    this._test = init

    done({})
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._input.init.pull()
    this._input.done.pull()
    // }
  }

  async read(): Promise<boolean> {
    return this._test
  }

  async write(data: boolean): Promise<void> {
    this._test = data
  }
}
