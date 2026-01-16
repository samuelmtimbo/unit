import * as fuzzy from 'fuzzy'
import { Registry } from '../../../../../Registry'
import { classnames } from '../../../../../client/classnames'
import { debounce } from '../../../../../client/debounce'
import { readDropEventItemsAsText } from '../../../../../client/drag'
import { Element } from '../../../../../client/element'
import { UnitDragEvent } from '../../../../../client/event/drag'
import { makeDragEnterListener } from '../../../../../client/event/drag/dragenter'
import { makeDragLeaveListener } from '../../../../../client/event/drag/dragleave'
import { makeDragOverListener } from '../../../../../client/event/drag/dragover'
import { makeDropListener } from '../../../../../client/event/drag/drop'
import { makeFocusInListener } from '../../../../../client/event/focus/focusin'
import { makeFocusOutListener } from '../../../../../client/event/focus/focusout'
import { makeInputListener } from '../../../../../client/event/input'
import {
  IOKeyboardEvent,
  isKeyPressed,
  makeKeydownListener,
  makeKeyupListener,
  makeShortcutListener,
} from '../../../../../client/event/keyboard'
import { UnitPointerEvent } from '../../../../../client/event/pointer'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import {
  IOScrollEvent,
  makeScrollListener,
} from '../../../../../client/event/scroll'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { compareByComplexity } from '../../../../../client/search'
import { COLOR_NONE } from '../../../../../client/theme'
import { Shape } from '../../../../../client/util/geometry'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { UNTITLED } from '../../../../../constant/STRING'
import { getSpec, isComponentId, isSystemSpec } from '../../../../../spec/util'
import { System } from '../../../../../system'
import { Spec } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { Unlisten } from '../../../../../types/Unlisten'
import { pull } from '../../../../../util/array'
import { clone } from '../../../../../util/clone'
import { specNameGrammar } from '../../../../../util/grammar'
import { binaryFindIndex } from '../../../../../util/sort/binaryFindIndex'
import { removeWhiteSpace } from '../../../../../util/string'
import { clamp } from '../../../../core/relation/Clamp/f'
import { keys } from '../../../../f/object/Keys/f'
import MicrophoneButton from '../../../component/app/MicrophoneButton/Component'
import TextBox from '../../../core/component/TextBox/Component'
import Div from '../../Div/Component'
import Icon from '../../Icon/Component'
import IconButton from '../IconButton/Component'
import SearchInput from '../SearchInput/Component'
import Tooltip, { TOOLTIP_WIDTH } from '../Tooltip/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  selected?: string
  selectedColor?: string
  shape?: Shape
  filter?: (u: string) => boolean
  registry?: Registry
}

export const SEARCH_ITEM_HEIGHT: number = 40

export type ListItem = {
  id: string
  name: string
  tags: string[]
  icon: string
  fuzzyName: string
}

const DEFAULT_STYLE = {
  position: 'relative',
  width: 'calc(100% + 4px)',
  maxWidth: '309px',
  height: 'initial',
  // overflowY: 'hidden',
  // overflowX: 'hidden',
  borderWidth: '1px 1px 0px 1px',
  borderStyle: 'solid',
  color: 'currentColor',
  borderColor: 'currentColor',
  padding: '0',
  backgroundColor: COLOR_NONE,
  borderTopLeftRadius: '3px',
  borderTopRightRadius: '3px',
}

export const SHAPE_TO_ICON = {
  rect: 'square',
  circle: 'circle',
}

export function isSpecFuzzyMatch(str: string, pattern: string) {
  const cleanPattern = removeWhiteSpace(pattern.replace('-', ' '))

  const isMatch = fuzzy.match(cleanPattern, str, {
    caseSensitive: false,
  })

  return isMatch
}

export default class Search extends Element<HTMLDivElement, Props> {
  private _input_value: string = ''

  public _search: Div
  public _list: Div
  public _input: SearchInput
  public _microphone: MicrophoneButton

  private _tooltip: Tooltip
  private _shape_tooltip: Tooltip
  private _microphone_tooltip: Tooltip

  private _shape: Shape = 'circle'
  private _shape_button: IconButton

  private _ordered_id_list: string[] = []
  private _filtered_id_list: string[] = []

