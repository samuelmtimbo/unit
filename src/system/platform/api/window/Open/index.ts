import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { ID_OPEN } from '../../../../_ids'

export type WindowFeatures = {
  popup?: boolean
  width?: number
  height?: number
  left?: number
  top?: number
  noopener?: boolean
}

export interface I {
  url: string
  target: string
  features: WindowFeatures
  done: any
}

export interface O {
  window: CH
}

export default class Open extends Semifunctional<I, O> {
  private _window: Window

  constructor(system: System) {
    super(
      {
        fi: ['url', 'target', 'features'],
        fo: ['window'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          window: {
            ref: true,
          },
        },
      },
      system,
      ID_OPEN
    )
  }

  f({ url, target, features }: I, done: Done<O>) {
    const {
      api: {
        window: { open },
      },
    } = this.__system

    const windowFeatures = Object.entries(features)
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join(',')

    const _window = open(url, target, windowFeatures)

    this._window = _window

    const channel = new (class Channel extends $ implements CH {
      __: string[] = ['CH']

      async send(data: any): Promise<void> {
        const _data = stringify(data)

        // TODO should channel get "target" argument?
        _window.postMessage(_data, '*')

        return
      }
    })(this.__system)

    try {
      window.addEventListener('message', (event) => {
        // @ts-ignore
        channel.emit('message', event.data)
      })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({
      window: channel,
    })
  }

  d() {
    this._release()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._release()
    // }
  }

  private _release = (): void => {
    // console.log('WakeLock', '_release')
    if (this._window) {
      this._window.close()
    }
  }

  private _on_release = () => {
    // console.log('WakeLock', '_on_release')
    this._window = null
  }
}
