import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AN } from '../../../../../../types/interface/AN'
import { wrapAudioNode } from '../../../../../../wrap/AudioNode'
import { ID_GAIN_NODE } from '../../../../../_ids'

export type I = {
  node: AN & $
  gain: number
}

export type O = {
  node: AN
}

export default class GainNode_ extends Functional<I, O> {
  private _node: GainNode

  constructor(system: System) {
    super(
      {
        i: ['node', 'gain'],
        o: ['node'],
      },
      {
        input: {
          node: {
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
      ID_GAIN_NODE
    )

    this.addListener('destroy', () => {
      if (this._node) {
        this._disconnect(this._i.node)
      }
    })
  }

  f({ node: sourceNode, gain }: I, done: Done<O>) {
    let _node: GainNode

    sourceNode = sourceNode as AN & $

    const context = sourceNode.getContext()

    _node = context.createGain()

    _node.gain.value = gain

    this._node = _node

    sourceNode.connect(_node)

    const node = wrapAudioNode(_node, this.__system)

    done({
      node,
    })
  }

  private _disconnect = (sourceNode: AN) => {
    if (sourceNode) {
      sourceNode.disconnect(this._node)

      this._node = undefined
    }
  }

  i() {
    this._disconnect(this._i.node)
  }

  d() {
    this._disconnect(this._i.node)
  }
}
