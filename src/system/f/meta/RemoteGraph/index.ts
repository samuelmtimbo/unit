import { AsyncWorker } from '../../../../AsyncWorker'
import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Holder } from '../../../../Class/Holder'
import { RemotePort } from '../../../../RemotePort'
import { System } from '../../../../system'
import { Port } from '../../../../types/global/Port'
import { $Graph } from '../../../../types/interface/async/$Graph'
import { UCGEE } from '../../../../types/interface/UCGEE'
import { $wrap } from '../../../../wrap'
import { ID_REMOTE_GRAPH } from '../../../_ids'

export interface I {
  opt: {}
  close: any
  message: any
}

export interface O {
  graph: $Graph & $
  message: any
}

export default class RemoteGraph extends Holder<I, O> {
  private _remote_port: RemotePort
  private _port: Port

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['graph'],
        i: ['message'],
        o: ['message'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_REMOTE_GRAPH,
      'close'
    )

    this.addListener('take_err', () => {
      //
    })

    this.addListener('take_caught_err', () => {
      //
    })
  }

  f({ opt }: I, done: Done<O>) {
    const port: Port = {
      send: (data) => {
        this._output.message.push(data)
      },
      onmessage(data: any) {},
      onerror() {},
    }

    this._port = port

    const remote_port = new RemotePort(port)

    this._remote_port = remote_port

    const $graph: $Graph = AsyncWorker(remote_port, UCGEE)

    const graph = $wrap<$Graph>(this.__system, $graph, UCGEE)

    done({ graph })
  }

  d() {
    if (this._remote_port) {
      this._remote_port.close()

      this._remote_port = undefined

      this._forward_empty('graph')
    }
  }

  async onIterDataInputData(name: keyof I, data: any): Promise<void> {
    // console.log('Remote', 'onIterDataInputData', name, _data)

    super.onIterDataInputData(name, data)

    if (name === 'message') {
      this._port.onmessage(data)

      this._backward('message')
    }
  }
}
