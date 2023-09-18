import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AN } from '../../../../../../types/interface/AN'
import { wrapAudioNode } from '../../../../../../wrap/AudioNode'
import { ID_MIXER_NODE } from '../../../../../_ids'

export type I = {
  a: AN & $
  b: AN & $
}

export type O = {
  node: AN
}

export default class MixerNode extends Functional<I, O> {
  private _node: GainNode

  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['node'],
      },
      {
        input: {
          a: {
            ref: true,
          },
          b: {
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
      ID_MIXER_NODE
    )

    this.addListener('destroy', () => {
      if (this._node) {
        //
      }
    })
  }

  f({ a: aNode, b: bNode }: I, done: Done<O>) {
    let _node: GainNode

    const context = aNode.getContext()

    _node = context.createGain()

    this._node = _node

    aNode.connect(_node)
    bNode.connect(_node)

    const node = wrapAudioNode(_node, this.__system)

    done({
      node,
    })
  }

  d() {
    //
  }
}
