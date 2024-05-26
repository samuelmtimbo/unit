import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AN } from '../../../../../../types/interface/AN'
import { MS } from '../../../../../../types/interface/MS'
import { wrapMediaStream } from '../../../../../../wrap/MediaStream'
import { ID_MEDIA_STREAM_DESTINATION_NODE } from '../../../../../_ids'

export type I = {
  node: AN
}

export type O = {
  stream: MS & $
}

export default class MediaStreamDestinationNode_ extends Functional<I, O> {
  private _node: MediaStreamAudioDestinationNode

  constructor(system: System) {
    super(
      {
        i: ['node'],
        o: ['stream'],
      },
      {
        input: {
          node: {
            ref: true,
          },
        },
        output: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_MEDIA_STREAM_DESTINATION_NODE
    )

    this.addListener('destroy', () => {
      this._destroy(this._i.node)
    })
  }

  f({ node }: I, done: Done<O>) {
    const ctx = node.getContext() as AudioContext

    const node_ = ctx.createMediaStreamDestination()

    this._node = node_

    const stream_ = node_.stream

    node.connect(node_)

    const stream = wrapMediaStream(stream_, this.__system)

    done({
      stream,
    })
  }

  private _destroy(node: AN) {
    if (node) {
      node.disconnect(this._node)

      this._node = undefined
    }
  }

  d(name: string, data: any) {
    this._destroy(data)
  }
}
