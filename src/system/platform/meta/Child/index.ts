import { Element } from '../../../../Class/Element/Element'
import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { Config } from '../../../../Class/Unit/Config'
import { Unlisten } from '../../../../Unlisten'

export interface I {
  parent: Element
  at: number
  done: any
}

export interface O {}

export default class Child extends Semifunctional<I, O> {
  constructor(config?: Config) {
    super(
      {
        fi: ['parent', 'at'],
        fo: ['child'],
        i: ['done'],
      },
      config,
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
      }
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

    const remove_child_at_event_name = `remove_child_at_${at}`

    parent.addListener(remove_child_at_event_name, remove_child_at_listener)

    this._unlisten = () => {
      parent.removeListener(
        remove_child_at_event_name,
        remove_child_at_listener
      )
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