  private _item: Dict<ListItem> = {}

  private _filtered_list_item: ListItem[] = []
  private _list_item_div: Dict<Div> = {}
  private _list_item_content: Dict<Div> = {}
  private _list_item_name: Dict<TextBox> = {}

  private _list_hidden: boolean = true

  private _selected_id: string | null = null
  private _selected_index: number = 0

  private _scrollTop: number = 0

  private _registry: Registry

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, selected, registry } = this.$props

    this._registry = registry ?? this.$system

    const list = new Div(
      {
        className: 'search-list',
        style: {
          position: 'relative',
          maxHeight: `${4 * SEARCH_ITEM_HEIGHT - 1}px`,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: this._list_hidden ? 'none' : 'block',
          width: 'calc(100% + 13px)',
          height: '100%',
          boxSizing: 'content-box',
          scrollSnapType: 'y mandatory',
        },
      },
      this.$system
    )
    list.addEventListener(
      makeScrollListener((event: IOScrollEvent) => {
        this._scrollTop = this._list.$element.scrollTop
      })
    )
    this._list = list

    this._reset()

    const input = new SearchInput({}, this.$system)

    input.addEventListener(makeKeydownListener(this._on_input_keydown))
    input.addEventListener(makeKeyupListener(this._on_input_keyup))
    input.addEventListener(makeFocusInListener(this._on_input_focus_in))
    input.addEventListener(makeFocusOutListener(this._on_input_focus_out))
    input.addEventListener(makeInputListener(this._on_input_input))
    input.addEventListener(
      makeShortcutListener([
        {
          combo: [
            'ArrowDown',
            'Shift + ArrowDown',
            'Shift + Enter + ArrowDown',
          ],
          keydown: this._on_arrow_down_keydown,
          multiple: true,
          strict: false,
        },
        {
          combo: ['ArrowUp', 'Shift + ArrowUp', 'Shift + Enter + ArrowUp'],
          keydown: this._on_arrow_up_keydown,
          multiple: true,
          strict: false,
        },
        {
          combo: 'Escape',
          keydown: this._on_escape_keydown,
          stopPropagation: true,
        },
        {
          // combo: 'Control + p',
          combo: ['Control + ;', ';'],
          // combo: 'Control + /',
          keydown: this._on_ctrl_p_keydown,
          strict: false,
        },
        {
          // combo: 'p',
          combo: ';',
          // combo: '/',
          keydown: (key, { ctrlKey }) => {
            if (ctrlKey) {
              this._on_ctrl_p_keydown()
            }
          },
        },
        {
          combo: ['Enter', 'Shift + Enter'],
          keydown: this._on_enter_keydown,
        },
      ])
    )
    input.addEventListener(
      makeDragOverListener((event: UnitDragEvent, _event: DragEvent) => {
        _event.preventDefault()

        if (this._list_hidden) {
          this._show_list()
        }
      })
    )
    input.addEventListener(
      makeDropListener((event, _event: DragEvent) => {
        _event.preventDefault()
      })
    )
    this._input = input

    const {
      api: {
        speech: { SpeechGrammarList },
      },
    } = this.$system

    const microphone = new MicrophoneButton(
      {
        style: {
          position: 'absolute',
          right: '0',
          bottom: '0',
          width: '18px',
          height: '18px',
          padding: '11px 9px 10px 11px',
        },
        opt: {
          grammars: SpeechGrammarList
            ? specNameGrammar(this.$system)
            : undefined,
          lang: 'en-us',
          maxAlternatives: 1,
          continuous: false,
          interimResults: true,
        },
      },
      this.$system
    )

    let microphoneDragCount = 0

    microphone.preventDefault('mousedown')
    microphone.preventDefault('touchdown')
    microphone.addEventListeners([
      makeDragEnterListener(() => {
        microphoneDragCount++

        if (microphoneDragCount === 1) {
          this._start_microphone()
        }
      }),
      makeDragLeaveListener(() => {
        microphoneDragCount--
        if (microphoneDragCount === 0) {
          if (this._microphone.$output.recording) {
            this._stop_microphone()
          }
        }
      }),
    ])
    this._microphone = microphone

    const shape_button = new IconButton(
      {
        icon: 'circle',
        style: {
          position: 'absolute',
          left: '0',
          bottom: '0px',
          width: '18px',
          height: '18px',
          padding: '11px 11px 10px 9px',
          ...userSelect('none'),
        },
        title: 'layout',
      },
      this.$system
    )
    shape_button.addEventListener(
      makeClickListener({
        onClick: () => {
          this.toggleShape()
        },
      })
    )
    shape_button.preventDefault('mousedown')
    shape_button.preventDefault('touchdown')

    this._shape_button = shape_button

    let dragCount: number = 0

    const search = new Div(
      {
        className: classnames('search', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        title: 'search',
      },
      this.$system
    )

    search.addEventListener(
      makeDragEnterListener((event: UnitDragEvent, event_: DragEvent) => {
        dragCount++
      })
    )
    search.addEventListener(
      makeDragLeaveListener((event: UnitDragEvent, event_: DragEvent) => {
        dragCount--

        if (dragCount === 0) {
          if (!this._list_hidden) {
            this._hide_list()
          }
        }
      })
    )

    search.registerParentRoot(list)
    search.registerParentRoot(input)
    search.registerParentRoot(shape_button)
    search.registerParentRoot(microphone)

    const tooltip = new Tooltip(
      {
        shortcut: ';',
        component: search,
        x: 0,
        y: -SEARCH_ITEM_HEIGHT + 6 - 1,
      },
      this.$system
    )
    this._tooltip = tooltip

    const shape_tooltip = new Tooltip(
      {
        shortcut: 'l',
        component: shape_button,
        x: -3,
        y: -SEARCH_ITEM_HEIGHT + 6 + 1,
      },
      this.$system
    )
    this._shape_tooltip = shape_tooltip

    const microphone_tooltip = new Tooltip(
      {
        shortcut: '|',
        component: microphone,
        x: 3,
        y: -TOOLTIP_WIDTH - 4.5 + 1,
      },
      this.$system
    )
    this._microphone_tooltip = microphone_tooltip

    this._search = search

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = {
      default: search,
    }
    this.$unbundled = false
    this.$primitive = true
    this.$subComponent = {
      search,
      tooltip,
      shape_tooltip,
      microphone_tooltip,
      list,
      input,
      shape_button,
      microphone,
    }

    if (selected) {
      if (this._filtered_id_list.includes(selected)) {
        this._set_selected_item_id(selected)
      }
    } else {
      if (this._ordered_id_list.length > 0) {
        this._select_first_list_item()
      }
    }

    this.registerRoot(search)
    this.registerRoot(tooltip)
    this.registerRoot(shape_tooltip)
    this.registerRoot(microphone_tooltip)

    this._listen_registry()
  }

  private _reset = () => {
    // console.log('Search', '_reset')

    this._list.removeChildren()

    this._item = {}
    this._list_item_div = {}
    this._list_item_content = {}
    this._list_item_name = {}

    this._refresh_ordered_list()

    const total = this._ordered_id_list.length

    let i = 0

    for (const id of this._ordered_id_list) {
      this._add_list_item(id, i, total)

      i++
    }
  }

  private _refresh_ordered_list = () => {
    const { classes } = this.$system

    const { specs } = this._registry

    const id_list = keys(specs)

    const ordered_id_list = id_list.sort((a, b) => {
      return compareByComplexity(specs, classes, a, b)
    })

    this._ordered_id_list = ordered_id_list
    this._filtered_id_list = clone(ordered_id_list)

    const ordered_id_set = new Set(ordered_id_list)

    for (const spec_id in this._item) {
      if (!ordered_id_set.has(spec_id)) {
        this.__remove_list_item(spec_id)
      }
    }
  }

  private _set_list_item_color = (id: string, color: string) => {
    // console.log('Search', '_set_list_item_color', id, color)

    const selected_list_item = this._list_item_content[id]

    if (!selected_list_item) {
      // console.warn('selected list item not found')

      return
    }

    selected_list_item.$element.style.color = color
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      const style = {
        ...DEFAULT_STYLE,
        ...current,
      }

      this._search.setProp('style', style)
    } else if (prop === 'selectedColor') {
      if (this._selected_id) {
        const { selectedColor = 'currentColor' } = this.$props

        this._set_list_item_color(this._selected_id, selectedColor)
      }
    } else if (prop === 'selected') {
      const { selected } = this.$props

      this._set_selected_item_id(selected)
    } else if (prop === 'filter') {
      this._filter_list(true)
    } else if (prop === 'registry') {
      if (this._registry === current) {
        return
      }

      this._registry = current ?? this.$system

      this._unlisten_registry()
      this._listen_registry()

      this._refresh_list()
    } else if (prop === 'shape') {
      this._setShape(current ?? 'circle')
    }
  }

  private _registry_unlisten: Unlisten

  private _refresh_list = (preserve_selected?: boolean) => {
    this._refresh_ordered_list()
    this._filter_list(preserve_selected)
  }

  private _find_new_item_index = (spec: GraphSpec, list: string[]): number => {
    const { classes } = this.$system

    const { specs } = this._registry

    if (list.length === 0) {
      return 0
    }

    const index = binaryFindIndex(list, (current_spec_id) => {
      const current_score = compareByComplexity(
        specs,
        classes,
        spec.id,
        current_spec_id
      )

      return current_score
    })

    return index
  }

  private _insert_list_item = (spec: GraphSpec) => {
    const new_ordered_index = this._find_new_item_index(
      spec,
      this._ordered_id_list
    )

    this._ordered_id_list.splice(new_ordered_index, 0, spec.id)

    const match = fuzzy.match(this._input_value, spec.name ?? '')

    if (match) {
      const new_filtered_index = this._find_new_item_index(
        spec,
        this._filtered_id_list
      )

      this._filtered_id_list.splice(new_filtered_index, 0, spec.id)
    }

    this._add_list_item(
      spec.id,
      new_ordered_index,
      this._ordered_id_list.length
    )
  }

  private _listen_registry = () => {
    this._registry_unlisten = this._registry.specs_.subscribe(
      [],
      '*',
      (type, path, key, data) => {
        const { specs } = this._registry

        const spec = data

        if (path.length === 0) {
          if (type === 'set') {
            if (this._item[spec.id]) {
              this._refresh_list_item(spec.id)
              this._refresh_last_list_item_border()
            } else {
              this._insert_list_item(spec)

              if (!this._list_hidden) {
                this._filter_list(true)
              } else {
                this._to_be_filtered = true
              }
            }
          } else if (type === 'delete') {
            const specId = key
            // console.log('delete', specId)

            if (isSystemSpec(spec)) {
              return
            }

            this._remove_list_item(specId)

            const selected_item_id = this._selected_id

            if (this._list_hidden) {
              this._debounced_refresh_list()
            } else {
              this._refresh_list(true)

              if (selected_item_id === specId) {
                this._select_first_list_item()
              }
            }
          }
        }
      }
    )
  }

  private _unlisten_registry = () => {
    this._registry_unlisten()

    this._registry_unlisten = undefined
  }

  private _add_list_item = (id: string, i: number, total: number): void => {
    // console.log('Search', '_add_list_item', id, i, total)

    const { specs } = this._registry

    const spec = getSpec(specs, id)

    const { name = '', metadata = {} } = spec as Spec

    const icon = metadata.icon || 'question'
    const tags = metadata.tags || ['user']
    const tagsStr = tags.join(' ')
    // const fuzzyName = `${name} ${tagsStr}`
    const fuzzyName = name
    const finalName = name || UNTITLED

    this._item[id] = { id, name, icon, tags, fuzzyName }

    const list_item_icon = new Icon(
      {
        style: { width: '18px', height: '18px', margin: '9px' },
        icon,
      },
      this.$system
    )
    const list_item_main_name = new TextBox(
      {
        style: {
          width: 'fit-content',
          height: '18px',
          marginBottom: '2px',
          ...userSelect('none'),
        },
        value: finalName,
      },
      this.$system
    )
    this._list_item_name[id] = list_item_main_name

    const list_item_main_tags = new TextBox(
      {
        style: {
          fontSize: '12px',
          width: 'fit-content',
          height: '12px',
          marginBottom: '1px',
          ...userSelect('none'),
        },
        value: tagsStr,
      },
      this.$system
    )

    const list_item_main = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: '2px',
          width: '100%',
          height: '100%',
        },
      },
      this.$system
    )
    list_item_main.appendChild(list_item_main_name)
    list_item_main.appendChild(list_item_main_tags)

    const list_item_content = new Div(
      {
        className: 'search-list-item-content',
        style: {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          height: `${SEARCH_ITEM_HEIGHT - 1}px`,
          backgroundColor: COLOR_NONE,
        },
      },
      this.$system
    )
    list_item_content.appendChild(list_item_icon)
    list_item_content.appendChild(list_item_main)
    this._list_item_content[id] = list_item_content

    const list_item_div_border_bottom =
      i < total - 1 ? `1px solid currentColor` : ''

    const list_item_div = new Div(
      {
        className: 'search-list-item',
        style: {
          borderBottom: list_item_div_border_bottom,
          boxSizing: 'border-box',
          width: `${309}px`,
          height: '100%',
          scrollSnapAlign: 'start',
        },
      },
      this.$system
    )
    list_item_div.preventDefault('mousedown')
    list_item_div.preventDefault('touchdown')
    list_item_div.appendChild(list_item_content)
    list_item_div.addEventListeners([
      makePointerEnterListener((event) => {
        this._on_list_item_pointer_enter(event, id)
      }),
      makeClickListener({
        onClick: (event) => {
          this._on_list_item_click(event, id)
        },
      }),
      makeDragOverListener((event: UnitDragEvent, _event: DragEvent) => {
        _event.preventDefault()

        if (this._selected_id !== id) {
          this.set_selected_item_id(id)
        }
      }),
      makeDropListener(async (event, _event: DragEvent) => {
        _event.preventDefault()

        if (!this._list_hidden) {
          if (this._selected_id) {
            const items = await readDropEventItemsAsText(_event)

            this._dispatch_item_pick(this._selected_id, items)
          }

          this._hide_list()
        }
      }),
    ])
    this._list_item_div[id] = list_item_div
    this._list.appendChild(list_item_div)
  }

  private _remove_list_item = (id: string): void => {
    // console.log('Search', '_remove_list_item', id)

    const list_item_div = this._list_item_div[id]

    if (list_item_div) {
      this.__remove_list_item(id)

      pull(this._filtered_id_list, id)
      pull(this._ordered_id_list, id)
    }
  }

  private __remove_list_item = (id: string): void => {
    const list_item_div = this._list_item_div[id]

    if (list_item_div) {
      this._list.removeChild(list_item_div)

      delete this._list_item_div[id]
      delete this._item[id]
      delete this._list_item_name[id]
      delete this._list_item_content[id]
    }
  }

  private _refresh_list_item = (id: string) => {
    // console.log('Search', '_refresh_list_item', id)

    const list_item_div = this._list_item_div[id]
    const list_item_name = this._list_item_name[id]

    const spec = this._registry.getSpec(id)

    const { name = '', metadata = {} } = spec as Spec

    const finalName = name || UNTITLED

    const icon = metadata.icon || 'question'
    const tags = metadata.tags || []
    const tagsStr = tags.join(' ')
    // const fuzzyName = `${name} ${tagsStr}`
    const fuzzyName = name

    list_item_div.$element.style.borderBottom = `1px solid currentColor`

    this._item[id] = { id, name, icon, tags, fuzzyName }

    list_item_name.setProp('value', finalName)
  }

  public focus(options: FocusOptions | undefined = { preventScroll: true }) {
    this._input._input.focus(options)
  }

  public blur() {
    this._input._input.blur()
  }

  public start_microphone = () => {
    this._start_microphone()
  }

  public stop_microphone = () => {
    this._stop_microphone()
  }

  private _start_microphone = () => {
    this._microphone.$unit.$setPinData({
      pinId: 'start',
      type: 'input',
      data: 'true',
    })
  }

  private _stop_microphone = () => {
    this._microphone.$unit.$setPinData({
      pinId: 'stop',
      type: 'input',
      data: 'true',
    })
  }

  private _on_input_keydown = (
    { repeat, key }: IOKeyboardEvent,
    _event: KeyboardEvent
  ) => {
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'F27') {
      _event.preventDefault()
    }

    if (key === '\\') {
      if (!this._microphone.$output.recording) {
        this._start_microphone()

        _event.preventDefault()
      }
    }

    if (repeat) {
      if (key === 'Backspace') {
        //
      } else {
        _event.preventDefault()
      }
    }
  }

  private _on_input_keyup = ({ key }) => {
    // console.log('Search', '_on_input_keyup')

    if (key === '\\') {
      if (this._microphone.$output.recording) {
        this._stop_microphone()
      }
    }
  }

  private _on_input_focus_in = (): void => {
    // console.log('Search', '_on_input_focus_in')

    // setTimeout(() => {
    this._select_all()
    // }, 0)
    this._show_list()
  }

  private _select_all = (): void => {
    // console.log('Search', '_select_all')

    this._input.setSelectionRange(0, this._input_value.length)
  }

  private _on_input_click = (): void => {
    // this._input.setSelectionRange(0, this._input_value.length)
  }

  private _on_input_focus_out = () => {
    // console.log('Search', '_on_input_focus_out')
    this._hide_list()
  }

  private _to_be_filtered: boolean = false

  private _show_list = () => {
    // console.log('Search', '_show_list')

    const { style = {} } = this.$props
    const { color = 'currentColor' } = style

    if (this._to_be_filtered) {
      this._filter_list()

      this._to_be_filtered = false
    }

    this._list_hidden = false

    const filtered_total = this._filtered_id_list.length
    const empty = filtered_total === 0

    this._list.$element.style.display = 'block'
    this._input._input.$element.style.borderRadius = empty
      ? '3px 3px 0 0'
      : '0 0 0 0'
    this._input._input.$element.style.borderTopWidth = empty ? '0px' : '1px'

    if (!empty) {
      this._refresh_last_list_item_border()

      if (this._selected_id) {
        this._scroll_into_item_if_needed(this._selected_id, false)
      }
    }

    this._dispatch_list_shown()

    if (this._selected_id) {
      this._dispatch_item_selected(this._selected_id)
    }
  }

  private _refresh_last_list_item_border = () => {
    const filtered_total = this._filtered_id_list.length

    if (!filtered_total) {
      return
    }

    const last_list_item_id = this._filtered_id_list[filtered_total - 1]
    const last_list_item_div = this._list_item_div[last_list_item_id]

    last_list_item_div.$element.style.borderBottom = ``
  }

  private _dispatch_item_selected = (id: string): void => {
    this.dispatchEvent('selected', { id })
  }

  private _dispatch_shape = (): void => {
    this.dispatchEvent('shape', { shape: this._shape })
  }

  private _dispatch_item_pick = (id: string, dropText?: string[]): void => {
    this.dispatchEvent('pick', { id, dropText })
  }

  private _dispatch_list_shown = (): void => {
    this.dispatchEvent('shown', {})
  }

  private _dispatch_list_hidden = (): void => {
    this.dispatchEvent('hidden', {})
  }

  private _dispatch_list_empty = (): void => {
    this.dispatchEvent('empty', {})
  }

  private _select_first_list_item = () => {
    const first_list_item_id = this._filtered_id_list[0]

    this._top_element_index = 0

    this.set_selected_item_id(first_list_item_id, true)
  }

  private _hide_list = () => {
    this._list_hidden = true

    this._input._input.$element.style.borderTopWidth = '0'

    this._list.$element.style.display = 'none'

    this._dispatch_list_hidden()
  }

  private _on_list_item_pointer_enter = ({}: UnitPointerEvent, id: string) => {
    // console.log('Search', '_on_list_item_pointer_enter')
    this.set_selected_item_id(id)
  }

  private _on_list_item_click = ({}: UnitPointerEvent, id: string) => {
    // console.log('Search', '_on_list_item_click')
    this._dispatch_item_pick(id)
  }

  public set_selected_item_id = (
    id: string,
    force_scroll: boolean = false
  ): void => {
    const prev_selected_id = this._selected_id

    this._set_selected_item_id(id, force_scroll)

    if (this._selected_id !== prev_selected_id) {
      this._dispatch_item_selected(id)
    }
  }

  private _set_selected_item_id = (
    id: string,
    force_scroll: boolean = false
  ): void => {
    // console.log('Search', '_set_selected_item_id', id, force_scroll)

    const { style = {}, selectedColor = 'currentColor' } = this.$props
    const { color = 'currentColor' } = style

    if (this._selected_id) {
      this._set_list_item_color(this._selected_id, color)
    }

    this._selected_id = id

    if (id) {
      this._set_list_item_color(id, selectedColor)

      if (!this._list_hidden) {
        this._scroll_into_item_if_needed(id, force_scroll)
      }
    }
  }

  public select_next = (offset: number): void => {
    // console.log('Search', 'select_next', offset)

    let index: number = 0

    if (this._selected_id) {
      index = this._ordered_id_list.indexOf(this._selected_id)
    }

    const next_index = clamp(
      index + offset,
      0,
      this._ordered_id_list.length - 1
    )

    const next_selected_spec_id = this._ordered_id_list[next_index]

    this.set_selected_item_id(next_selected_spec_id)
  }

  private _top_element_index = 0

  private _scroll_into_item_if_needed = (
    id: string,
    force: boolean = false
  ) => {
    // console.log('Search', '_scroll_into_item_if_needed', id, force)

    const { scrollTop } = this._list.$element

    const scroll_index = scrollTop / SEARCH_ITEM_HEIGHT

    const selected_id_index = this._filtered_id_list.indexOf(id)

    // const scroll_index = this._top_element_index ?? selected_id_index

    if (
      force ||
      selected_id_index - scroll_index >= 4 ||
      selected_id_index - scroll_index < 0
    ) {
      const list_item = this._list_item_div[id]

      list_item.$element.scrollIntoView({ behavior: 'auto', block: 'nearest' })

      this._top_element_index = selected_id_index
      // this._list.$element.scrollTop = selected_id_index * SEARCH_ITEM_HEIGHT
      // this._list.$element.scrollTo({
      //   top: selected_id_index * SEARCH_ITEM_HEIGHT,
      //   behavior: 'auto',
      // })
    }
  }

  private _debounced_refresh_list = debounce(
    this.$system,
    (preserve_selected: boolean = false) => {
      this._refresh_list(preserve_selected)
    },
    0
  )

  private _filter_list = (preserve_selected: boolean = true) => {
    // console.log('Search', '_filter_list')

    const { specs } = this._registry

    const { style = {}, filter = () => true } = this.$props

    const { color = 'currentColor' } = style

    let filtered_id_list: string[] = []

    const filtered_score: Dict<number> = {}

    const fuzzy_pattern = this._input_value
    const reverse_spaced_fuzzy_pattern = fuzzy_pattern
      .split(' ')
      .reverse()
      .join(' ')

    for (const id of this._ordered_id_list) {
      if (this._list_item_div[id]) {
        this._refresh_list_item(id)
      } else {
        const spec = specs[id] as GraphSpec

        this._insert_list_item(spec)
      }

      const { fuzzyName } = this._item[id]
      const list_item_div = this._list_item_div[id]

      const fuzzy_match =
        isSpecFuzzyMatch(fuzzyName, fuzzy_pattern) ||
        isSpecFuzzyMatch(fuzzyName, reverse_spaced_fuzzy_pattern)

      if (
        (fuzzy_pattern === '' || fuzzy_match) &&
        filter(id) &&
        (this._shape === 'circle' || isComponentId(specs, id))
      ) {
        filtered_score[id] = 0

        if (fuzzy_match) {
          const { score } = fuzzy_match

          filtered_score[id] = score
        }

        list_item_div.$element.style.display = 'flex'

        filtered_id_list.push(id)
      } else {
        list_item_div.$element.style.display = 'none'
      }
    }

    filtered_id_list = filtered_id_list.sort((a, b) => {
      const a_score = filtered_score[a]
      const b_score = filtered_score[b]

      return b_score - a_score
    })

    this._filtered_id_list = filtered_id_list

    let filtered_total = filtered_id_list.length

    if (filtered_total > 0) {
      for (let i = 0; i < filtered_total; i++) {
        const id = this._filtered_id_list[i]
        const list_item_div = this._list_item_div[id]

        this._list.removeChild(list_item_div)
        this._list.appendChild(list_item_div)
      }

      if (!this._list_hidden) {
        this._refresh_last_list_item_border()

        this._input._input.$element.style.borderRadius = '0'
        this._input._input.$element.style.borderTopWidth = '1px'
      }

      if (preserve_selected) {
        if (this._selected_id) {
          if (this._filtered_id_list.includes(this._selected_id)) {
            this._top_element_index = 0

            this._scroll_into_item_if_needed(this._selected_id, false)
          } else {
            this._select_first_list_item()
          }
        } else {
          this._select_first_list_item()
        }
      } else {
        this._select_first_list_item()
      }
    } else {
      this._input._input.$element.style.borderRadius = '3px 3px 0px 0px'
      this._input._input.$element.style.borderTopWidth = '0'

      if (this._selected_id) {
        this._set_list_item_color(this._selected_id, color)
      }

      this._selected_id = null
      this._dispatch_list_empty()
    }

    if (this._filtered_id_list.length > 0) {
      this._refresh_last_list_item_border()
    }
  }

  private _on_input_input = (value: string) => {
    if (value === ';') {
      this._setValue(this._input_value)

      return
    }

    this._input_value = value
    this._filter_list(false)
  }

  private _on_arrow_down_keydown = (): void => {
    if (!this._list_hidden && this._selected_id) {
      const selected_id_index = this._filtered_id_list.indexOf(
        this._selected_id
      )

      if (selected_id_index < this._filtered_id_list.length - 1) {
        const next_selected_id_index = selected_id_index + 1
        const next_selected_id = this._filtered_id_list[next_selected_id_index]

        this.set_selected_item_id(next_selected_id)

        if (isKeyPressed(this.$system, 'Enter')) {
          this._dispatch_item_pick(next_selected_id)
        }
      }
    }
  }

  private _on_arrow_up_keydown = (): void => {
    if (!this._list_hidden && this._selected_id) {
      const selected_id_index = this._filtered_id_list.indexOf(
        this._selected_id
      )
      if (selected_id_index > 0) {
        const next_selected_id_index = selected_id_index - 1
        const next_selected_id = this._filtered_id_list[next_selected_id_index]

        this.set_selected_item_id(next_selected_id)

        if (isKeyPressed(this.$system, 'Enter')) {
          this._dispatch_item_pick(next_selected_id)
        }
      }
    }
  }

  private _on_ctrl_p_keydown = () => {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.$system

    // console.log('Search', 'on_ctrl_p_keydown')
    setTimeout(() => {
      this._hide_list()
    }, 0)
  }

  private _on_escape_keydown = () => {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.$system

    // console.log('Search', '_on_escape_keydown')
    setTimeout(() => {
      this._hide_list()
    }, 0)
  }

  private _on_enter_keydown = (): void => {
    if (!this._list_hidden && this._selected_id) {
      if (this._selected_id) {
        this._select_all()
        this._dispatch_item_pick(this._selected_id)
      }
    }
  }

  public getValue = (): string => {
    return this._input_value
  }

  public getShape = (): string => {
    return this._shape
  }

  public getList(): string[] {
    return this._filtered_id_list
  }

  public setValue = (value: string): void => {
    // console.log('Search', 'setValue', value)

    this._setValue(value)
    this._filter_list(true)
  }

  public _setValue = (value: string): void => {
    this._input_value = value
    this._input.setProp('value', value)
  }

  public toggleShape = () => {
    const shape = this._shape === 'circle' ? 'rect' : 'circle'

    this.setShape(shape)
  }

  public setShape = (shape: 'rect' | 'circle') => {
    this._setShape(shape)

    this._dispatch_shape()
  }

  private _setShape = (shape: 'rect' | 'circle', emit?: boolean) => {
    if (this._shape !== shape) {
      this._shape = shape

      this._shape_button.setProp('icon', SHAPE_TO_ICON[shape])

      if (this._list_hidden) {
        this._to_be_filtered = true
      } else {
        this._filter_list()
      }
    }
  }

  onDestroy(): void {
    // console.log('Search', 'onDestroy')

    this._unlisten_registry()
  }

  public showTooltip(): void {
    this._tooltip.show()
    this._shape_tooltip.show()
    this._microphone_tooltip.show()
  }

  public hideTooltip(): void {
    this._tooltip.hide()
    this._shape_tooltip.hide()
    this._microphone_tooltip.hide()
  }
}
