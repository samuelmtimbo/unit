import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AN } from '../../../../../../types/interface/AN'
import { ID_AUDIO_DESTINATION_NODE } from '../../../../../_ids'

export type I = {
  node: AN
}

export type O = {
  node: AN
}

export default class AudioDestinationNode_ extends Functional<I, O> {
  private _node: AudioDestinationNode

  constructor(system: System) {
    super(
      {
        i: ['node'],
        o: [],
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
      ID_AUDIO_DESTINATION_NODE
    )

    this.addListener('destroy', () => {
      this._destroy(this._i.node)
    })
  }

  f({ node: sourceNode }: I, done: Done<O>) {
    const ctx = sourceNode.getContext()

    const _node = ctx.destination

    this._node = _node

    sourceNode.connect(_node)
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
