import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AC } from '../../../../../../types/interface/AC'
import { AN } from '../../../../../../types/interface/AN'
import { MS } from '../../../../../../types/interface/MS'
import { ON } from '../../../../../../types/interface/ON'
import { wrapAudioNode } from '../../../../../../wrap/AudioNode'
import { ID_MEDIA_STREAM_AUDIO_SOURCE_NODE } from '../../../../../_ids'

export type I = {
  node: (AN | AC) & $
  stream: MS
  opt: OscillatorOptions
}

export type O = {
  node: ON & AN
}

export default class MediaStreamAudioSourceNode_ extends Functional<I, O> {
  private _node: MediaStreamAudioSourceNode

  constructor(system: System) {
    super(
      {
        i: ['node', 'opt', 'stream'],
        o: ['node'],
      },
      {
        input: {
          node: {
            ref: true,
          },
          stream: {
            ref: true,
          },
        },
        output: {
          node: {
            ref: true,
          },
        },
      },
      system,
      ID_MEDIA_STREAM_AUDIO_SOURCE_NODE
    )
  }

  private _destroy = () => {}

  f({ node: sourceNode, stream, opt }: I, done: Done<O>) {
    let _node: MediaStreamAudioSourceNode

    const {
      api: {
        window: { MediaStreamAudioSourceNode },
      },
    } = this.__system

    let context

    if (sourceNode.__.includes('AC')) {
      sourceNode = sourceNode as AC & $

      context = sourceNode.get()
    } else {
      sourceNode = sourceNode as AN & $

      context = sourceNode.getContext()
    }

    stream.mediaStream((mediaStream: MediaStream) => {
      try {
        // @ts-ignore
        _node = new MediaStreamAudioSourceNode(context, {
          mediaStream,
        })
      } catch (err) {
        done(undefined, err.message.toLowerCase())

        return
      }

      this._node = _node

      const node = wrapAudioNode(_node, this.__system)

      done({
        node,
      })
    })
  }

  d() {
    if (this._node) {
      this._node = undefined
    }
  }
}
