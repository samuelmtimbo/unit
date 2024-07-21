import { Element_ } from '../../../../../Class/Element'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { C } from '../../../../../types/interface/C'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_PARENT_CHILD } from '../../../../_ids'

export interface I {
  parent: Element_
  at: number
  done: any
}

export interface O {
  child: C
}

export default class ParentChild extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['parent', 'at'],
        fo: ['child'],
        i: [],
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
      ID_PARENT_CHILD
    )
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

  d() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }
  }
}
