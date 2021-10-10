import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export interface I {
  unit: Unit
  name: string
}

export interface O {}

export default class Ref extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['unit', 'name'],
        o: [],
      },
      config,
      {
        input: {
          unit: {
            ref: true,
          },
        },
      }
    )
  }

  onRefInputData(name: string, data: any): void {
    // if (name === 'unit') {
    this._setup()
    // }
  }

  onDataInputData(name: string, data: any): void {
    // if (name === 'name') {
    this._setup()
    // }
  }

  private _setup = () => {
    const unit = this._input.unit.peak()
    const name = this._input.name.peak()

    if (unit && name) {
      const ref = unit[`$${name}`]
      if (ref) {
        this.err('reference not found')
        return
      }
    }
  }
}
