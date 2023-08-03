import { Functional, FunctionalEvents } from '../../../Class/Functional'
import { addListener } from '../../../client/addListener'
import { Context, setColor } from '../../../client/context'
import { makeCustomListener } from '../../../client/event/custom'
import { makeResizeListener } from '../../../client/event/resize'
import { ObjectUpdateType } from '../../../Object'
import { ObjectWaiter } from '../../../ObjectWaiter'
import { System } from '../../../system'
import { Component_ } from '../../../types/interface/Component'
import { J } from '../../../types/interface/J'
import { Unlisten } from '../../../types/Unlisten'
import { listenGlobalComponent } from '../../globalComponent'
import { ID_CONTEXT } from '../../_ids'
import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'

export interface I {
  element: Component_
}

export interface O {}

export type _Context_EE = { _resize: [{ width: number; height: number }] }

export type _ContextEvents = FunctionalEvents<_Context_EE> & _Context_EE

export default class _Context
  extends Functional<I, J, _ContextEvents>
  implements J
{
  private _context: Context
  private _context_waiter = new ObjectWaiter<Context>()

  private _unlisten: Unlisten
  private _unlisten_context: Unlisten

  constructor(system: System) {
    super(
      {
        i: ['element'],
        o: [],
      },
      {
        input: {
          element: {
            ref: true,
          },
        },
      },
      system,
      ID_CONTEXT
    )
  }
  subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    throw new MethodNotImplementedError()
  }

  public f({ element }: I): void {
    const globalId = element.getGlobalId()

    const _mount = ($context: Context) => {
      // console.log('Context', '_mount')

      this._context = $context

      const unlisten_context = addListener(
        this._context,
        makeResizeListener(({ width, height }) => {
          this.emit('_resize', { width, height })
        })
      )

      this._unlisten_context = unlisten_context

      this._context_waiter.set($context)
    }

    const _unmount = () => {
      // console.log('Context', '_unmount')

      if (this._unlisten_context) {
        this._unlisten_context()
        this._unlisten_context = undefined
      }

      this._context = null
    }

    const component = this.__system.getRemoteComponent(globalId)

    if (component) {
      if (component.$mounted) {
        _mount(component.$context)
      } else {
        //
      }
    } else {
      //
    }

    const unlisten = listenGlobalComponent(
      this.__system,
      globalId,
      (_component) => {
        this._unlisten = _component.addEventListeners([
          makeCustomListener('mount', () => {
            const { $context } = _component
            _mount($context)
          }),
          makeCustomListener('unmount', () => {
            _unmount()
          }),
        ])

        if (_component.$mounted) {
          _mount(_component.$context)
        }
      }
    )

    this._unlisten = unlisten
  }

  d() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._unlisten_context) {
      this._unlisten_context()
      this._unlisten_context = undefined
    }

    this._context = undefined
  }

  public async get(name: string): Promise<any> {
    await this._context_waiter.once()

    switch (name) {
      case 'color': {
        const { $color } = this._context
        return $color
      }
      case 'width': {
        const { $width } = this._context
        return $width
      }
      case 'height': {
        const { $height } = this._context
        return $height
      }
      default: {
        throw new Error('property not defined')
      }
    }
  }

  public async set(name: string, data: any): Promise<void> {
    await this._context_waiter.once()

    switch (name) {
      case 'color': {
        return setColor(this._context, data)
      }
      case 'width': {
        throw new Error('width is read only')
      }
      case 'height': {
        throw new Error('height is read only')
      }
      default: {
        throw new Error('property not defined')
      }
    }
  }

  delete(name: string): Promise<any> {
    throw new MethodNotImplementedError()
  }

  pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new MethodNotImplementedError()
  }

  pathGet(path: string[], name: string): Promise<any> {
    throw new MethodNotImplementedError()
  }

  pathDelete(path: string[], name: string): Promise<void> {
    throw new MethodNotImplementedError()
  }

  keys(): Promise<string[]> {
    throw new MethodNotImplementedError()
  }

  hasKey(name: string): Promise<boolean> {
    throw new MethodNotImplementedError()
  }
}
