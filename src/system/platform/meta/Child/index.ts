import { Element_ } from '../../../../Class/Element'
import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { C } from '../../../../types/interface/C'
import { Unlisten } from '../../../../types/Unlisten'
import { ID_CHILD } from '../../../_ids'

export interface I {
  parent: Element_
  at: number
  done: any
}

export interface O {
  child: C
}

export default class Child extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['parent', 'at'],
        fo: ['child'],
        i: ['done'],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
        output: {
          child: {
            ref: true,
          },
        },
      },
      system,
      ID_CHILD
    )
  }

  private _unlisten: Unlisten

  private _plunk = () => {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    this._forward_empty('child')
  }

  f({ parent, at }: I, done: Done<O>): void {
    const child = parent.refChild(at)

    if (!child) {
      this.err('no child at this position')
      return
    }

    const remove_child_at_listener = () => {
      this._forward_empty('child')

      this.err('no child at this position')
    }

    parent.addListener(`remove_child_at_${at}`, remove_child_at_listener)

    this._unlisten = () => {
      parent.removeListener(`remove_child_at_${at}`, remove_child_at_listener)
    }

    done({
      child,
    })
  }

  onIterDataInputData(name: string): void {
    // if (name === 'done') {
    this._plunk()

    this._backward('done')
    // }
  }
}
