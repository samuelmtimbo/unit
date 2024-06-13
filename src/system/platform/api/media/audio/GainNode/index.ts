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
  private _source: AN
  private _node: AN

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
  }

  f({ node: sourceNode, gain }: I, done: Done<O>) {
    let _node: GainNode

    this._source = sourceNode

    const context = sourceNode.getContext()

    _node = context.createGain()

    _node.gain.value = gain

    sourceNode.connect(_node)

    const node = wrapAudioNode(_node, this.__system)

    this._node = node

    done({
      node,
    })
  }

  d() {
    if (this._node) {
      this._source.disconnect()

      this._source = undefined
      this._node = undefined
    }
  }
}
