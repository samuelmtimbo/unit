import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AAN } from '../../../../../../types/interface/AAN'
import { AC } from '../../../../../../types/interface/AC'
import { AN } from '../../../../../../types/interface/AN'
import { wrapAudioAnalyserNode } from '../../../../../../wrap/AudioNode'
import { ID_ANALYSER_NODE } from '../../../../../_ids'

export type I = {
  node: (AN | AC) & $
  opt: AnalyserOptions
}

export type O = {
  node: AAN & AN & $
}

export default class AnalyserNode_ extends Functional<I, O> {
  private _source: AN | AC
  private _node: AnalyserNode

  constructor(system: System) {
    super(
      {
        i: ['node', 'opt'],
        o: ['node'],
      },
      {},
      system,
      ID_ANALYSER_NODE
    )

    this.addListener('destroy', () => {
      this.d()
    })
  }

  f({ node: sourceNode, opt }: I, done: Done<O>) {
    let _node: AnalyserNode

    const {
      api: {
        window: { AnalyserNode },
      },
    } = this.__system

    if (sourceNode.__.includes('AC')) {
      sourceNode = sourceNode as AC & $

      _node = sourceNode.createAnalyser(opt)
    } else {
      sourceNode = sourceNode as AN & $

      const context = sourceNode.getContext()

      // @ts-ignore
      _node = new AnalyserNode(context, opt)

      sourceNode.connect(_node)
    }

    this._source = sourceNode
    this._node = _node

    const node = wrapAudioAnalyserNode(_node, this.__system)

    done({
      node,
    })
  }

  d() {
    if (this._node) {
      this._source.disconnect(this._node)

      this._source = undefined
      this._node = undefined
    }
  }
}
