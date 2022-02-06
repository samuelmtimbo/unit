import * as fuzzy from 'fuzzy'
import classnames from '../../../../../client/classnames'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeFocusInListener } from '../../../../../client/event/focus/focusin'
import { makeFocusOutListener } from '../../../../../client/event/focus/focusout'
import { makeInputListener } from '../../../../../client/event/input'
import {
  IOKeyboardEvent,
  makeKeydownListener,
  makeShortcutListener,
} from '../../../../../client/event/keyboard'
import { IOPointerEvent } from '../../../../../client/event/pointer'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import {
  IOScrollEvent,
  makeScrollListener,
} from '../../../../../client/event/scroll'
import parentElement from '../../../../../client/platform/web/parentElement'
import { compareByComplexity } from '../../../../../client/search'
import {
  addAddSpecListener,
  addDeleteSpecListener,
  addSetSpecListener,
  getSpec,
  isComponent,
} from '../../../../../client/spec'
import { COLOR_NONE } from '../../../../../client/theme'
import { throttle } from '../../../../../client/throttle'
import { Shape } from '../../../../../client/util/geometry'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { GraphSpec, Spec, Specs } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import { removeWhiteSpace } from '../../../../../util/string'
import MicrophoneButton from '../../../component/app/MicrophoneButton/Component'
import TextDiv from '../../../core/component/TextDiv/Component'
import Div from '../../Div/Component'
import Icon from '../../Icon/Component'
import IconButton from '../IconButton/Component'
import SearchInput from '../SearchInput/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  selected?: string
  selectedColor?: string
  filter?: (u: string) => boolean
}

const HEIGHT: number = 39

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

export function isSpecVisible(specs: Specs, id: string): boolean {
  const spec = getSpec(specs, id)

  const { private: _private } = spec

  if (_private) {
    return false
  } else {
    return true
  }
}

export default class Search extends Element<HTMLDivElement, Props> {
  private _input_value: string = ''

  public _search: Div
  public _list: Div
  public _input: SearchInput
  public _microphone: MicrophoneButton

  private _shape: Shape = 'circle'
  private _shape_button: IconButton

  private _id_list: string[] = []

  private _ordered_id_list: string[] = []
  private _filtered_id_list: string[] = []

  private _item: Dict<ListItem> = {}

  private _filtered_list_item: ListItem[] = []
  private _list_item_div: Dict<Div> = {}
  private _list_item_content: Dict<Div> = {}

  private _list_hidden: boolean = true

  private _selected_id: string | null = null
  private _selected_index: number = 0

  private _scrollTop: number = 0

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    // const { specs } = this.$system
    // const { specs } = this.$pod

    const specs = { ...this.$system.specs, ...this.$pod.specs }

    const { className, style = {}, selected } = this.$props

    const id_list = Object.keys(specs)
    this._id_list = id_list

    const visible_id_list = id_list.filter((id) => isSpecVisible(specs, id))

    const ordered_id_list = visible_id_list.sort((a, b) => {
      return compareByComplexity(specs, a, b)
    })

    this._ordered_id_list = ordered_id_list
    this._filtered_id_list = ordered_id_list

    const list = new Div(
      {
        className: 'search-list',
        style: {
          position: 'relative',
          maxHeight: `${4 * HEIGHT - 2}px`,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: this._list_hidden ? 'none' : 'block',
          width: 'calc(100% + 3px)',
          boxSizing: 'content-box',
        },
      },
      this.$system,
      this.$pod
    )
    list.addEventListener(
      makeScrollListener((event: IOScrollEvent) => {
        this._scrollTop = this._list.$element.scrollTop
      })
    )
    this._list = list

    const total = id_list.length

    let i = 0
    for (let id of ordered_id_list) {
      this._add_list_item(id, i, total)
      i++
    }

