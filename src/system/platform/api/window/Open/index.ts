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
  detached: boolean
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
        fi: ['url', 'target', 'features', 'detached'],
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

  private _detached: boolean

  f({ url, target, features, detached }: I, done: Done<O>) {
    const {
      api: {
        window: { open },
      },
    } = this.__system

    this._detached = detached

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

    window.onbeforeunload = () => {
      this._finish()
    }

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
    this._finish()

    // }
  }

  private _finish() {
    this._forward_empty('window')

    this._backward('url')
    this._backward('target')
    this._backward('features')

    this._backward('done')
  }

  private _release = (): void => {
    // console.log('WakeLock', '_release')
    if (this._window && !this._detached) {
      this._window.close()
    }
  }
}
