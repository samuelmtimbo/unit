import { Component } from '../../../../../../client/component'
import mergeStyle from '../../../../../../client/component/mergeStyle'
import {
  addSignInListener,
  addSignOutListener,
  isSignedIn,
} from '../../../../../../client/host/user'
import parentElement from '../../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import { Unlisten } from '../../../../../../types/Unlisten'
import callAll from '../../../../../../util/call/callAll'
import Div from '../../../Div/Component'
import Icon from '../../../Icon/Component'

export interface Props {
  style?: Dict<string>
  contentStyle?: Dict<string>
}

export const DEFAULT_STYLE = {}

export default class IOAuthWall extends Component<HTMLDivElement, Props> {
  private _root: Div
  private _signin: Div
  private _content: Div

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const wall = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      this.$system,
      this.$pod
    )
    this._signin = wall

    const lock = new Icon(
      {
        icon: 'lock',
        style: {
          width: '24px',
          height: '24px',
          cursor: 'pointer',
        },
      },
      this.$system,
      this.$pod
    )
    wall.appendParentRoot(lock)
    this._signin = wall

    const root = new Div(
      {
        style: {
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    this._root = root

    const content = new Div(
      {
        style: {
          display: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    this._content = wall

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = wall.$slot
    this.$subComponent = {
      root,
      wall,
      lock,
      content,
    }

    this.registerRoot(root)

    root.registerParentRoot(content)
    root.registerParentRoot(wall)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  private _hide_signin = () => {
    mergeStyle(this._signin, {
      display: 'none',
    })
    mergeStyle(this._content, {
      display: 'contents',
    })
  }

  private _show_signin = () => {
    mergeStyle(this._signin, {
      display: 'flex',
    })
    mergeStyle(this._content, {
      display: 'none',
    })
  }

  private _unlisten_auth: Unlisten

  onMount(): void {
    this._unlisten_auth = callAll([
      addSignInListener(this.$system, (user: string) => {
        this._hide_signin()
      }),
      addSignOutListener(this.$system, () => {
        this._show_signin()
      }),
    ])

    if (isSignedIn(this.$system)) {
      this._hide_signin()
    }
  }

  onUnmount(): void {
    this._unlisten_auth()
  }
}