    const input = new SearchInput({}, this.$system, this.$pod)
    input.addEventListener(makeKeydownListener(this._on_input_keydown))
    input.addEventListener(makeFocusInListener(this._on_input_focus_in))
    input.addEventListener(makeFocusOutListener(this._on_input_focus_out))
    input.addEventListener(makeInputListener(this._on_input_input))
    // input.addEventListener(
    //   makeClickListener({
    //     onClick: this._on_input_click,
    //   })
    // )
    input.addEventListener(
      makeShortcutListener([
        {
          combo: 'ArrowDown',
          keydown: this._on_arrow_down_keydown,
          multiple: true,
        },
        {
          combo: 'ArrowUp',
          keydown: this._on_arrow_up_keydown,
          multiple: true,
        },
        { combo: 'Escape', keydown: this._on_escape_keydown },
        {
          // combo: 'Ctrl + p',
          combo: 'Ctrl + ;',
          // combo: 'Ctrl + /',
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
    this._input = input

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
      },
      this.$system,
      this.$pod
    )
    microphone.addEventListener(
      makeCustomListener('transcript', this._on_microphone_transcript)
    )
    microphone.preventDefault('mousedown')
    microphone.preventDefault('touchdown')
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
        },
        title: 'layout',
      },
      this.$system,
      this.$pod
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

    const search = new Div(
      {
        className: classnames('search', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        title: 'search',
      },
      this.$system,
      this.$pod
    )
    search.registerParentRoot(list)
    search.registerParentRoot(input)
    search.registerParentRoot(shape_button)
    search.registerParentRoot(microphone)
    this._search = search

    const $element = parentElement($system)

    this.$element = $element
    this.$slot['default'] = search.$slot['default']
    this.$unbundled = false

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

    const unlisten_add_spec = addAddSpecListener(
      (id: string, spec: GraphSpec): void => {
        const { specs } = this.$system

        console.log('Search', '_on_add_spec', id, spec)

        this._id_list.push(id)

        let i: number

        if (isSpecVisible(specs, id)) {
          for (i = 0; i < this._ordered_id_list.length; i++) {
            const i_id = this._ordered_id_list[i]
            if (compareByComplexity(specs, id, i_id) < 0) {
              this._ordered_id_list.splice(i, 0, id)
              break
            }
          }
        }

        const l = this._id_list.length
        const total = l + 1

        this._add_list_item(id, i, total)

        this._filter_list()
      }
    )

    const unlisten_set_spec = addSetSpecListener(
      (id: string, spec: GraphSpec): void => {
        // console.log('Search', '_on_set_spec', id, spec)
        // TODO
      }
    )

    const unlisten_delete_spec = addDeleteSpecListener((id: string): void => {
      // console.log('Search', '_on_delete_spec', id)
      // TODO
    })
  }

