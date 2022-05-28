import { addListeners } from '../../../../../client/addListener'
import { Component } from '../../../../../client/component'
import {
  default as mergePropStyle,
  default as mergeStyle,
} from '../../../../../client/component/mergeStyle'
import { startDragAndDrop as startDragAndDrop } from '../../../../../client/dnd'
import { makeChangeListener } from '../../../../../client/event/change'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeDragDropListener } from '../../../../../client/event/drag/dragdrop'
import { makeDragEnterListener } from '../../../../../client/event/drag/dragenter'
import { makeDragLeaveListener } from '../../../../../client/event/drag/dragleave'
import { makeDragOverListener } from '../../../../../client/event/drag/dragover'
import { makeBlurListener } from '../../../../../client/event/focus/blur'
import { makeFocusListener } from '../../../../../client/event/focus/focus'
import { makeInputListener } from '../../../../../client/event/input'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { findRef } from '../../../../../client/findRef'
import { enableModeKeyboard } from '../../../../../client/graph/shortcut/modes'
import { MAX_Z_INDEX } from '../../../../../client/MAX_Z_INDEX'
import { Mode } from '../../../../../client/mode'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Store } from '../../../../../client/store'
import {
  getThemeModeColor,
  setAlpha,
  themeBackgroundColor,
} from '../../../../../client/theme'
import { addVector } from '../../../../../client/util/geometry'
import { getRelativePosition } from '../../../../../client/util/style/getPosition'
import { Pod } from '../../../../../pod'
import { SharedObjectClient } from '../../../../../SharedObject'
import { emptyBundleSpec } from '../../../../../spec/emptyBundleSpec'
import { emptyGraphSpec } from '../../../../../spec/emptySpec'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { Dict } from '../../../../../types/Dict'
import { IHTMLDivElement } from '../../../../../types/global/dom'
import { Unlisten } from '../../../../../types/Unlisten'
import callAll from '../../../../../util/call/callAll'
import { uuid } from '../../../../../util/id'
import { clone } from '../../../../../util/object'
import { getTextWidth } from '../../../../../util/text/getPlainTextWidth'
import forEachKeyValue from '../../../../core/object/ForEachKeyValue/f'
import Div from '../../Div/Component'
import TextInput from '../../value/TextInput/Component'
import { UNIT_NAME_MAX_SIZE } from '../Editor/Component'
import Minigraph from '../Minigraph/Component'
import Modes from '../Modes/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
}

export const SPEC_ITEM_MINIGRAPH_WIDTH = 234
export const SPEC_ITEM_MINIGRAPH_HEIGHT = 81

export const SPEC_ITEM_NAME_HEIGHT = 18

export const SPEC_ITEM_HEIGHT =
  SPEC_ITEM_MINIGRAPH_HEIGHT + SPEC_ITEM_NAME_HEIGHT

// RETURN
let channel: BroadcastChannel | null = null
if (globalThis.BroadcastChannel) {
  channel = new BroadcastChannel('graph')
}

export default class SaveControl extends Component<IHTMLDivElement, Props> {
  private _root: Div

  private _mode: Mode = 'none'
  private _graph_search_hidden: boolean = true

  private _modes: Modes | null = null

  private _hovered_spec_id: string | null = null
  private _hovered_spec_item: Div | null = null

  private _prevent_pointer_enter: boolean = false

  private _editing_name_spec_id: string | null = null

  private _spec_item: Dict<Div> = {}
  private _spec_item_name: Dict<TextInput> = {}
  private _spec_item_minigraph: Dict<Minigraph> = {}
  private _spec_item_unlisten: Dict<Unlisten> = {}
  private _spec_item_bundle: Dict<BundleSpec> = {
    local: {},
    user: {},
    shared: {},
  }

  private _new_spec_item: Div | null = null
  private _new_spec_item_spec_id: string

  private _unlisten_mode_keyboard: Unlisten | undefined = undefined

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { theme } = $system

    const { style } = $props

    const root = new Div(
      {
        className: 'save-control-root',
        style: {
          position: 'absolute',
          border: '1px solid currentColor',
          borderRadius: '3px',
          padding: '9px',
          overflow: 'auto',
          background: setAlpha(themeBackgroundColor(theme), 0.75),
          ...style,
        },
        tabIndex: 0,
      },
      this.$system,
      this.$pod
    )
    this._root = root

    const _relative_i = (clientY: number): number => {
      const list_relative_position = getRelativePosition(
        this._root.$element,
        this.$context.$element
      )

      const list_position = addVector(
        { x: this.$context.$x, y: this.$context.$y },
        list_relative_position
      )

      const dy = clientY - list_position.y

      const i = Math.floor(dy / SPEC_ITEM_HEIGHT)

      return i
    }

