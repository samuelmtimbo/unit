import { addListeners } from '../../../../../../client/addListener'
import { Component, findRef } from '../../../../../../client/component'
import mergeStyle from '../../../../../../client/component/mergeStyle'
import { dragAndDrop } from '../../../../../../client/dnd'
import { makeChangeListener } from '../../../../../../client/event/change'
import { makeCustomListener } from '../../../../../../client/event/custom'
import { makeBlurListener } from '../../../../../../client/event/focus/blur'
import { makeFocusListener } from '../../../../../../client/event/focus/focus'
import { makeInputListener } from '../../../../../../client/event/input'
import { makeClickListener } from '../../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../../client/event/pointer/pointercancel'
import { makePointerEnterListener } from '../../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../../client/event/pointer/pointerleave'
import { SOCKET_CLOUD_EMITTER } from '../../../../../../client/host/socket'
import { DEFAULT_SERVICE_STORE_TYPES } from '../../../../../../client/host/store'
import { MAX_Z_INDEX } from '../../../../../../client/MAX_Z_INDEX'
import { Mode } from '../../../../../../client/mode'
import parentElement from '../../../../../../client/platform/web/parentElement'
import { Store } from '../../../../../../client/store'
import { getThemeModeColor } from '../../../../../../client/theme'
import { userSelect } from '../../../../../../client/util/style/userSelect'
import { Pod } from '../../../../../../pod'
import { SharedObjectClient } from '../../../../../../SharedObject'
import { emptyBundleSpec } from '../../../../../../spec/emptyBundleSpec'
import { emptyGraphSpec } from '../../../../../../spec/emptySpec'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import { Unlisten } from '../../../../../../types/Unlisten'
import { uuid } from '../../../../../../util/id'
import { clone } from '../../../../../../util/object'
import { getTextWidth } from '../../../../../../util/text/getPlainTextWidth'
import forEachKeyValue from '../../../../../core/object/ForEachKeyValue/f'
import CloudTabs from '../../../../../host/component/IconTabs/Component'
import { BundleSpec } from '../../../../method/process/BundleSpec'
import Div from '../../../Div/Component'
import TextInput from '../../../value/TextInput/Component'
import { enable_mode_keyboard } from '../../Graph/Component'
import Minigraph from '../../Minigraph/Component'
import Modes from '../../Modes/Component'

export interface Props {
  style?: Dict<string>
}

export const TABS = ['local', 'user', 'shared']

export const TAB_TO_ICON: Dict<string> = {
  local: 'browser',
  user: 'globe-americas',
  shared: 'share-alt',
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
}

export const SPEC_ITEM_WIDTH = 234
export const SPEC_ITEM_HEIGHT = 81

// RETURN
let channel: BroadcastChannel | null = null
if (globalThis.BroadcastChannel) {
  channel = new BroadcastChannel('graph')
}

export default class GraphControl extends Component<HTMLDivElement, Props> {
  private _root: Div

  private _tabs: CloudTabs

  private _graph_mode: Mode = 'none'
  private _graph_search_hidden: boolean = true

  private _modes: Modes | null = null

  private _hovered_spec_item: Div | null = null

  private _prevent_pointer_enter: boolean = false

  private _editing_name_spec_id: string | null = null

  private _spec_item: {
    local: Dict<Div>
    user: Dict<Div>
    shared: Dict<Div>
  } = {
    local: {},
    user: {},
    shared: {},
  }

  private _spec_item_minigraph: {
    local: Dict<Div>
    user: Dict<Div>
    shared: Dict<Div>
  } = {
    local: {},
    user: {},
    shared: {},
  }

  private _new_spec_item: Div | null = null

  private _unlisten_mode_keyboard: Unlisten | undefined = undefined

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const root = new Div(
      {
        style: {
          position: 'absolute',
        },
        tabIndex: 0,
      },
      this.$system,
      this.$pod
    )
    this._root = root

    const tabs = new CloudTabs(
      {
        style,
      },
      this.$system,
      this.$pod
    )
    this._tabs = tabs