  private _set_list_item_color = (id: string, color: string) => {
    // console.log('Search', '_set_list_item_color', id, color)
    const selected_list_item = this._list_item_content[id]
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
      if (selected) {
        this._set_selected_item_id(selected)
      }
    } else if (prop === 'filter') {
      this._filter_list()
    }
  }

  private _add_list_item = (id: string, i: number, total: number): void => {
    const { specs } = this.$system

    const spec = getSpec(specs, id)

    const { name = '', metadata = {} } = spec as Spec
    const icon = metadata.icon || 'question'
    const tags = metadata.tags || []
    const tagsStr = tags.join(' ')
    // const fuzzyName = `${name} ${tagsStr}`
    const fuzzyName = name
    this._item[id] = { id, name, icon, tags, fuzzyName }

    const list_item_icon = new Icon(
      {
        style: { width: '18px', height: '18px', margin: '9px' },
        icon,
      },
      this.$system,
      this.$pod
    )
    const list_item_main_name = new TextDiv(
      {
        style: {
          width: 'fit-content',
          height: '18px',
          marginBottom: '2px',
          ...userSelect('none'),
        },
        value: name,
      },
      this.$system,
      this.$pod
    )
    const list_item_main_tags = new TextDiv(
      {
        style: {
          fontSize: '12px',
          width: 'fit-content',
          height: '12px',
          marginBottom: '1px',
        },
        value: tagsStr,
      },
      this.$system,
      this.$pod
    )

    const list_item_main = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: '2px',
        },
      },
      this.$system,
      this.$pod
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
          height: `${HEIGHT - 1}px`,
          backgroundColor: COLOR_NONE,
        },
      },
      this.$system,
      this.$pod
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
          width: `${309 - 1}px`,
        },
        data: {
          id,
        },
      },
      this.$system,
      this.$pod
    )
    list_item_div.preventDefault('mousedown')
    list_item_div.preventDefault('touchdown')
    list_item_div.appendChild(list_item_content)
    list_item_div.addEventListener(
      makePointerEnterListener((event) => {
        this._on_list_item_pointer_enter(event, id)
      })
    )

    list_item_div.addEventListener(
      makeClickListener({
        onClick: (event) => {
          this._on_list_item_click(event, id)
        },
      })
    )
    this._list_item_div[id] = list_item_div
    this._list.appendChild(list_item_div)
  }

  public focus(options: FocusOptions | undefined = { preventScroll: true }) {
    this._input._input.focus(options)
  }

  public blur() {
    this._input._input.blur()
  }

  private _on_microphone_transcript = throttle((transcript: string) => {
    // console.log('Search', '_on_microphone_transcript', transcript)
    const value = transcript.toLowerCase().substr(0, 30)
    this._input.setProp('value', value)
    this._input_value = value
    this._filter_list()
    this._input.focus()
  }, 100)

  private _on_input_keydown = (
    { keyCode, repeat }: IOKeyboardEvent,
    _event: KeyboardEvent
  ) => {
    // console.log('Search', '_on_input_keydown', keyCode, repeat)
    // prevent arrow up/down default
    if (keyCode === 38 || keyCode === 40) {
      _event.preventDefault()
    }

    if (repeat) {
      if (keyCode === 8) {
        //
      } else {
        _event.preventDefault()
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
    this._input.setSelectionRange(0, this._input_value.length)
  }

  private _on_input_click = (): void => {
    // this._input.setSelectionRange(0, this._input_value.length)
  }

  private _on_input_focus_out = () => {
    // console.log('Search', '_on_input_focus_out')
    this._hide_list()
  }

  private _show_list = () => {
    const { style = {} } = this.$props
    const { color = 'currentColor' } = style

    // console.log('Search', '_show_list')
    this._list_hidden = false

    const filtered_total = this._filtered_id_list.length
    const empty = filtered_total === 0

    this._list.$element.style.display = 'block'
    this._input._input.$element.style.borderRadius = empty
      ? '3px 3px 0 0'
      : '0 0 0 0'
    this._input._input.$element.style.borderTopWidth = empty ? '0px' : '1px'

    if (!empty) {
      const last_list_item_id = this._filtered_id_list[filtered_total - 1]
      const last_list_item_div = this._list_item_div[last_list_item_id]

      last_list_item_div.$element.style.borderBottom = color
    }

    this._dispatch_list_shown()
    if (this._selected_id) {
      this._dispatch_item_selected(this._selected_id)
    }
  }

  private _dispatch_item_selected = (id: string): void => {
    this.dispatchEvent('selected', { id })
  }

  private _dispatch_shape = (): void => {
    this.dispatchEvent('shape', { shape: this._shape })
  }

  private _dispatch_item_pick = (id: string): void => {
    this.dispatchEvent('pick', { id })
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
    this.set_selected_item_id(first_list_item_id)
  }

  private _hide_list = () => {
    this._list_hidden = true
    // this._select_first_list_item()
    this._list.$element.style.display = 'none'
    this._input._input.$element.style.borderTopWidth = '0'

    this._dispatch_list_hidden()
  }

  private _on_list_item_pointer_enter = ({}: IOPointerEvent, id: string) => {
    // console.log('Search', '_on_list_item_pointer_enter')
    this.set_selected_item_id(id)
  }

  private _on_list_item_click = ({}: IOPointerEvent, id: string) => {
    // console.log('Search', '_on_list_item_click')
    this._dispatch_item_pick(id)
  }

  public set_selected_item_id = (id: string): void => {
    const prev_selected_id = this._selected_id
    this._set_selected_item_id(id)
    if (this._selected_id !== prev_selected_id) {
      this._dispatch_item_selected(id)
    }
  }

  private _set_selected_item_id = (id: string): void => {
    // console.log('Search', '_set_selected_item_id', id)
    const { style = {}, selectedColor = 'currentColor' } = this.$props
    const { color = 'currentColor' } = style
    if (this._selected_id) {
      this._set_list_item_color(this._selected_id, color)
    }
    this._selected_id = id
    this._set_list_item_color(id, selectedColor)
    this._scroll_into_item(id)
  }

  private _scroll_into_item = (id: string) => {
    // console.log('Search', '_scroll_into_item', id)
    // const scroll_index = Math.ceil(this._list.$element.scrollTop / HEIGHT)
    const scroll_index = Math.ceil(this._scrollTop / HEIGHT)
    const selected_id_index = this._filtered_id_list.indexOf(id)
    if (
      selected_id_index - scroll_index >= 4 ||
      selected_id_index - scroll_index < 0
    ) {
      // this._list.$element.scrollTop = selected_id_index * HEIGHT
      this._list.$element.scrollTo({
        top: selected_id_index * HEIGHT,
      })
    }
  }

  private _filter_list = () => {
    // console.log('Search', '_filter_list')

    const { specs } = this.$system
    const { style = {}, filter = () => true } = this.$props

    const { color = 'currentColor' } = style

    if (this._filtered_id_list.length > 0) {
      const last_list_item_id =
        this._filtered_id_list[this._filtered_id_list.length - 1]
      const last_list_item_div = this._list_item_div[last_list_item_id]
      last_list_item_div.$element.style.borderBottom = '1px solid currentColor'
    }

    let filtered_id_list: string[] = []

    const filtered_score: Dict<number> = {}

    const fuzzy_pattern = this._input_value

    for (let id of this._ordered_id_list) {
      const { fuzzyName } = this._item[id]
      const list_item_div = this._list_item_div[id]

      const fuzzy_match = fuzzy.match(
        removeWhiteSpace(fuzzy_pattern),
        fuzzyName,
        { caseSensitive: false }
      )

      if (
        (fuzzy_pattern === '' || fuzzy_match) &&
        filter(id) &&
        (this._shape === 'circle' || isComponent(specs, id))
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

    const filtered_total = filtered_id_list.length

    if (filtered_total > 0) {
      for (let i = 0; i < filtered_total; i++) {
        const id = this._filtered_id_list[i]
        const list_item_div = this._list_item_div[id]
        this._list.removeChild(list_item_div)
        this._list.appendChild(list_item_div)
      }

      this._select_first_list_item()

      if (!this._list_hidden) {
        const last_list_item_id = filtered_id_list[filtered_total - 1]
        const last_list_item_div = this._list_item_div[last_list_item_id]

        last_list_item_div.$element.style.borderBottom = color

        this._input._input.$element.style.borderRadius = '0'
        this._input._input.$element.style.borderTopWidth = '1px'
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
  }

  private _on_input_input = (value: string) => {
    this._input_value = value
    this._filter_list()
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
      }
    }
  }

  private _on_ctrl_p_keydown = () => {
    // console.log('Search', 'on_ctrl_p_keydown')
    setTimeout(() => {
      this._hide_list()
    }, 0)
  }

  private _on_escape_keydown = () => {
    // console.log('Search', '_on_escape_keydown')
    setTimeout(() => {
      this._hide_list()
    }, 0)
  }

  private _on_enter_keydown = (): void => {
    if (!this._list_hidden && this._selected_id) {
      setTimeout(() => {
        if (this._selected_id) {
          // AD HOC
          // on Safari apparently selecting the input might inadvertedly refocus it,
          // which is certainly unexpected, so this call must absolutely
          // come before dispatching a (possibly side-effecting) event
          this._select_all()
          this._dispatch_item_pick(this._selected_id)
        }
      }, 0)
    }
  }

  public getValue = (): string => {
    return this._input_value
  }

  public getShape = (): string => {
    return this._shape
  }

  public setValue = (value: string): void => {
    this._input_value = value
    this._input.setProp('value', value)
    this._filter_list()
  }

  public toggleShape = () => {
    const shape = this._shape === 'circle' ? 'rect' : 'circle'
    this.setShape(shape)
  }

  public setShape = (shape: 'rect' | 'circle') => {
    if (this._shape !== shape) {
      this._shape = shape
      this._shape_button.setProp('icon', SHAPE_TO_ICON[shape])
      this._dispatch_shape()
      this._filter_list()
    }
  }

  public onMount(): void {
    // console.log('Search', 'onMount')
  }

  public onConnected(): void {
    console.log('Search', 'onConnected')

    console.log(this.$unit)

    const $pod = this.$unit.$refPod({})

    console.log('$pod', $pod)
  }
}
