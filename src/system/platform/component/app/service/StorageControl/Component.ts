import { Component } from '../../../../../../client/component'
import parentElement from '../../../../../../client/platform/web/parentElement'
import { userSelect } from '../../../../../../client/util/style/userSelect'
import { Pod } from '../../../../../../pod'
import { getTree } from '../../../../../../spec/parser'
import { stringify } from '../../../../../../spec/stringify'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import Div from '../../../Div/Component'
import DataTree from '../../DataTree/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  overflowY: 'auto',
  paddingTop: '3px',
  paddingBottom: '3px',
}

export type CloudStorageSpec = Dict<any>

export async function getCloueStorageData(): Promise<CloudStorageSpec> {
  return {
    foo: 'bar',
    bar: 'zaz',
    zaz: 'bum',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }
}

export default class StorageService extends Component<HTMLDivElement, Props> {
  private _root: Div
  private _tree: DataTree

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const root = new Div(
      {
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    this._root = root

    const tree = new DataTree(
      {
        data: getTree(''),
        style: {
          display: 'none',
          height: 'fit-content',
          margin: 'auto',
          ...userSelect('none'),
        },
      },
      this.$system,
      this.$pod
    )
    root.registerParentRoot(tree)
    this._tree = tree

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('StorageService', 'onPropChanged', prop, current)
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  onMount(): void {
    getCloueStorageData().then((_data: CloudStorageSpec) => {
      const value = stringify(_data)
      const data = getTree(value)
      this._tree.setProp('data', data)
    })
  }
}