    TABS.forEach((tab) => {
      const list = tabs._list[tab]
      list.$element.setAttribute('dropTarget', 'true')
      list.$element.addEventListener(
        '_dragenter',
        ({ detail: { pointerId } }: CustomEvent<PointerEvent>) => {
          // console.log('_dragenter')
          this._add_new_spec_item(this._graph_mode, emptyBundleSpec)
        }
      )
      list.$element.addEventListener(
        '_dragleave',
        ({ detail: { pointerId } }: CustomEvent<PointerEvent>) => {
          // console.log('_dragleave')
          this._remove_new_spec_item()
        }
      )
      list.$element.addEventListener(
        '_dragdrop',
        ({ detail: { pointerId, pointerType } }: CustomEvent<PointerEvent>) => {
          if (this._new_spec_item) {
            const { $theme } = this.$context
            this._remove_new_spec_item()
            const spec_id = uuid()
            const bundle = this.$system.cache.dragAndDrop[pointerId]
            if (pointerType === 'mouse') {
              this._add_spec(tab, spec_id, bundle, {
                color: getThemeModeColor(
                  $theme,
                  this._graph_mode,
                  'currentColor'
                ),
              })
              this._hovered_spec_item = this._spec_item[tab][spec_id]
            } else {
              this._add_spec(tab, spec_id, bundle, {})
            }

            this.dispatchEvent('dragdropaccept')
          }
        }
      )
      // list.$element.addEventListener(
      //   '_dragover',
      //   ({ detail: { pointerId } }: CustomEvent<PointerEvent>) => {}
      // )
      // list.$element.addEventListener('drop', (event: DragEvent) => {
      //   const { dataTransfer } = event
      //   if (dataTransfer) {
      //     const { items } = dataTransfer
      //     for (let i = 0; i < items.length; i++) {
      //       const item = items[i]
      //       const { type } = item
      //       if (type.startsWith('__unit__/__graph__')) {
      //         const data = dataTransfer.getData(type)
      //         if (data) {
      //           // const { clientX, clientY } = event
      //           const spec_id = uuid()
      //           const spec = JSON.parse(data)
      //           this._add_spec(tab, spec_id, spec, {})
      //         }
      //       }
      //     }
      //   }
      // })
      // list.$element.addEventListener('dragenter', event => {
      //   // console.log('dragenter')
      //   event.preventDefault()
      // })

      // list.$element.addEventListener('dragover', event => {
      //   // console.log('dragover')
      //   event.preventDefault()
      // })
    })
    root.registerParentRoot(tabs)

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = tabs.$slot
    this.$slotChildren = {
      local: [],
      user: [],
      shared: [],
    }
    this.$subComponent = {
      root,
      tabs,
    }
    this.$unbundled = false

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._tabs.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  private _client: Dict<
    SharedObjectClient<Store<BundleSpec>, { reset; add; put; delete }>
  > = {}

