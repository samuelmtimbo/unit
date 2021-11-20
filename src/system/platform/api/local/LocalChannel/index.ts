import { $ } from '../../../../../Class/$'
import { Config } from '../../../../../Class/Unit/Config'
import { CH } from '../../../../../interface/CH'
import { RE } from '../../../../../interface/RE'
import { Primitive } from '../../../../../Primitive'
import { evaluate } from '../../../../../spec/evaluate'
import { stringify } from '../../../../../spec/stringify'

export interface I<T> {
  channel: string
  message: T
}

export interface O<T> {
  port: CH
}

// TODO

export default class LocalChannel<T>
  extends Primitive<I<T>, O<T>>
  implements CH, RE
{
  private _bc: BroadcastChannel | null = null

  constructor(config?: Config) {
    super(
      {
        i: ['channel', 'close'],
        o: ['port'],
      },
      config,
      {
        output: {
          port: {
            ref: true,
          },
        },
      }
    )
  }

  onDataInputData(name: string, data: any) {
    switch (name) {
      case 'channel':
        {
          const channel = data
          if (this._bc && this._bc.name !== channel) {
            this._bc.close()
          }
          this._bc = new BroadcastChannel(channel)
          const bc = this._bc
          const port = new (class Port extends $ implements CH {
            constructor() {
              super()

              bc.addEventListener('message', (event: MessageEvent) => {
                const { data } = event
                const _data = evaluate(data)
                this.emit('message', _data)
              })
            }

            _: string[] = ['P']

            send(data: any): Promise<void> {
              const _data = stringify(data)
              bc.postMessage(_data)
              return
            }
          })()

          this._output.port.push(port)
        }
        break
      case 'close':
        {
          if (this._bc) {
            this._bc.close()
            this._backward('channel')
            this._backward('close')
          }
        }

        this._output.port.pull()
        break
      default:
        break
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'channel') {
      if (this._bc) {
        this._bc.close()
        this._output.port.pull()
      }
    }
  }

  send(data: any): Promise<void> {
    if (this._bc) {
      this._bc.postMessage(data)
    }
    return
  }
}
