import { addListener } from '../../../../../../client/addListener'
import { ANIMATION_T_S } from '../../../../../../client/animation/ANIMATION_T_S'
import { Component } from '../../../../../../client/component'
import mergeStyle from '../../../../../../client/component/mergeStyle'
import { makeCustomListener } from '../../../../../../client/event/custom'
import { makeShortcutListener } from '../../../../../../client/event/keyboard'
import { makeClickListener } from '../../../../../../client/event/pointer/click'
import {
  addSignInListener,
  addSignOutListener,
  isSignedIn,
} from '../../../../../../client/host/user'
import { MAX_Z_INDEX } from '../../../../../../client/MAX_Z_INDEX'
import parentElement from '../../../../../../client/platform/web/parentElement'
import { Store } from '../../../../../../client/store'
import { COLOR_NONE } from '../../../../../../client/theme'
import { userSelect } from '../../../../../../client/util/style/userSelect'
import { Pod } from '../../../../../../pod'
import { SharedObjectClient } from '../../../../../../SharedObject'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import { Unlisten } from '../../../../../../types/Unlisten'
import callAll from '../../../../../../util/call/callAll'
import { dragOverTimeListener } from '../../../../../host/component/IconTabs/dragOverTimeListener'
import TextDiv from '../../../../core/component/TextDiv/Component'
import Div from '../../../Div/Component'
import Icon from '../../../Icon/Component'
import DataControl from '../DataControl/Component'
import DBControl from '../DBControl/Component'
import FileControl from '../FileControl/Component'
import GraphControl from '../GraphControl/Component'
import IOTService from '../IOTControl/Component'
import Peer from '../PeerControl/Component'
import StorageService from '../StorageControl/Component'
import VMServiceComponent from '../VMControl/Component'
import Web from '../WebControl/Component'

export interface Props {
  style?: Dict<string>
  keyStyle?: Dict<string>
}

export const TILE_HEIGHT = 81
export const TILE_HEIGHT_PX = `${TILE_HEIGHT}px`
export const COLUMN_COUNT = 3
export const ROW_COUNT = 4
export const VISIBLE_ROW_COUNT = 3

export const CLOUD_WIDTH = 3 * TILE_HEIGHT + 3 + (VISIBLE_ROW_COUNT - 1) * 3
export const CLOUD_HEIGHT = CLOUD_WIDTH

export const DEFAULT_STYLE = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  display: 'flex',
  borderColor: COLOR_NONE,
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '3px',
  width: `${CLOUD_WIDTH}px`,
  height: `${CLOUD_HEIGHT}px`,
  zIndex: `${MAX_Z_INDEX}`,
}

export const ENABLED_SERVICE_NAME = ['graph', 'web', 'vm', 'peer']

const SERVICE = [
  {
    name: 'graph',
    icon: 'save',
    x: 0,
    y: 0,
    Component: GraphControl,
    disabled: false,
  },
  {
    name: 'web',
    icon: 'mouse-pointer-2',
    x: 1,
    y: 0,
    Component: Web,
    disabled: false,
  },
  {
    name: 'chat',
    icon: 'message-square',
    x: 2,
    y: 0,
    Component: FileControl,
    disabled: false,
  },
  {
    name: 'file',
    icon: 'folder',
    x: 0,
    y: 1,
    Component: FileControl,
    disabled: true,
  },
  {
    name: 'peer',
    icon: 'users',
    x: 1,
    y: 1,
    Component: Peer,
    disabled: false,
  },
  {
    name: 'vm',
    icon: 'server',
    x: 2,
    y: 1,
    Component: VMServiceComponent,
    disabled: true,
  },
  {
    name: 'iot',
    icon: 'monitor-speaker',
    x: 0,
    y: 2,
    Component: IOTService,
    disabled: true,
  },
  {
    name: 'key',
    icon: 'key',
    x: 2,
    y: 3,
    Component: DBControl,
    disabled: true,
  },
  {
    name: 'store',
    icon: 'archive',
    x: 1,
    y: 2,
    Component: StorageService,
    disabled: true,
  },
  {
    name: 'kv',
    icon: 'triangle',
    x: 2,
    y: 2,
    Component: DataControl,
    disabled: true,
  },
  {
    name: 'db',
    icon: 'database',
    x: 0,
    y: 3,
    Component: DBControl,
    disabled: true,
  },
  {
    name: 'queue',
    icon: 'layers',
    x: 1,
    y: 3,
    Component: DBControl,
    disabled: true,
  },
]

export default class CloudManager extends Component<HTMLDivElement, Props> {
  private _root: Div
  private _container: Div
  private _list: Div
  private _cloud: Icon

