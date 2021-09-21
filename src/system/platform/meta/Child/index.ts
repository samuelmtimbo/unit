import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'
import { Unlisten } from '../../../../Unlisten'

export interface I {
  element: Element
  at: string
  release: any
}

export interface O {}

// TODO too much duplication with Functional

export default class Child extends Primitive<I, O> {
  private _looping: boolean = true

  constructor(config?: Config) {
    super(
      {
        i: ['parent', 'at', 'release'],
        o: ['component'],
      },
      config,
      {
        input: {
          parent: {
            ref: true,
          },
        },
        output: {
          component: {
            ref: true,
          },
        },
      }
    )

    this.addListener('take_err', () => {
      if (this._looping) {
        this._done()
      }
    })

    this.addListener('take_caught_err', () => {
      if (!this.hasErr()) {
        this._done()
      }
    })
  }

  onRefInputData(name: string, data: any): void {
    // if (name === 'element') {
    this._forward_if_ready()
    // }
  }

  onDataInputData(name: string, data: any): void {
    if (name === 'at') {
      this._forward_if_ready()
    } else {
      // name === 'release'
      this._plunk()
    }
  }

  onRefInputDrop(name: string): void {
    // if (name === 'element') {
    this._forward_if_ready()
    // }
  }

  onDataInputDrop(name: string): void {
    if (!this._backwarding) {
      this._plunk_self()
    }
  }

  private _unlisten: Unlisten

  private _forward_if_ready = () => {
    const element = this._input.parent.peak() as Element
    const at = this._input.at.peak() as number

    if (element !== undefined && at !== undefined) {
      this._looping = true

      if (this.hasErr()) {
        this.takeErr()
      }

      this._plunk_self()

      const child = element.child(at)

      if (!child) {
        this.err('no child at this position')
        return
      }

      // plunk if this child is removed
      const remove_child_at_listener = () => {
        this._plunk()
      }
      const remove_child_at_event_name = `remove_child_at_${at}`
      element.addListener(remove_child_at_event_name, remove_child_at_listener)
      this._unlisten = () => {
        element.removeListener(
          remove_child_at_event_name,
          remove_child_at_listener
        )
      }

      this._output.component.push(child)
    }
  }

  private _plunk = () => {
    this._plunk_self()

    this._done()
  }

  private _plunk_self = (): void => {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    this._output.component.pull()
  }

  private _done = (): void => {
    this._backwarding = true
    this._input.at.pull()
    this._input.release.pull()
    this._output.component.pull()
    this._backwarding = true
    this._forward_if_ready()
  }
}
