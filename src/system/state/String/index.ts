import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { V } from '../../../interface/V'
import { Pod } from '../../../pod'
import { System } from '../../../system'

export interface I<T> {
  init: string
  done: any
}

export interface O<T> {}

export default class String<T> extends Semifunctional<I<T>, O<T>> implements V {
  private _str: string

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
    this._str = init

    done({})
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._input.init.pull()
    this._input.done.pull()
    // }
  }

  async read(): Promise<string> {
    return this._str
  }

  async write(data: string): Promise<void> {
    this._str = data
  }
}