  private _render_spec_item = (
    tab: string,
    bundle: BundleSpec,
    id: string,
    style: Dict<string> = {}
  ): Div => {
    const { $theme } = this.$context

    const { spec: spec } = bundle

    const { name } = spec

    const spec_item_screen_minigraph = new Minigraph(
      {
        width: SPEC_ITEM_WIDTH,
        height: SPEC_ITEM_HEIGHT,
        bundle: bundle,
      },
      this.$system,
      this.$pod
    )
    this._spec_item_minigraph[tab][id] = spec_item_screen_minigraph

    const spec_item_screen = new Div(
      {
        style: {
          position: 'relative',
          height: `${SPEC_ITEM_HEIGHT}px`,
          display: 'flex',
          justifyContent: 'center',
        },
      },
      this.$system,
      this.$pod
    )
    spec_item_screen.appendChild(spec_item_screen_minigraph)

    const refresh_spec_item_name_width = (value: string) => {
      const name_width = getTextWidth(value, 15, SPEC_ITEM_WIDTH)
      spec_item_name.$element.style.width = `${name_width + 4}px`
    }

    const display_name = name || 'untitled'

    const spec_item_name = new TextInput(
      {
        value: display_name,
        style: {
          fontSize: '15px',
          height: '18px',
          textAlign: 'center',
          fontWeight: '600',
          marginTop: '3px',
          marginBottom: '3px',
          maxWidth: `${SPEC_ITEM_WIDTH}px`,
          ...userSelect('none'),
        },
      },
      this.$system,
      this.$pod
    )
    spec_item_name.addEventListeners([
      makeInputListener((value) => {
        refresh_spec_item_name_width(value)
      }),
      makeChangeListener((value) => {
        if (value.length > 0) {
          const { proxy } = this._client[tab]
          proxy.put(id, { ...bundle, spec: { ...spec, name: value } })
          if (channel) {
            channel.postMessage({
              type: tab,
              data: {
                type: tab,
                data: { type: 'put', data: { id, data: bundle } },
              },
            })
          }
        } else {
          const value = spec.name || 'untitled'
          spec_item_name.setProp('value', value)
          refresh_spec_item_name_width(value)
        }
      }),
      makeFocusListener(() => {
        this._editing_name_spec_id = id
        this._disable_modes()
      }),
      makeBlurListener(() => {
        this._editing_name_spec_id = null
        this._enable_modes()
      }),
    ])
    refresh_spec_item_name_width(display_name)

    const spec_item = new Div(
      {
        style: {
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    spec_item.appendChild(spec_item_screen)
    spec_item.appendChild(spec_item_name)
    spec_item.addEventListener(
      makePointerEnterListener(({ pointerId }) => {
        // console.log('pointerenter')
        if (!this.$system.cache.dragAndDrop[pointerId]) {
          if (this._prevent_pointer_enter) {
            this._prevent_pointer_enter = false
            return
          }
          this._hovered_spec_item = spec_item
          mergeStyle(spec_item, {
            color: getThemeModeColor($theme, this._graph_mode, 'currentColor'),
          })
        }
      })
    )
    const reset_color = () => {
      if (spec_item !== this._new_spec_item) {
        this._hovered_spec_item = null
        mergeStyle(spec_item, {
          color: 'currentColor',
        })
      }
    }
    spec_item.addEventListener(makePointerLeaveListener(reset_color))
    spec_item.addEventListener(makePointerCancelListener(reset_color))
    spec_item.addEventListener(
      makeClickListener({
        onClick: () => {
          switch (this._graph_mode) {
            case 'remove':
              this._remove_spec(tab, id)
              break
            case 'add':
            case 'data':
              if (this._new_spec_item === spec_item) {
                this._store_add_spec(this._tabs.section, id, bundle)
                mergeStyle(this._new_spec_item, {
                  opacity: '1',
                })
                this._new_spec_item = null
              }
          }
        },
        onLongPress: (event, _event: PointerEvent) => {
          if (
            this._graph_mode === 'add' ||
            this._graph_mode === 'change' ||
            this._graph_mode === 'remove' ||
            this._graph_mode === 'data'
          ) {
            const { $theme, $color } = this.$context

            const {
              method: { showLongPress },
            } = this.$system

            const { screenX, screenY } = event

            showLongPress(screenX, screenY, {
              stroke: getThemeModeColor($theme, this._graph_mode, $color),
            })

            const color = getThemeModeColor($theme, this._graph_mode, $color)

            const svg =
              spec_item_screen_minigraph._minimap._map_el.$element.cloneNode(
                true
              ) as SVGSVGElement

            const width = SPEC_ITEM_WIDTH
            const height = SPEC_ITEM_HEIGHT

            svg.setAttribute('stroke', color)

            svg.style.color = color
            svg.style.position = 'fixed'
            svg.style.zIndex = `${MAX_Z_INDEX}`
            svg.style.width = `${width}px`
            svg.style.height = `${height}px`
            svg.style.pointerEvents = 'none'

            if (
              // this._graph_mode === 'none' ||
              this._graph_mode === 'remove' ||
              this._graph_mode === 'change'
            ) {
              this._prevent_pointer_enter = true
              this._remove_spec(tab, id)
            }

            const { units } = spec

            for (const unit_id in units) {
              const { x, y } = spec_item_screen_minigraph._nodes[unit_id]
              units[unit_id].metadata = units[unit_id].metadata || {}
              units[unit_id].metadata.position = { x, y }
            }

            const { pointerId, clientX, clientY } = _event

            dragAndDrop(
              this.$system,
              svg,
              pointerId,
              clientX,
              clientY,
              width,
              height,
              bundle
            )

            const new_spec = clone(emptyGraphSpec)
            new_spec.name = spec.name
            this._add_new_spec_item(this._graph_mode, {
              spec: new_spec,
              specs: {},
            })
          }
        },
      })
    )

    return spec_item
  }

  private _enable_modes = (): void => {
    const modes = findRef(this, 'modes') as Modes | null

    this._unlisten_mode_keyboard = enable_mode_keyboard(this, (mode: Mode) => {
      if (modes) {
        modes.setProp('mode', mode)
      }
    })
  }

  private _disable_modes = (): void => {
    if (this._unlisten_mode_keyboard) {
      this._unlisten_mode_keyboard()
      this._unlisten_mode_keyboard = undefined
    }
  }

  private _add_spec = (
    tab_id: string,
    spec_id: string,
    bundle: BundleSpec,
    style: Dict<string> = {}
  ) => {
    this._store_add_spec(tab_id, spec_id, bundle)
    this._ui_add_spec(tab_id, spec_id, bundle, style)
  }

  private _store_add_spec = (tab: string, id: string, bundle: BundleSpec) => {
    const { proxy } = this._client[tab]
    proxy.add(id, bundle)
    if (channel) {
      channel.postMessage({
        type: tab,
        data: { type: 'add', data: { id, data: bundle } },
      })
    }
  }

  private _ui_add_spec = (
    tab_id: string,
    spec_id: string,
    bundle: BundleSpec,
    style: Dict<string> = {}
  ) => {
    const spec_item = this._render_spec_item(tab_id, bundle, spec_id, style)
    this._spec_item[tab_id][spec_id] = spec_item
    this.appendChild(spec_item, tab_id)
  }

  private _remove_spec = (tab_id: string, spec_id: string) => {
    this._ui_delete_spec(tab_id, spec_id)
    this._store_remove_spec(tab_id, spec_id)
  }

  private _store_remove_spec = (tab: string, id: string): void => {
    const { proxy } = this._client[tab]
    proxy.delete(id)
    if (channel) {
      channel.postMessage({ type: tab, data: { type: 'delete', data: { id } } })
    }
  }

  private _ui_delete_spec = (tab_id: string, spec_id: string) => {
    const spec_item = this._spec_item[tab_id][spec_id]
    delete this._spec_item[tab_id][spec_id]
    this.removeChild(spec_item)
  }

  private _on_graph_mode = ({ mode }) => {
    const { $theme } = this.$context

    if (this._graph_search_hidden) {
      // if (
      //   (this._graph_mode !== 'add' && mode === 'add') ||
      //   (this._graph_mode !== 'data' && mode === 'data')
      // ) {
      //   this._remove_new_spec_item()
      //   this._add_new_spec_item(mode)
      // } else if (
      //   (this._graph_mode === 'add' && mode !== 'add') ||
      //   (this._graph_mode === 'data' && mode !== 'data')
      // ) {
      //   this._remove_new_spec_item()
      // }
    }

    if (
      mode === 'add' ||
      mode === 'remove' ||
      mode === 'change' ||
      mode === 'data'
    ) {
      TABS.forEach((tab) => {
        const list = this._tabs._list[tab]
        mergeStyle(list, {
          touchAction: 'none',
        })
      })
    } else {
      TABS.forEach((tab) => {
        const list = this._tabs._list[tab]
        mergeStyle(list, {
          touchAction: 'auto',
        })
      })
    }

    this._graph_mode = mode

    if (this._hovered_spec_item) {
      mergeStyle(this._hovered_spec_item, {
        color: getThemeModeColor($theme, this._graph_mode, 'currentColor'),
      })
    }
  }

  private _add_new_spec_item = (mode: Mode, bundle: BundleSpec) => {
    // console.log('Save', '_add_new_spec_item')
    if (this._new_spec_item) {
      return
    }
    const { $theme } = this.$context

    const { section } = this._tabs

    const spec_id = uuid()
    const spec_item = this._render_spec_item(
      this._tabs.section,
      bundle,
      spec_id
    )
    mergeStyle(spec_item, {
      color: getThemeModeColor($theme, mode, 'currentColor'),
      // opacity: '0.5',
    })
    this.appendChild(spec_item, section)
    // Safari will not scroll if scrollTop is too high, so try scrollHeight
    this._tabs._list[section].$element.scrollTop =
      this._tabs._list[section].$element.scrollHeight
    this._new_spec_item = spec_item
  }

  private _remove_new_spec_item = () => {
    // console.log('Save', '_remove_new_spec_item')
    const { section } = this._tabs

    if (this._new_spec_item) {
      this.removeChild(this._new_spec_item)
      this._new_spec_item = null
    }
  }

  private _on_graph_search_hidden = (): void => {
    this._graph_search_hidden = true

    if (this._graph_mode === 'add' || this._graph_mode === 'data') {
      // this._add_new_spec_item(this._graph_mode)
    }
  }

  private _context_unlisten: Unlisten

  private _listen_store = (tab: string) => {
    const { emitter } = this._client[tab]
    emitter.addListener('reset', (bundles: Dict<BundleSpec>) => {
      this.removeChildren()
      forEachKeyValue(bundles, (bundle, bundle_id) => {
        this._ui_add_spec(tab, bundle_id, bundle)
      })
    })
    emitter.addListener('add', (bundle_id, bundle: BundleSpec) => {
      this._ui_add_spec(tab, bundle_id, bundle)
    })
    emitter.addListener('put', (bundle_id, bundle: BundleSpec) => {
      // TODO
      this._ui_delete_spec(tab, bundle_id)
      this._ui_add_spec(tab, bundle_id, bundle)
    })
    emitter.addListener('delete', (bundle_id) => {
      this._ui_delete_spec(tab, bundle_id)
    })
  }

  private _fill_tab_list = (tab: string) => {
    const { proxy } = this._client[tab]
    proxy
      .getAll()
      .then((bundles) => {
        forEachKeyValue(bundles, (spec, spec_id) => {
          this._ui_add_spec(tab, spec_id, spec)
        })
      })
      .catch((err) => {
        // TODO
        console.log('err', err)
      })
  }

  onMount(): void {
    const {
      api: {
        service: { graph: graph_init },
      },
    } = this.$system

    const graph_service = graph_init({})

    this._enable_modes()

    const graphEnterModeListener = makeCustomListener(
      '_graph_mode',
      this._on_graph_mode,
      true
    )
    this._context_unlisten = addListeners(this.$context, [
      graphEnterModeListener,
    ])

    for (const type of DEFAULT_SERVICE_STORE_TYPES) {
      const store = graph_service[type]

      this._client[type] = store.connect()

      this._fill_tab_list(type)

      this._listen_store(type)
    }

    const on_message = (tab: string, data) => {
      const { type, data: _data } = data

      switch (type) {
        case 'add':
          {
            const { id, data } = _data
            this._ui_add_spec(tab, id, data)
          }
          break
        case 'delete':
          {
            const { id } = _data
            this._ui_delete_spec(tab, id)
          }
          break
        case 'put':
          {
            const { id, data } = _data
            // TODO put
            this._ui_delete_spec(tab, id)
            this._ui_add_spec(tab, id, data)
          }
          break
      }
    }

    if (channel) {
      channel.addEventListener('message', (event) => {
        const { source, data } = event
        if (source !== window) {
          const { type, data: _data } = data
          on_message(type, _data)
        }
      })
    }

    if (SOCKET_CLOUD_EMITTER) {
      SOCKET_CLOUD_EMITTER.addListener('graph', (data) => {
        const { type, data: _data } = data
        on_message(type, _data)
      })
    }
  }

  onUnmount() {
    this._disable_modes()
    this._context_unlisten()
  }
}
