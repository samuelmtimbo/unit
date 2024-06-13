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

  private _a: AN
  private _b: AN

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
  }

  f({ a, b }: I, done: Done<O>) {
    let _node: GainNode

    const context = a.getContext()

    _node = context.createGain()

    this._node = _node

    this._a = a
    this._b = b

    a.connect(_node)
    b.connect(_node)

    const node = wrapAudioNode(_node, this.__system)

    done({
      node,
    })
  }

  d() {
    if (this._node) {
      this._a.disconnect(this._node)
      this._b.disconnect(this._node)

      this._b = undefined
      this._a = undefined
      this._node = undefined
    }
  }
}
