import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { $Graph } from '../../../../../interface/async/$Graph'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { GraphSpec } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import Div from '../../Div/Component'

export interface Props {
  graph: $Graph
}

export const DEFAULT_STYLE = {
  display: 'flex',
}

export default class Tree extends Element<HTMLDivElement, Props> {
  private _div: Div

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { graph } = this.$props

    const $element = parentElement($system)

    const div = new Div(
      {
        style: { ...DEFAULT_STYLE },
      },
      this.$system,
      this.$pod
    )
    this._div = div

    this.$element = $element
    this.$slot = div.$slot

    this.registerRoot(div)

    if (graph) {
      this._setup(graph)
    }
  }

  private _setup(graph: $Graph): void {
    graph.$getSpec({}, (spec: GraphSpec) => {
      //
    })
  }

  private _prop_handler = {
    style: (style: Dict<string> | undefined = {}) => {
      this._div.setProp('style', { ...DEFAULT_STYLE, ...style })
    },
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
