import { Config } from '../../../Class/Unit/Config'
import { addListener } from '../../../client/addListener'
import { Context, setColor } from '../../../client/context'
import { makeCustomListener } from '../../../client/event/custom'
import { makeResizeListener } from '../../../client/event/resize'
import { C } from '../../../interface/C'
import { J } from '../../../interface/J'
import { U } from '../../../interface/U'
import { ObjectUpdateType } from '../../../Object'
import { ObjectWaiter } from '../../../ObjectWaiter'
import { Primitive } from '../../../Primitive'
import { Unlisten } from '../../../Unlisten'

export interface I {
  element: C
}

export interface O {}

export default class _Context extends Primitive<I, J> implements J {
  private _context: Context

  private _context_waiter = new ObjectWaiter<Context>()

  private _unlisten: Unlisten

  private _unlisten_context: Unlisten

  constructor(config?: Config) {
    super(
      {
        i: ['element'],
        o: [],
      },
      config,
      {
        input: {
          element: {
            ref: true,
          },
        },
      }
    )
  }

  subscribe(
    path: string[],
    name: any,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    throw new Error('Method not implemented.')
  }

  public onRefInputData(name: string, data: U) {
    // if (name === 'element') {
    this._setup()
    // }
  }

  public onRefInputDrop(name: string) {
    // if (name === 'element') {
    this._plunk()
    // }
  }

  private _setup = () => {
    const { element } = this._i

    const unlisten = element.component((_component) => {
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
    })
    this._unlisten = unlisten
  }

  private _plunk(): void {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._unlisten_context) {
      this._unlisten_context()
      this._unlisten_context = undefined
    }
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
    throw new Error('Method not implemented.')
  }

  setPath(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getPath(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  deletePath(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
