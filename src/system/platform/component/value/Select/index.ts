import { Field } from '../../../../../Class/Field'
import { Graph } from '../../../../../Class/Graph'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { UnitBundleSpec } from '../../../../../types/UnitBundleSpec'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_SELECT } from '../../../../_ids'
import { Attr } from '../../../Style'
import Option from '../Option'

export interface I {
  style: object
  value: string
  attr: Attr
}

export interface O {
  value: string
}

const findFirstOption = (unit: Unit): Option | null => {
  if (unit instanceof Option) {
    return unit
  } else if (unit instanceof Graph) {
    const units = unit.getUnits()

    for (const unitId in units) {
      const unit = units[unitId]

      const option = findFirstOption(unit)

      if (option) {
        return option
      }
    }

    return null
  } else {
    return null
  }
}

export default class Select extends Field<'value', I, O> {
  private _first_option: Option | null = null

  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'attr'],
        o: ['value'],
      },
      {},
      system,
      ID_SELECT,
      'value'
    )

    this._defaultState = {}

    const setFirstOption = (option: Option) => {}

    const appendChildListener = (_: UnitBundleSpec, child: Component_) => {
      if (!this._first_option) {
        const option = findFirstOption(child)

        if (option) {
          this._first_option = option

          const value = option.peakInput('value')

          if (value !== undefined) {
            void this.set('value', value)

            this._forward('value', value)
            this._backward('value')
          }
        }
      }
    }

    const removeChildListener = () => {
      if (this._first_option) {
        const value = this._first_option.peakInput('value')

        const value_was_first_option = this._i.value === value

        this._first_option = null

        for (const child of this._children) {
          const option = findFirstOption(child)

          if (option) {
            this._first_option = option

            const value = option.peakInput('value')

            if (value !== undefined) {
              void this.set('value', value)

              this._forward('value', value)

              if (value_was_first_option) {
                this._backward('value')
              }
            }

            break
          }
        }

        if (!this._first_option) {
          void this.set('value', undefined)

          this._forwarding_empty = true
          this._forward_empty('value')
          this._forwarding_empty = false
        }
      }
    }

    this.addListener('append_child', appendChildListener)
    this.addListener('remove_child', removeChildListener)
  }

  onDataInputDrop(name: string): void {
    if (this._first_option) {
      const value = this._first_option.peakInput('value')

      if (value !== undefined) {
        void this.set('value', value)

        this._forward('value', value)
      }
    }
  }
}
