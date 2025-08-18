import { $ } from '../../../../../../Class/$'
import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { AC } from '../../../../../../types/interface/AC'
import { ADB } from '../../../../../../types/interface/ADB'
import { AN } from '../../../../../../types/interface/AN'
import { BSN } from '../../../../../../types/interface/BSN'
import { Listener } from '../../../../../../types/Listener'
import { Unlisten } from '../../../../../../types/Unlisten'
import { ID_BUFFER_SOURCE_NODE } from '../../../../../_ids'

export type I = {
  buffer: ADB & $
  context: AC
  done: any
}

export type O = {
  node: AN & $
}

export default class BufferSourceNode extends Holder<I, O> {
  private _node: AN

  constructor(system: System) {
    super(
      {
        fi: ['buffer', 'context'],
        fo: ['node'],
      },
      {
        input: {
          buffer: {
            ref: true,
          },
          context: {
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
      ID_BUFFER_SOURCE_NODE
    )
  }

  async f({ buffer, context }: I, done: Done<O>) {
    let node_: AudioBufferSourceNode

    const buffer_ = await buffer.audioBuffer()

    node_ = context.createBufferSource()

    node_.buffer = buffer_

    const node = new (class BufferSourceNode_ extends $ implements AN, BSN {
      __: string[] = ['AN', 'BSN']

      getContext(): AudioContext {
        return node_.context as AudioContext
      }

      connect(targetAudioNode: AudioNode): void {
        node_.connect(targetAudioNode)
      }

      disconnect(targetAudioNode?: AudioNode): void {
        node_.disconnect(targetAudioNode)
      }

      start(when: number, offset: number, duration): void {
        node_.start(when, offset, duration)
      }

      addListener(event: string, listener: Listener<any>): Unlisten {
        if (event === 'ended') {
          const listener_ = (event) => {
            listener({})
          }

          node_.addEventListener('ended', listener_)

          return () => {
            node_.removeEventListener('ended', listener_)
          }
        }

        return super.addListener(event as any, listener)
      }
    })(this.__system)

    done({
      node,
    })
  }

  d() {
    if (this._node) {
      this._node = undefined
    }
  }
}
