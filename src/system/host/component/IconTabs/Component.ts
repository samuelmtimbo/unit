import { ANIMATION_T_S } from '../../../../client/animation/ANIMATION_T_S'
import mergeStyle from '../../../../client/component/mergeStyle'
import { Element } from '../../../../client/element'
import { makeClickListener } from '../../../../client/event/pointer/click'
import parentElement from '../../../../client/platform/web/parentElement'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import IOAuthWall from '../../../platform/component/app/service/IOAuthWallControl/Component'
import Div from '../../../platform/component/Div/Component'
import Icon from '../../../platform/component/Icon/Component'
import { dragOverTimeListener } from './dragOverTimeListener'

export type Tab = {
  name: string
  icon: string
}

export interface Props {
  tabs?: string[]
  style?: Dict<string>
}

export const TABS = ['local', 'user', 'shared']

export const AUTH_TABS = ['user', 'shared']

export const TAB_TO_ICON: Dict<string> = {
  local: 'home',
  user: 'user',
  shared: 'globe',
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
}

export default class CloudTabs extends Element<HTMLDivElement, Props> {
  private _root: Div

  private _slider_comp: Div
  private _lists_comp: Div

  public _tab: Dict<Icon> = {}
  public _list: Dict<Div | IOAuthWall> = {}

  private _lists_inner: Div

  public section: string

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style, tabs = TABS } = $props

    const n = tabs.length

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

    const slider_comp = new Div(
      {
        style: {
          position: 'absolute',
          left: '0',
          top: 'calc(100% - 3px)',
          height: '4px',
          backgroundColor: 'currentColor',
          width: `${100 / n}%`,
          transform: 'translateX(0%)',
          transition: `transform ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    this._slider_comp = slider_comp

    const tabs_comp = new Div(
      {
        style: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          height: '30px',
          borderWidth: '0px',
          borderBottomWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
        },
      },
      this.$system,
      this.$pod
    )

    const lists_comp = new Div(
      {
        style: {
          // display: 'flex',
          // width: `${n * 100}%`,
          // position: 'relative',
          height: 'calc(100% - 30px)',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'hidden',
          // transform: 'translateX(0%)',
        },
      },
      this.$system,
      this.$pod
    )
    this._lists_comp = lists_comp

    const lists_inner = new Div(
      {
        style: {
          whiteSpace: 'nowrap',
          transform: 'translate(0%)',
          transition: `transform ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    this._lists_inner = lists_inner

    lists_comp.registerParentRoot(lists_inner)

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$subComponent = {
      root,
      slider_comp,
      tabs_comp,
      lists_comp,
    }
    this.$unbundled = false

    this.registerRoot(root)

    root.registerParentRoot(tabs_comp)
    root.registerParentRoot(lists_comp)

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]
      const tab_comp = this._render_tab(tab)
      this._tab[tab] = tab_comp
      tabs_comp.registerParentRoot(tab_comp)

      const list_comp = this._render_list(tab, {})
      this._list[tab] = list_comp

      this.$slot[tab] = list_comp.$slot['default']
      this.$children[tab] = list_comp.$children['default']

      lists_inner.registerParentRoot(list_comp)
    }

    tabs_comp.registerParentRoot(slider_comp)

    this.section = tabs[0]
    this._show_section(tabs[0])
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  private _render_tab = (tab: string, style: Dict<string> = {}): Icon => {
    const icon = TAB_TO_ICON[tab]
    const tab_comp = new Icon(
      {
        icon,
        style: {
          // width: '24px',
          height: '18px',
          flexGrow: '1',
          margin: '6px',
          cursor: 'pointer',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    tab_comp.$element.setAttribute('dropTarget', 'true')
    tab_comp.addEventListener(
      makeClickListener({
        onClick: () => {
          this._show_section(tab)
        },
      })
    )

    dragOverTimeListener(tab_comp, 500, () => {
      this._show_section(tab)
    })

    return tab_comp
  }

  private _show_section = (section: string): void => {
    const { tabs = TABS } = this.$props

    this.section = section

    const i = tabs.indexOf(section)

    mergeStyle(this._slider_comp, {
      transform: `translateX(${i * 100}%)`,
    })

    mergeStyle(this._lists_inner, {
      transform: `translate(${-i * 100}%)`,
    })
  }

  private _render_list = (
    tab: string,
    style: Dict<string> = {}
  ): Div | IOAuthWall => {
    let list: Div | IOAuthWall
    style = {
      display: 'inline-block',
      // padding: '6px',
      flexDirection: 'column',
      overflowY: 'scroll',
      gap: '6px',
      overscrollBehavior: 'none',
      ...style,
    }
    if (tab === 'local') {
      list = new Div(
        {
          style,
        },
        this.$system,
        this.$pod
      )
    } else {
      list = new IOAuthWall(
        {
          style,
        },
        this.$system,
        this.$pod
      )
    }
    return list
  }
}