    // RETURN
    this._root.$element.setAttribute('dropTarget', 'true')

    this._root.addEventListeners([
      makeDragEnterListener((event) => {
        const { clientY } = event

        if (
          this._mode === 'add' ||
          this._mode === 'data' ||
          this._mode === 'remove'
        ) {
          const i = _relative_i(clientY)

          this._add_new_spec_item(emptyBundleSpec({ spec: { name: '' } }), i)
        }
      }),
      makeDragOverListener((event) => {
        const { clientY } = event

        if (
          this._mode === 'add' ||
          this._mode === 'data' ||
          this._mode === 'remove'
        ) {
          const i = _relative_i(clientY)

          this._move_new_spec_item(i)
        }
      }),
      makeDragDropListener((event) => {
        const { pointerType, data: bundle } = event

        let spec_id: string

        const drop_new_spec_item = () => {
          if (this._new_spec_item) {
            spec_id = this._new_spec_item_spec_id

            this._swap_new_spec_item(bundle)

            this._store_add_spec(spec_id, bundle)
          }
        }

        let drag_back_bundle: BundleSpec = {}

        if (
          this._mode === 'remove' ||
          this._mode === 'change' ||
          this._mode === 'add' ||
          this._mode === 'data'
        ) {
          drop_new_spec_item()
        }

        if (spec_id) {
          if (pointerType === 'mouse') {
            this._hover_item(spec_id)
          }

          // if (this._mode === 'change') {
          // }
        }

        this._root.dispatchEvent('dragback', drag_back_bundle)
      }),
      makeDragLeaveListener((event) => {
        if (this._mode === 'add' || this._mode === 'remove') {
          if (this._new_spec_item) {
            this._remove_new_spec_item()
          }
        }
      }),
    ])

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = {
      default: root,
    }
    this.$subComponent = {
      root,
    }
    this.$unbundled = false

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  private _client: SharedObjectClient<
    Store<BundleSpec>,
    { reset; add; put; delete }
  >

