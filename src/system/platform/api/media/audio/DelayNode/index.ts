import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AN } from '../../../../../../types/interface/AN'
import { V } from '../../../../../../types/interface/V'
import { wrapAudioNode } from '../../../../../../wrap/AudioNode'
import { wrapAudioParam } from '../../../../../../wrap/AudioParam'
import { ID_DELAY_NODE } from '../../../../../_ids'

export type I = {
  node: AN & $
  delay: number
}

export type O = {
  node: AN
  delay: V<number>
}

export default class DelayNode_ extends Functional<I, O> {
  private _node: DelayNode

  constructor(system: System) {
    super(
      {
        i: ['node', 'delay'],
        o: ['node', 'delay'],
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
          delay: {
            ref: true,
          },
        },
      },
      system,
      ID_DELAY_NODE
    )

    this.addListener('destroy', () => {
      if (this._node) {
        this._disconnect(this._i.node)
      }
    })
  }

  f({ node: sourceNode, delay: delayTime }: I, done: Done<O>) {
    let _node: DelayNode

    sourceNode = sourceNode as AN & $

    const context = sourceNode.getContext()

    _node = context.createDelay()

    _node.delayTime.value = delayTime

    this._node = _node

    sourceNode.connect(_node)

    const node = wrapAudioNode(_node, this.__system)

    const delay = wrapAudioParam(_node.delayTime, this.__system)

    done({
      node,
      delay,
    })
  }

  private _disconnect = (sourceNode: AN) => {
    if (sourceNode) {
      sourceNode.disconnect()

      this._node = undefined
    }
  }

  i() {
    this._disconnect(this._i.node)
  }

  d(name, data) {
    if (name === 'node') {
      this._disconnect(this._i.node)
    }
  }
}
