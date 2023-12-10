import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AC } from '../../../../../../types/interface/AC'
import { AN } from '../../../../../../types/interface/AN'
import { ON } from '../../../../../../types/interface/ON'
import { V } from '../../../../../../types/interface/V'
import { wrapAudioNode } from '../../../../../../wrap/AudioNode'
import { wrapAudioParam } from '../../../../../../wrap/AudioParam'
import { ID_OSCILLATOR_NODE } from '../../../../../_ids'

export type I = {
  node: (AN | AC) & $
  opt: OscillatorOptions
}

export type O = {
  node: ON & AN
  frequency: V<number>
  detune: V<number>
}

export default class OscillatorNode_ extends Functional<I, O> {
  private _node: OscillatorNode

  constructor(system: System) {
    super(
      {
        i: ['node', 'opt'],
        o: ['node', 'frequency', 'detune'],
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
          frequency: {
            ref: true,
          },
          detune: {
            ref: true,
          },
        },
      },
      system,
      ID_OSCILLATOR_NODE
    )

    this.addListener('destroy', () => {
      this._destroy()
    })
  }

  private _destroy = () => {
    if (this._node) {
      this._node.stop()

      this._node = undefined
    }
  }

  f({ node: sourceNode, opt }: I, done: Done<O>) {
    let _node: OscillatorNode

    const {
      api: {
        window: { OscillatorNode },
      },
    } = this.__system

    if (sourceNode.__.includes('AC')) {
      _node = (sourceNode as AC).createOscilator(opt)
    } else {
      sourceNode = sourceNode as AN & $

      const context = sourceNode.getContext()

      // @ts-ignore
      _node = new OscillatorNode(context, opt)
    }

    _node.start()

    this._node = _node

    const node = wrapAudioNode(_node, this.__system)
    const frequency = wrapAudioParam(_node.frequency, this.__system)
    const detune = wrapAudioParam(_node.detune, this.__system)

    done({
      node,
      frequency,
      detune,
    })
  }

  i(name) {
    this._destroy()
  }

  d() {
    this._destroy()
  }
}