  private _render_spec_item = (
    bundle: BundleSpec,
    spec_id: string,
    style: Dict<string> = {}
  ): Div => {
    const { $theme } = this.$context

    const { spec } = bundle

    const { name } = spec

    const spec_item_screen_minigraph = new Minigraph(
      {
        width: SPEC_ITEM_MINIGRAPH_WIDTH,
        height: SPEC_ITEM_MINIGRAPH_HEIGHT,
        bundle,
      },
      this.$system,
      this.$pod
    )
    this._spec_item_minigraph[spec_id] = spec_item_screen_minigraph
    this._spec_item_bundle[spec_id] = bundle

    const spec_item_screen = new Div(
      {
        style: {
          position: 'relative',
          height: `${SPEC_ITEM_MINIGRAPH_HEIGHT}px`,
          display: 'flex',
          justifyContent: 'center',
        },
      },
      this.$system,
      this.$pod
    )
    spec_item_screen.appendChild(spec_item_screen_minigraph)

    const refresh_spec_item_name_width = (value: string) => {
      const name_width = getTextWidth(value, 15, UNIT_NAME_MAX_SIZE)

      mergePropStyle(spec_item_name, { width: `${name_width + 4}px` })
    }

    const display_name = name || ''

    const spec_item_name = new TextInput(
      {
        value: display_name,
        style: {
          fontSize: '15px',
          height: `${SPEC_ITEM_NAME_HEIGHT}px`,
          width: `${getTextWidth(display_name, 15, UNIT_NAME_MAX_SIZE)}`,
          textAlign: 'center',
          fontWeight: '600',
          marginTop: '3px',
          marginBottom: '3px',
          maxWidth: `${SPEC_ITEM_MINIGRAPH_WIDTH}px`,
          pointerEvents: this._mode === 'none' ? 'auto' : 'none',
          // ...userSelect('none'),
        },
      },
      this.$system,
      this.$pod
    )
    const unlisten_name = spec_item_name.addEventListeners([
      makeInputListener((value) => {
        refresh_spec_item_name_width(value)
      }),
      makeChangeListener((value) => {
        if (value.length > 0) {
          const { proxy } = this._client

          const next_bundle = { ...bundle, spec: { ...spec, name: value } }

          this._spec_item_bundle[spec_id] = next_bundle

          proxy.put(spec_id, next_bundle)

          if (channel) {
            channel.postMessage({
              type: 'put',
              data: { id: spec_id, data: bundle },
            })
          }
        } else {
          const value = spec.name || ''

          spec_item_name.setProp('value', value)

          refresh_spec_item_name_width(value)
        }
      }),
      makeFocusListener(() => {
        this._editing_name_spec_id = spec_id
        this._disable_modes()
      }),
      makeBlurListener(() => {
        this._editing_name_spec_id = null
        this._enable_modes()
      }),
    ])
    this._spec_item_name[spec_id] = spec_item_name

    refresh_spec_item_name_width(display_name)

    const unhover = () => {
      this._unhover_item()
    }

    const spec_item = new Div(
      {
        style: {
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: this._mode === 'none' ? 'none' : 'auto',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    spec_item.appendChild(spec_item_screen)
    spec_item.appendChild(spec_item_name)

    const unlisten_item = spec_item.addEventListeners([
      makePointerEnterListener(({ pointerId }) => {
        if (this._prevent_pointer_enter) {
          this._prevent_pointer_enter = false
          return
        }
        // console.log('pointerenter')

        this._hover_item(spec_id)
      }),
      makePointerLeaveListener(unhover),
      makePointerCancelListener(unhover),
      makeClickListener({
        onClick: () => {
          switch (this._mode) {
            case 'remove':
              if (this._hovered_spec_item) {
                this._unhover_item()
              }

              this._remove_spec(spec_id)

              break
            case 'add':
            case 'data':
              if (this._new_spec_item === spec_item) {
                this._store_add_spec(spec_id, bundle)
                mergeStyle(this._new_spec_item, {
                  opacity: '1',
                })
                this._new_spec_item = null
              }
          }
        },
        onLongPress: (event, _event: PointerEvent) => {
          if (
            this._mode === 'add' ||
            this._mode === 'change' ||
            this._mode === 'remove' ||
            this._mode === 'data'
          ) {
            const {
              method: { showLongPress },
            } = this.$system

            const { $theme, $color } = this.$context

            const { pointerId } = _event

            const bundle = this._spec_item_bundle[spec_id]

            const { screenX, screenY } = event

            const releasePointerCapture =
              this._root.setPointerCapture(pointerId)

            showLongPress(screenX, screenY, {
              stroke: getThemeModeColor($theme, this._mode, $color),
            })

            const color = getThemeModeColor($theme, this._mode, $color)

            const svg =
              spec_item_screen_minigraph._minimap._map_el.$element.cloneNode(
                true
              ) as SVGSVGElement

            const width = SPEC_ITEM_MINIGRAPH_WIDTH
            const height = SPEC_ITEM_MINIGRAPH_HEIGHT

            svg.setAttribute('stroke', color)

            svg.style.color = color
            svg.style.position = 'fixed'
            svg.style.left = `${screenX}px`
            svg.style.top = `${screenY}px`
            svg.style.zIndex = `${MAX_Z_INDEX}`
            svg.style.width = `${width}px`
            svg.style.height = `${height}px`
            svg.style.pointerEvents = 'none'
            svg.style.transform = 'translate(-50%, -50%)'

            if (this._mode === 'remove' || this._mode === 'change') {
              this._prevent_pointer_enter = true

              this._remove_spec(spec_id)
            }

            const { units } = spec

            for (const unit_id in units) {
              const { x, y } = spec_item_screen_minigraph._nodes[unit_id]
              units[unit_id].metadata = units[unit_id].metadata || {}
              units[unit_id].metadata.position = { x, y }
            }

            const onDrag = (screenX: number, screenY: number) => {
              svg.style.left = `${screenX}px`
              svg.style.top = `${screenY}px`
            }

            const onDrop = (foundTarget: boolean) => {
              //
            }

            const cancelDnd = startDragAndDrop(
              this.$system,
              svg,
              pointerId,
              bundle,
              onDrag,
              onDrop
            )

            const new_spec = clone(emptyGraphSpec())

            new_spec.name = ''

            const new_bundle = {
              spec: new_spec,
              specs: {},
            }

            this._add_new_spec_item(new_bundle)
          }
        },
      }),
    ])

    const unlisten = callAll([unlisten_item, unlisten_name])

    this._spec_item_unlisten[spec_id] = unlisten

    return spec_item
  }

  private _enable_modes = (): void => {
    // console.log('GraphControl', '_enable_modes')
    this._unlisten_mode_keyboard = enableModeKeyboard(
      this._root,
      (mode: Mode) => {
        this._set_mode(mode)

        if (this._modes) {
          this._modes.setProp('mode', mode)
        }
      }
    )
  }

  private _disable_modes = (): void => {
    // console.log('GraphControl', '_disable_modes')
    if (this._unlisten_mode_keyboard) {
      this._unlisten_mode_keyboard()
      this._unlisten_mode_keyboard = undefined
    }
  }

  private _add_spec = (
    spec_id: string,
    bundle: BundleSpec,
    style: Dict<string> = {},
    i: number
  ) => {
    this._store_add_spec(spec_id, bundle)
    this._ui_add_spec(spec_id, bundle, style, i)
  }

  private _store_add_spec = (id: string, bundle: BundleSpec) => {
    const { proxy } = this._client
    proxy.add(id, bundle)
    if (channel) {
      channel.postMessage({ type: 'add', data: { id, data: bundle } })
    }
  }

  private _ui_add_spec = (
    spec_id: string,
    bundle: BundleSpec,
    style: Dict<string> = {},
    i: number = 0
  ) => {
    const spec_item = this._render_spec_item(bundle, spec_id, style)
    this._spec_item[spec_id] = spec_item
    this._root.insertChild(spec_item, i)
    return spec_item
  }

  private _remove_spec = (spec_id: string) => {
    this._ui_delete_spec(spec_id)
    this._store_remove_spec(spec_id)
  }

  private _store_remove_spec = (id: string): void => {
    const { proxy } = this._client

    proxy.delete(id)

    if (channel) {
      channel.postMessage({ type: 'delete', data: { id } })
    }
  }

  private _refresh_spec_item_name_width = (spec_id: string, value: string) => {
    const spec_item_name = this._spec_item_name[spec_id]

    const name_width = getTextWidth(value, 15, UNIT_NAME_MAX_SIZE)

    mergeStyle(spec_item_name, { width: `${name_width + 4}px` })
  }

  private _refresh_spec_item_color = (spec_id: string): void => {
    const { $theme } = this.$context

    const spec_item = this._spec_item[spec_id]

    let color: string

    if (spec_item === this._hovered_spec_item) {
      color = getThemeModeColor($theme, this._mode, 'currentColor')
    } else if (this._new_spec_item === spec_item) {
      color = getThemeModeColor($theme, this._mode, 'currentColor')
    } else {
      color = 'currentColor'
    }

    mergePropStyle(spec_item, { color })
  }

  private _ui_delete_spec = (spec_id: string) => {
    const spec_item = this._spec_item[spec_id]

    delete this._spec_item[spec_id]
    delete this._spec_item_name[spec_id]
    delete this._spec_item_minigraph[spec_id]
    delete this._spec_item_bundle[spec_id]

    const unlisten = this._spec_item_unlisten[spec_id]

    delete this._spec_item_unlisten[spec_id]

    unlisten()

    this._root.removeChild(spec_item)
  }

  private _hover_item = (spec_id: string): void => {
    // console.log('SaveControl', '_hover_item', spec_id)

    this._hovered_spec_id = spec_id
    this._hovered_spec_item = this._spec_item[spec_id]

    this._refresh_spec_item_color(spec_id)
  }

  private _unhover_item = (): void => {
    // console.log('SaveControl', '_unhover_item')

    const spec_id = this._hovered_spec_id

    if (spec_id) {
      this._hovered_spec_id = null
      this._hovered_spec_item = null

      if (this._spec_item[spec_id]) {
        this._refresh_spec_item_color(spec_id)
      }
    }
  }

  private _set_mode = (mode: Mode) => {
    this._mode = mode

    const { $theme } = this.$context

    if (
      mode === 'add' ||
      mode === 'remove' ||
      mode === 'change' ||
      mode === 'data'
    ) {
      mergeStyle(this._root, {
        touchAction: 'none',
      })
    } else {
      mergeStyle(this._root, {
        touchAction: 'auto',
      })

      if (this._hovered_spec_item) {
        this._unhover_item()
      }

      if (this._new_spec_item) {
        this._remove_new_spec_item()
      }
    }

    for (const spec_id in this._spec_item) {
      this._refresh_spec_item_pointer_events(spec_id)
    }

    if (this._hovered_spec_item) {
      mergeStyle(this._hovered_spec_item, {
        color: getThemeModeColor($theme, this._mode, 'currentColor'),
      })
    }
  }

  private _on_graph_mode = ({ mode }) => {
    // console.log('SaveControl', '_on_graph_mode', mode)

    this._set_mode(mode)
  }

  private _add_new_spec_item = (bundle: BundleSpec, i: number = 0) => {
    // console.log('Save', '_add_new_spec_item')
    if (this._new_spec_item) {
      return
    }

    const { $theme } = this.$context

    const spec_id = uuid()

    const spec_item = this._ui_add_spec(
      spec_id,
      bundle,
      { pointerEvents: 'none' },
      i
    )

    this._new_spec_item = spec_item
    this._new_spec_item_spec_id = spec_id
  }

  private _remove_new_spec_item = (): number => {
    // console.log('Save', '_remove_new_spec_item')

    const i = this._root.removeChild(this._new_spec_item)

    this._new_spec_item = null
    this._new_spec_item_spec_id = null

    return i
  }

  private _move_new_spec_item = (i: number) => {
    // console.log('Save', '_move_new_spec_item', i)

    if (this._new_spec_item) {
      this._root.removeChild(this._new_spec_item)
      this._root.insertChild(this._new_spec_item, i)
    }
  }

  private _swap_new_spec_item = (bundle: BundleSpec) => {
    // console.log('GraphControl', '_swap_new_spec_item')

    const i = this._remove_new_spec_item()

    const { spec } = bundle

    const { id } = spec

    let next_id = id

    if (this._spec_item_bundle[id]) {
      next_id = uuid()

      bundle.spec.id = next_id
    }

    this._ui_add_spec(id, bundle, {}, i)

    this._refresh_spec_item_name_width(id, spec.name)
    this._refresh_spec_item_color(id)
  }

  private _refresh_spec_item_pointer_events = (spec_id: string): void => {
    // console.log('GraphControl', '_refresh_spec_item_pointer_events')

    const spec_item_name = this._spec_item_name[spec_id]
    const spec_item = this._spec_item[spec_id]

    if (this._mode === 'none') {
      mergePropStyle(spec_item, { pointerEvents: 'none' })
      mergePropStyle(spec_item_name, { pointerEvents: 'all' })
    } else {
      mergePropStyle(spec_item, { pointerEvents: 'auto' })
      mergePropStyle(spec_item_name, { pointerEvents: 'none' })
    }
  }

  private _context_unlisten: Unlisten

  private _listen_store = () => {
    const { emitter } = this._client

    emitter.addListener('reset', (bundles: Dict<BundleSpec>) => {
      this._root.removeChildren()
      forEachKeyValue(bundles, (bundle, bundle_id) => {
        this._ui_add_spec(bundle_id, bundle)
      })
    })
    emitter.addListener('add', (bundle_id, bundle: BundleSpec) => {
      this._ui_add_spec(bundle_id, bundle)
    })
    emitter.addListener('put', (bundle_id, bundle: BundleSpec) => {
      // TODO
      this._ui_delete_spec(bundle_id)
      this._ui_add_spec(bundle_id, bundle)
    })
    emitter.addListener('delete', (bundle_id) => {
      this._ui_delete_spec(bundle_id)
    })
  }

  private _fill_list = () => {
    const { proxy } = this._client
    proxy
      .getAll()
      .then((bundles) => {
        forEachKeyValue(bundles, (spec, spec_id) => {
          this._ui_add_spec(spec_id, spec)
        })
      })
      .catch((err) => {
        // TODO
        console.log('err', err)
      })
  }

  onMount(): void {
    const { graph } = this.$system

    const graph_service = graph(this.$system, {})

    const modes = findRef(this, 'modes') as Modes | null

    this._modes = modes

    this._enable_modes()

    const graphEnterModeListener = makeCustomListener(
      '_graph_mode',
      this._on_graph_mode,
      true
    )
    this._context_unlisten = addListeners(this.$context, [
      graphEnterModeListener,
      makeCustomListener('themechanged', () => {
        const { $theme } = this.$context

        mergePropStyle(this._root, {
          background: setAlpha(themeBackgroundColor($theme), 0.75),
        })
      }),
    ])

    const store = graph_service

    this._client = store.connect()

    this._fill_list()

    this._listen_store()

    const on_message = (data) => {
      const { type, data: _data } = data

      switch (type) {
        case 'add':
          {
            const { id, data } = _data
            this._ui_add_spec(id, data)
          }
          break
        case 'delete':
          {
            const { id } = _data
            this._ui_delete_spec(id)
          }
          break
        case 'put':
          {
            const { id, data } = _data
            // TODO put
            this._ui_delete_spec(id)
            this._ui_add_spec(id, data)
          }
          break
      }
    }

    if (channel) {
      channel.addEventListener('message', (event) => {
        const { source, data } = event
        if (source !== window) {
          on_message(data)
        }
      })
    }
  }

  onUnmount() {
    this._disable_modes()
    this._context_unlisten()
  }
}