  // private _left_button: Icon

  // private _animating: boolean = false

  private _row: Div[] = []

  private _service: Dict<any> = {}
  private _service_item: Dict<Div> = {}
  private _service_item_icon: Dict<Icon> = {}
  private _service_item_name: Dict<TextDiv> = {}

  private _service_item_comp: Dict<Component> = {}

  private _selected_service: string | null = null

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style, keyStyle } = $props

    const root = new Div(
      {
        className: 'cloud',
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    root.addEventListeners([
      makeShortcutListener([
        {
          combo: 'Escape',
          keydown: this._hide_selected_service,
        },
      ]),
    ])
    this._root = root

    const container = new Div(
      {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          // overflowY: 'auto',
          // overflowX: 'visible',
          willChange: 'opacity',
          transition: `opacity ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    root.registerParentRoot(container)
    this._container = container

    const list = new Div(
      {
        className: 'cloud-list',
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '3px',
          paddingRight: '3px',
          overflow: 'auto',
          willChange: 'transform, opacity',
          transition: `opacity ${ANIMATION_T_S}s linear, gap ${ANIMATION_T_S}s linear`,
          opacity: '1',
        },
        tabIndex: 0,
      },
      this.$system,
      this.$pod
    )
    container.registerParentRoot(list)
    this._list = list

    // TODO
    // recreate this effect

    // const left_button = new Icon({
    //   icon: 'horizontal-rule',
    //   style: {
    //     position: 'absolute',
    //     left: '-18px',
    //     top: '50%',
    //     transform: `translateY(-50%) rotate(90deg)`,
    //     width: '18px',
    //     height: '18px',
    //     cursor: 'pointer',
    //     willChange: 'left, opacity',
    //     transition: `left ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear`,
    //   },
    // })
    // let rotated = false
    // left_button.addEventListener(
    //   makeClickListener({
    //     onClick: () => {
    //       if (this._animating) {
    //         return
    //       }

    //       const animate = (front: Component, back: Component): void => {
    //         this._animating = true

    //         let animation = front.animate(
    //           [
    //             {
    //               opacity: '1',
    //               transform: 'rotateY(0deg)',
    //               pointerEvents: 'none',
    //             },
    //             {
    //               opacity: '0',
    //               transform: 'rotateY(90deg)',
    //             },
    //           ],
    //           {
    //             duration: ANIMATION_T_MS,
    //             fill: 'forwards',
    //             easing: 'ease-out',
    //           }
    //         )

    //         animation.addEventListener('finish', () => {
    //           animation = back.animate(
    //             [
    //               {
    //                 opacity: '0',
    //                 transform: 'rotateY(270deg)',
    //               },
    //               {
    //                 opacity: '1',
    //                 pointerEvents: 'all',
    //                 transform: 'rotateY(360deg)',
    //               },
    //             ],
    //             {
    //               duration: ANIMATION_T_MS,
    //               fill: 'forwards',
    //               easing: 'ease-out',
    //             }
    //           )

    //           animation.addEventListener('finish', () => {
    //             this._animating = false
    //           })
    //         })
    //       }

    //       if (rotated) {
    //         animate(this._user, this._list)
    //       } else {
    //         animate(this._list, this._user)
    //       }

    //       rotated = !rotated
    //     },
    //   })
    // )
    // this._left_button = left_button

    let row: Div
    let i = 0
    let l = 0

    for (const service of SERVICE) {
      const { name, icon, disabled, Component } = service
      this._service[name] = service

      if (i % COLUMN_COUNT === 0) {
        row = new Div(
          {
            style: {
              transition: `height ${ANIMATION_T_S}s linear, gap ${ANIMATION_T_S}s linear`,
              willChange: 'height, gap',
              width: '100%',
              height: TILE_HEIGHT_PX,
              gap: '3px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            },
          },
          this.$system,
          this.$pod
        )
        l++
        this._row.push(row)
        list.appendChild(row)
      }

      const service_icon = new Icon(
        {
          icon,
          style: {
            width: '30px',
            height: '30px',
            margin: '6px',
            marginTop: '6px',
            cursor: 'pointer',
            willChange: 'width, opacity, margin',
            transition: `width ${ANIMATION_T_S}s linear, height ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear, margin ${ANIMATION_T_S}s linear, marginTop ${ANIMATION_T_S}s linear`,
            ...userSelect('none'),
          },
        },
        this.$system,
        this.$pod
      )
      this._service_item_icon[name] = service_icon

      const service_name = new TextDiv(
        {
          value: name.toUpperCase(),
          style: {
            height: 'auto',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '3px',
            marginTop: '3px',
            fontWeight: 'bold',
            willChange: 'font-size, opacity, margin-top, margin-right',
            transition: `font-size ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear, margin-top ${ANIMATION_T_S}s linear, margin-bottom ${ANIMATION_T_S}s linear`,
            ...userSelect('none'),
          },
        },
        this.$system,
        this.$pod
      )
      this._service_item_name[name] = service_name

      const service_comp = new Component(
        {
          style: {
            // display: 'none',
            transition: `opacity ${ANIMATION_T_S}s linear`,
            willChange: `opacity`,
            position: 'absolute',
            top: '0',
            left: '0',
            opacity: '0',
            pointerEvents: 'none',
          },
        },
        this.$system,
        this.$pod
      )
      this._service_item_comp[name] = service_comp

      const service_item = new Div(
        {
          style: {
            transition: `width ${ANIMATION_T_S}s linear, height ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear, padding ${ANIMATION_T_S}s linear, border-width ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear, padding ${ANIMATION_T_S}s linear`,
            willChange: 'width, height, padding, border-width, opacity',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: TILE_HEIGHT_PX,
            height: 'calc(100%)',
            borderStyle: 'solid',
            borderColor: 'currentColor',
            borderWidth: '1px',
            borderRadius: '3px',
            padding: '6px',
            opacity: disabled ? '0.5' : '1',
            pointerEvents: disabled ? 'none' : 'inherit',
            // marginLeft: '3px',
            // marginRight: '3px',
            overflow: 'hidden',
            cursor: 'pointer',
            ...userSelect('none'),
            ...keyStyle,
          },
          tabIndex: i + 1,
        },
        this.$system,
        this.$pod
      )
      service_item.appendChild(service_icon)
      service_item.appendChild(service_name)
      service_item.appendChild(service_comp)
      service_item.addEventListener(
        makeClickListener({
          onClick: () => {
            this._on_item_click(name)
          },
        })
      )
      service_item.$element.setAttribute('dropTarget', 'true')
      dragOverTimeListener(service_item, 500, () => {
        if (!this._selected_service) {
          this._show_service(name)
        }
      })
      row.appendChild(service_item)
      this._service_item[name] = service_item

      i++
    }

    const $element = parentElement($system)

    this.$element = $element
    this.$subComponent = {
      root,
      container,
      list,
    }
    this.$unbundled = false

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      // TODO
    } else if (prop === 'keyStyle') {
      current = current || {}
      for (const service_item_id in this._service_item) {
        const service_item = this._service_item[service_item_id]
        mergeStyle(service_item, current)
      }
    }
  }

  private _on_item_click = (name: string) => {
    this._show_service(name)
  }

  private _hide_selected_service = (): void => {
    if (this._selected_service) {
      this._hide_service(this._selected_service)
    }
  }

  private _show_service = (name: string) => {
    if (this._selected_service !== name) {
      this._selected_service = name

      const service = this._service[name]
      const service_item = this._service_item[name]
      const service_component = this._service_item_comp[name]
      const service_item_icon = this._service_item_icon[name]
      const service_item_name = this._service_item_name[name]

      const { x, y } = service

      const scroll_top = this._list.$element.scrollTop

      mergeStyle(this._list, {
        gap: '0px',
      })

      const line = this._row[y]

      mergeStyle(line, {
        height: '100%',
        gap: '0px',
      })

      for (let i = y + 1; i < y + ROW_COUNT; i++) {
        const j = i % ROW_COUNT
        const other_row = this._row[j]

        mergeStyle(other_row, {
          height: '0px',
          gap: '0px',
        })
      }

      mergeStyle(service_item, {
        width: '100%',
        pointerEvents: 'none',
        cursor: 'inherit',
      })

      mergeStyle(service_item_name, {
        fontSize: '42px',
        opacity: '0.05',
        // opacity: '0',
      })

      mergeStyle(service_item_icon, {
        width: '90px',
        height: '90px',
        marginTop: '30px',
        opacity: '0.05',
        // opacity: '0',
      })

      for (const s of SERVICE) {
        const { name: n, x: nx, y: ny } = s

        const s_item = this._service_item[n]
        const s_item_name = this._service_item_name[n]
        const s_item_icon = this._service_item_icon[n]

        if (name !== n) {
          const same_line = ny === y
          const same_column = nx === x

          mergeStyle(s_item, {
            width: same_line ? '0px' : same_column ? '100%' : '0px',
            padding: '0px',
            borderWidth: '0px',
            opacity: '0',
          })

          mergeStyle(s_item_name, {
            marginBottom: '0px',
            fontSize: '0px',
          })

          mergeStyle(s_item_icon, {
            margin: '0px',
            width: '0px',
            height: '0px',
          })
        }
      }

      mergeStyle(service_component, {
        display: 'flex',
      })
      setTimeout(() => {
        mergeStyle(service_component, {
          opacity: '1',
          pointerEvents: 'all',
        })
      }, 0)

      this.dispatchEvent('_iounapp_control_in')
    }
  }

  private _hide_service = (name: string) => {
    const service = this._service[name]

    const { disabled } = service

    const service_item = this._service_item[name]
    const service_component = this._service_item_comp[name]
    const service_item_icon = this._service_item_icon[name]
    const service_item_name = this._service_item_name[name]

    const { y } = service

    mergeStyle(this._list, {
      gap: '3px',
    })

    const line = this._row[y]
    mergeStyle(line, {
      height: TILE_HEIGHT_PX,
      gap: '3px',
    })

    for (let i = y + 1; i < y + ROW_COUNT; i++) {
      const j = i % ROW_COUNT
      const other_row = this._row[j]
      mergeStyle(other_row, {
        height: TILE_HEIGHT_PX,
        gap: '3px',
      })
    }

    mergeStyle(service_item, {
      width: TILE_HEIGHT_PX,
      opacity: disabled ? '0.5' : '1',
      pointerEvents: disabled ? 'none' : 'inherit',
      cursor: 'pointer',
    })

    mergeStyle(service_item_name, {
      fontSize: '14px',
      opacity: '1',
    })

    mergeStyle(service_item_icon, {
      width: '30px',
      height: '30px',
      marginTop: '6px',
      opacity: '1',
    })

    this._selected_service = null

    for (const s of SERVICE) {
      const { name: n, x: n_x, y: n_y, disabled } = s

      const s_item = this._service_item[n]
      const s_item_name = this._service_item_name[n]
      const s_item_icon = this._service_item_icon[n]

      if (name !== n) {
        mergeStyle(s_item, {
          width: TILE_HEIGHT_PX,
          padding: '6px',
          borderWidth: '1px',
          opacity: disabled ? '0.5' : '1',
          pointerEvents: disabled ? 'none' : 'inherit',
        })

        mergeStyle(s_item_name, {
          marginBottom: '3px',
          marginTop: '3px',
          fontSize: '14px',
        })

        mergeStyle(s_item_icon, {
          margin: '6px',
          width: '30px',
          height: '30px',
        })
      }
    }

    mergeStyle(service_component, {
      opacity: '0',
      pointerEvents: 'none',
    })

    setTimeout(() => {
      mergeStyle(service_component, {
        display: 'none',
      })
    }, 1500 * ANIMATION_T_S)

    if (this.$parent) {
      this.dispatchEvent('_iounapp_control_out')
    }
  }

  private _context_unlisten: Unlisten
  private _auth_unlisten: Unlisten

  private _fetched: boolean = false

  private _fetch_data = (): void => {
    const {
      api: {
        host: { fetch },
      },
    } = this.$system

    this._fetched = true

    fetch({})
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('could not fetch')
        }
      })
      .then((data) => {
        // console.log(data)
        for (const service in data) {
          const _data = data[service]
          const store_client = this._store_client[service]
          const all_user_promise = store_client['user'].proxy.reset(
            _data['user']
          )
          const all_shared_promise = store_client['shared'].proxy.reset(
            _data['shared']
          )
          return Promise.all([all_user_promise, all_shared_promise])
        }
      })
  }

  private _store_client: Dict<{
    user: SharedObjectClient<Store<any>, {}>
    shared: SharedObjectClient<Store<any>, {}>
  }> = {}

  onMount() {
    const {
      api: { service },
    } = this.$system

    this._context_unlisten = addListener(
      this.$context,
      makeCustomListener('_iounapp_control_back', () => {
        this._hide_selected_service()
      })
    )

    for (const name of ENABLED_SERVICE_NAME) {
      const store = service[name]()

      this._store_client[name] = {
        user: store['cloud'].connect(),
        shared: store['shared'].connect(),
      }
    }

    if (!this._fetched) {
      if (isSignedIn(this.$system)) {
        this._fetch_data()
      }
    }

    this._auth_unlisten = callAll([
      addSignInListener(this.$system, () => {
        this._fetch_data()
      }),
      addSignOutListener(this.$system, () => {
        // TODO
      }),
    ])
  }

  onUnmount() {
    this._context_unlisten()
  }
}
