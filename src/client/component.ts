import { NOOP } from '../NOOP'
import { $Child } from '../component/Child'
import { $Children } from '../component/Children'
import { Moment } from '../debug/Moment'
import { UnitMoment } from '../debug/UnitMoment'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { $Component } from '../types/interface/async/$Component'
import { $Graph } from '../types/interface/async/$Graph'
import { insert, pull, push, remove, removeAt, unshift } from '../util/array'
import { callAll } from '../util/call/callAll'
import { _if } from '../util/control'
import { appendChild, insertAt, removeChild } from '../util/element'
import { forEachObjKV, get, set } from '../util/object'
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  DEFAULT_TEXT_ALIGN,
} from './DEFAULT_FONT_SIZE'
import { IOElement } from './IOElement'
import { Listener } from './Listener'
import { addListener, addListeners } from './addListener'
import namespaceURI from './component/namespaceURI'
import { componentFromSpecId } from './componentFromSpecId'
import { component_ } from './component_'
import { Context, dispatchContextEvent, dispatchCustomEvent } from './context'
import { makeCustomListener } from './event/custom'
import {
  IOUIEventName,
  UI_EVENT_SET,
  makeUIEventListener,
} from './makeEventListener'
import { mount } from './mount'
import { unmount } from './unmount'
import { NULL_VECTOR, addVector } from './util/geometry'
import { Position, Rect } from './util/geometry/types'
import { getFontSize } from './util/style/getFontSize'
import { getOpacity } from './util/style/getOpacity'
import { getRelativePosition } from './util/style/getPosition'
import { getRect } from './util/style/getRect'
import { Scale, getScale } from './util/style/getScale'
import { getSize } from './util/style/getSize'
import { getTextAlign } from './util/style/getTextAlign'

const $childToComponent = (
  system: System,

  { bundle }: $Child
): Component<IOElement, {}, $Component> => {
  const { unit } = bundle

  const { id, memory = { input: {} } } = unit

  const props = {}

  forEachObjKV(memory.input ?? {}, (pinId, { _data }) => {
    props[pinId] = _data
  })

  const component = componentFromSpecId(system, id, props)

  return component
}

export class Component<
  E extends IOElement = IOElement,
  P extends Dict<any> = {},
  U extends $Component | $Graph = $Component
> {
  static id: string

  public $_: string[] = []
  public $element: E
  public $props: P
  public $changed: Set<string> = new Set()

  public $system: System

  public $globalId: string
  public $remoteGlobalId: string

  public $ref: Dict<Component<any>> = {}

  public $context: Context

  public $connected: boolean = false
  public $unit: U

  public $primitive: boolean = true

  public $propUnlisten: Dict<Unlisten> = {}

  // AD HOC
  // Avoid recursively connecting "JavaScript Defined Components"
  public $unbundled: boolean = true

  public $children: Component[] = []
  public $slotChildren: Dict<Component[]> = { default: [] }
  public $childSlotName: string[] = []

  public $slot: Dict<Component> = { default: this }
  public $slotId: Dict<string> = {}
  public $slotTarget: Dict<string> = {}

  public $subComponent: Dict<Component> = {}

  public $root: Component[] = []

  public $wrap: boolean = false

  public $shadowSlot: HTMLSlotElement

  public $parentRoot: Component[] = []
  public $parentRootSlotName: string[] = []

  public $parentChildren: Component[] = []
  public $parentChildrenSlot: string[] = []

  public $mountRoot: Component[] = []
  public $mountParentRoot: Component[] = []
  public $mountParentChildren: Component[] = []

  public $parent: Component | null = null
  public $slotParent: Component | null = null

  public $mounted: boolean = false

  public $listenCount: Dict<number> = {}

  private $transaction: boolean = false

  constructor($props: P, $system: System, $element?: E) {
    this.$props = $props
    this.$system = $system
    this.$element = $element

    this.$globalId = this.$system.registerComponent(this)
  }

  getProp(name: string): any {
    return this.$props[name]
  }

  setProp<K extends keyof P>(prop: K, data: P[K]) {
    this.$props[prop] = data

    if (this.$mounted) {
      this._onPropChanged(prop, data)
    } else {
      this.$changed.add(prop)
    }
  }

  private _prop_transformer: Dict<Callback[]> = {}

  interceptProp(prop: string, transformer: Callback): Unlisten {
    this._prop_transformer[prop] = this._prop_transformer[prop] || []
    this._prop_transformer[prop].push(transformer)

    return () => {
      remove(this._prop_transformer[prop], transformer)
    }
  }

  getSlot(slotName: string): Component {
    return this.$slot[slotName]
  }

  onPropChanged(prop: string, current: any) {}

  _onPropChanged(prop: string, current: any) {
    const _current = (this._prop_transformer[prop] || []).reduce((acc, t) => {
      return t(acc)
    }, current)

    this.onPropChanged(prop, _current ?? current)
  }

  refreshProp(prop: string) {
    this._onPropChanged(prop, this.$props[prop])
  }

  onConnected($unit: U) {}

  onDisconnected() {}

  onMount() {}

  onUnmount($context: Context) {}

  onDestroy() {}

  dispatchEvent(type: string, detail: any = {}, bubbles: boolean = true) {
    if (this.$primitive) {
      dispatchCustomEvent(this.$element, type, detail, bubbles)
    } else {
      if (this.$mounted) {
        dispatchCustomEvent(this.$slotParent.$element, type, detail, bubbles)
      } else {
        dispatchCustomEvent(this.$element, type, detail, bubbles)
      }
    }
  }

  dispatchContextEvent(type: string, data: any = {}) {
    if (this.$context) {
      dispatchContextEvent(this.$context, type, data)
    }
  }

  stopPropagation(event: string): void {
    this.$element.addEventListener(
      event,
      function (event: Event) {
        event.stopPropagation()
      },
      { passive: true }
    )
  }

  stopImmediatePropagation(event: string): void {
    this.$element.addEventListener(
      event,
      function (event: Event) {
        event.stopImmediatePropagation()
      },
      { passive: true }
    )
  }

  preventDefault(event: string): Unlisten {
    const listener = (event: Event) => {
      event.preventDefault()
      return false
    }

    const opt = { passive: false }

    this.$element.addEventListener(event, listener, opt)

    return () => {
      // @ts-ignore
      this.$element.removeEventListener(event, listener, opt)
    }
  }

  private _releasePointerCapture: Dict<Unlisten> = {}

  hasPointerCapture(pointerId: number): boolean {
    return !!this._releasePointerCapture[pointerId]
  }

  setPointerCapture(pointerId: number): void {
    const {
      api: {
        input: {
          pointer: { setPointerCapture },
        },
      },
    } = this.$system
    // console.log(this.constructor.name, 'setPointerCapture', pointerId)

    if (this.$element instanceof Text) {
      throw new Error('cannot set pointer capture on a text element')
    }

    this._releasePointerCapture[pointerId] = setPointerCapture(
      this.$element,
      pointerId
    )
  }

  releasePointerCapture(pointerId: number): void {
    // console.log(this.constructor.name, 'releasePointerCapture', pointerId)

    const release = this._releasePointerCapture[pointerId]

    if (release) {
      release()

      delete this._releasePointerCapture[pointerId]
    } else {
      // throw new Error('element is not capturing pointer')
    }
  }

  scrollIntoView(opt: ScrollIntoViewOptions): void {
    if (this.$slot['default'] === this) {
      if (this.$element instanceof HTMLElement) {
        this.$element.scrollIntoView(opt)
      }
    } else {
      this.$slot['default'].scrollIntoView(opt)
    }
  }

  public mountChild(child: Component, commit: boolean = true): void {
    child.mount(this.$context, commit)
  }

  public unmountDescendent(child: Component): void {
    return child.unmount()
  }

  private _forAllMountDescendent(callback: Callback<Component>): void {
    for (const subComponent of this.$mountRoot) {
      callback(subComponent)
    }

    for (const subComponent of this.$mountParentChildren) {
      callback(subComponent)
    }
  }

  commit() {
    this.onMount()

    this._forAllMountDescendent((child) => {
      child.commit()
    })

    const $changed = new Set(this.$changed)

    for (const name of $changed) {
      const current = this.$props[name]

      this.$changed.delete(name)

      this._onPropChanged(name, current)
    }

    if (this.$listenCount['mount']) {
      this.dispatchEvent('mount', {}, false)
    }
  }

  mount($context: Context, commit: boolean = true): void {
    // console.log(this.constructor.name, 'mount')

    if (this.$mounted) {
      throw new Error('cannot mount a mounted component')
    }

    this.$context = $context
    this.$mounted = true

    this._forAllMountDescendent((child) => {
      this.mountChild(child, false)
    })

    if (commit) {
      this.commit()
    }
  }

  unmount() {
    // console.log(this.constructor.name, 'unmount')

    if (!this.$mounted) {
      throw new Error('cannot unmount unmounted component')
    }

    const $context = this.$context

    this._forAllMountDescendent((child) => {
      this.unmountDescendent(child)
    })

    this.$mounted = false

    this.$context = null

    this.onUnmount($context)

    if (this.$listenCount['unmount']) {
      this.dispatchEvent('unmount', {}, false)
    }
  }

  focus(options: FocusOptions | undefined = { preventScroll: true }) {
    if (this.$slot['default'] === this) {
      if (this.$element instanceof Text) {
        return
      }

      if (this.$primitive) {
        this.$element.focus(options)
      } else {
        if (this.$root.length > 0) {
          this.$root[0].focus(options)
        }
      }
    } else {
      this.$slot['default'].focus(options)
    }
  }

  blur() {
    if (this.$slot['default'] === this) {
      if (this.$element instanceof Text) {
        return
      }

      if (!this.$primitive) {
        let i = 0

        while (this.$root[i] instanceof Text) {
          i++
        }

        this.$mountRoot[i].blur()
      } else {
        this.$element.blur()
      }
    } else {
      this.$slot['default'].blur()
    }
  }

  deselect(): void {
    const {
      api: {
        selection: { removeSelection },
      },
    } = this.$system

    if (this.containsSelection()) {
      removeSelection()
    }
  }

  containsSelection(): boolean {
    const {
      api: {
        selection: { containsSelection },
      },
    } = this.$system

    if (!this.$primitive) {
      return this.$root.some((root) => root.containsSelection())
    } else {
      return containsSelection(this.$element)
    }
  }

  animate(keyframes, options): Animation {
    if (this.$slot['default'] === this) {
      if (!this.$primitive) {
        let i = 0

        while (this.$element[i] instanceof Text) {
          i++
        }

        return (this.$element[i] as HTMLElement | SVGElement).animate(
          keyframes,
          options
        )
      } else {
        if (this.$element instanceof Text) {
          return
        }

        return this.$element.animate?.(keyframes, options)
      }
    } else {
      return this.$slot['default'].animate?.(keyframes, options)
    }
  }

  getOffset(): Component {
    let offset: Component = this

    // while (
    //   offset &&
    //   (!(offset.$element instanceof HTMLElement) ||
    //     offset.$element.style.position === '' ||
    //     offset.$element.style.position === 'contents') &&
    //   offset.$element instanceof HTMLElement &&
    //   offset.$element.style.display !== 'flex'
    // ) {
    //   offset = offset.$slotParent
    // }

    if (this.isSVG()) {
      return offset
    }

    while (
      offset &&
      !(
        offset.$element instanceof HTMLElement &&
        offset.$element.style.display !== 'contents' &&
        (offset.$element.style.position === '' ||
          offset.$element.style.position === 'relative' ||
          offset.$element.style.position === 'absolute')
      )
    ) {
      offset = offset.$slotParent
    }

    return offset
  }

  getElementPosition() {
    if (!this.$mounted) {
      throw new Error('cannot calculate position of unmounted component')
    }

    const context_position = {
      x: this.$context.$x,
      y: this.$context.$y,
    }

    if (!this.$primitive) {
      throw new Error('cannot calculate position of multiple elements')
    }

    const relative_position = getRelativePosition(
      this.$element,
      this.$context.$element
    )

    const position = addVector(context_position, relative_position)

    return position
  }

  getElementSize() {
    if (!this.$primitive) {
      throw new Error('cannot calculate size of multiple elements')
    }

    return getSize(this.$element)
  }

  getFontSize(): number {
    if (this.$primitive) {
      const fontSize = getFontSize(this.$element)

      if (fontSize) {
        return fontSize
      }
    }

    if (this.$slotParent) {
      return this.$slotParent.getFontSize()
    }

    return DEFAULT_FONT_SIZE
  }

  getOpacity(): number {
    if (this.$primitive) {
      const opacity = getOpacity(this.$element)

      if (opacity !== undefined) {
        return opacity
      }
    }

    if (this.$slotParent) {
      return this.$slotParent.getOpacity()
    }

    return DEFAULT_OPACITY
  }

  getScale(): Scale {
    let scale = { sx: 1, sy: 1 }

    if (this.$primitive) {
      scale = getScale(this.$element)
    }

    if (this.$slotParent) {
      const parentScale = this.$slotParent.getScale()

      return { sx: scale.sx * parentScale.sx, sy: scale.sy * parentScale.sy }
    }

    return scale
  }

  getTextAlign(): string {
    if (this.$primitive) {
      const textAlign = getTextAlign(this.$element)

      if (textAlign) {
        return textAlign
      }
    }

    if (this.$parent) {
      return this.$parent.getTextAlign()
    }

    return DEFAULT_TEXT_ALIGN
  }

  getRootPosition(rootId: string): Position {
    // TODO
    return NULL_VECTOR
  }

  getParentRootPosition(
    subComponentId: string,
    parentRootId: string
  ): Position {
    // TODO
    return NULL_VECTOR
  }

  isSVG(): boolean {
    return (
      this.$element instanceof SVGElement &&
      !(this.$element instanceof SVGSVGElement)
    )
  }

  isHMTL(): boolean {
    return this.$element instanceof HTMLElement
  }

  isText(): boolean {
    return this.$element instanceof Text
  }

  isBase(): boolean {
    return this.$primitive && this.$root.length === 0
  }

  getRootBase(path: string[] = []): [string[], Component][] {
    if (this.isBase()) {
      return [[path, this]]
    }

    let p = []

    for (const subComponent of this.$root) {
      const subComponentId = this.getSubComponentId(subComponent)

      const subComponentRootBase = subComponent.getRootBase([
        ...path,
        subComponentId,
      ])

      p = [...p, ...subComponentRootBase]
    }

    return p
  }

  getBase(path: string[] = []): [string[], Component][] {
    if (this.isBase()) {
      return [[path, this]]
    }

    let p = []

    const appendSubComponent = (subComponent: Component) => {
      const subComponentId = this.getSubComponentId(subComponent)
      const subComponentRootBase = subComponent.getRootBase([
        ...path,
        subComponentId,
      ])

      p = [...p, ...subComponentRootBase]

      for (const _subComponent of subComponent.$parentRoot) {
        appendSubComponent(_subComponent)
      }
    }

    for (const subComponent of this.$root) {
      appendSubComponent(subComponent)
    }

    return p
  }

  pathGetSubComponent(path: string[]): Component {
    if (path.length == 0) {
      return this
    } else {
      const [head, ...tail] = path
      const subComponent = this.getSubComponent(head)
      return subComponent.pathGetSubComponent(tail)
    }
  }

  getRect(): Rect {
    return getRect(this.$element)
  }

  getBoundingClientRect(): {
    x: number
    y: number
    width: number
    height: number
  } {
    if (this.$context) {
      if (!this.$primitive) {
        throw new Error('cannot calculate position of multiple elements.')
      }

      if (this.$element instanceof Text) {
        // RETURN
        return
      }

      const { $x, $y, $sx, $sy } = this.$context

      const bcr: Rect = this.$element.getBoundingClientRect()

      const { x, y, width, height } = bcr

      return {
        x: (x - $x) / $sx,
        y: (y - $y) / $sy,
        width: width / $sx,
        height: height / $sy,
      }
    } else {
      throw new Error('component not mounted')
    }
  }

  appendChild(child: Component, slotName: string = 'default'): number {
    // console.log('Component', 'appendChild', slotName)
    const at = this.$children.length

    this.memAppendChild(child, slotName, at)
    this.domAppendChild(child, slotName, at)
    this.postAppendChild(child, slotName, at)

    return at
  }

  public memAppendChild(child: Component, slotName: string, at: number): void {
    // console.log('Component', 'memAppendChild')
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []
    this.$slotChildren[slotName].push(child)
    this.$children.push(child)
    this.$childSlotName[at] = slotName

    const slot = this.$slot[slotName]

    slot.memAppendParentChild(child, slotName, at, at)
  }

  public domAppendChild(child: Component, slotName: string, at: number): void {
    // console.log('Component', '_domAppendChild')

    // BUG
    let slot = this.$slot[slotName]

    while (slot.$slot[slotName] && slot.$slot[slotName] !== slot) {
      slot = slot.$slot[slotName]
    }

    slot.domAppendParentChildAt(child, slotName, at, at)

    child.$slotParent = slot
  }

  public postAppendChild(child: Component, slotName: string, at: number): void {
    const slot = this.$slot[slotName]

    slot.postAppendParentChild(child, slotName, at)
  }

  public createSVGWrapper(): Component<SVGSVGElement> {
    const {
      api: {
        document: { createElementNS },
      },
    } = this.$system

    const element = createElementNS(namespaceURI, 'svg')

    element.style.display = 'block'
    element.style.width = '100%'
    element.style.height = '100%'

    const component = new Component({}, this.$system, element)

    return component
  }

  private _createHTMLWrapper(): Component<HTMLDivElement> {
    const {
      api: {
        document: { createElement },
      },
    } = this.$system

    const element = createElement('div')

    element.style.width = '100%'
    element.style.height = '100%'

    const component = new Component({}, this.$system, element)

    return component
  }

  public templateChildWrapper(child, svg, html, fallback) {
    if (this.isHMTL() && child.isSVG()) {
      return svg()
    } else if (this.isSVG() && child.isHMTL()) {
      return html()
    } else {
      return fallback()
    }
  }

  public domRemoveChild(child: Component, slotName: string, at: number): void {
    const slot = this.$slot[slotName]

    slot.domRemoveParentChildAt(child, slotName, at, at)

    child.$slotParent = null
  }

  public postRemoveChild(child: Component, at: number): void {
    if (this.$mounted) {
      child.unmount()
    }
  }

  public hasChild(at: number): boolean {
    const has = this.$children.length > at
    return has
  }

  public ascendChild(child: Component, slotName: string = 'default'): void {
    this.removeChild(child)
    this.appendChild(child, slotName)
  }

  public $listener: Listener[] = []
  public $unlisten: Unlisten[] = []

  public $named_listener_count: Dict<number> = {}
  public $named_unlisten: Dict<Unlisten> = {}

  private _unit_unlisten: Unlisten

  private _addUnitEventListener = (event: IOUIEventName): void => {
    if (event.startsWith('_')) {
      const _event = event.slice(1)

      const unlisten = this.addEventListener(
        makeCustomListener(_event, (data) => {
          const $emitter = this.$unit.$refEmitter({ _: ['EE'] })

          $emitter.$emit({ type: event, data }, NOOP)
        })
      )

      this.$named_unlisten[event] = unlisten
    } else {
      const unlisten = this.addEventListener(
        makeUIEventListener(event, (data) => {
          const $emitter = this.$unit.$refEmitter({ _: ['EE'] })

          $emitter.$emit({ type: event, data }, NOOP)
        })
      )

      this.$named_unlisten[event] = unlisten
    }
  }

  private _removeUnitEventListener = (event: string): void => {
    const unlisten = this.$named_unlisten[event]
    delete this.$named_unlisten[event]
    unlisten()
  }

  public connect($unit: U, deep: boolean = true): void {
    if (this.$connected) {
      // throw new Error('component is already connected')
      return
    }

    this._connect($unit, deep)

    if (deep) {
      if (this.$unbundled) {
        for (const unitId in this.$subComponent) {
          const childSubComponent = this.$subComponent[unitId]

          const _ = component_(childSubComponent)

          const subUnit = ($unit as $Graph).$refSubComponent({ unitId, _ })

          childSubComponent.connect(subUnit)
        }
      }
    }
  }

  public _connect($unit: U, deep: boolean = true): void {
    // console.log(this.constructor.name, 'connect')

    if (this.$connected) {
      // throw new Error('component is already connected')
      return
    }

    this.$unit = $unit

    const listen = (event: IOUIEventName): void => {
      this.$named_listener_count[event] = this.$named_listener_count[event] || 0
      this.$named_listener_count[event]++

      if (!this.$named_unlisten[event]) {
        this._addUnitEventListener(event)
      }
    }

    const unlisten = (event: string): void => {
      this.$named_listener_count[event]--

      if (this.$named_listener_count[event] === 0) {
        this._removeUnitEventListener(event)
      }
    }

    const handler = {
      unit: (moment: UnitMoment) => {
        const { event: event_event, data: event_data } = moment
        if (event_event === 'append_child') {
          const bundle = event_data

          const at = this.$children.length

          const child = this._$instanceChild({ bundle }, at)

          const slot_name = 'default'

          this.appendChild(child, slot_name)
        } else if (event_event === 'remove_child') {
          const at = event_data

          this.removeChildAt(at)
        }
      },
    }

    const unit_listener = (moment: Moment): void => {
      const { type } = moment
      handler[type] && handler[type](moment)
    }

    this.$named_listener_count = {}

    $unit.$getGlobalId({}, (remoteGlobalId: string) => {
      this.$remoteGlobalId = remoteGlobalId

      this.$system.registerRemoteComponent(this.$globalId, remoteGlobalId)
    })

    const all_unlisten: Unlisten[] = []

    const events = ['append_child', 'remove_child']

    const unit_unlisten = this.$unit.$watch({ events }, unit_listener)

    all_unlisten.push(unit_unlisten)

    const $emitter = $unit.$refEmitter({ _: ['EE'] })

    $emitter.$eventNames({}, (events: string[]) => {
      for (const event of events) {
        if (UI_EVENT_SET.has(event as IOUIEventName) || event.startsWith('_')) {
          listen(event as IOUIEventName)
        }
      }
    })

    const unlisten_emitter = callAll([
      $emitter.$addListener({ event: 'listen' }, ({ event }) => {
        if (UI_EVENT_SET.has(event as IOUIEventName) || event.startsWith('_')) {
          listen(event)
        }
      }),
      $emitter.$addListener({ event: 'unlisten' }, ({ event }) => {
        if (
          UI_EVENT_SET.has((event as IOUIEventName) || event.startsWith('_'))
        ) {
          unlisten(event)
        }
      }),
      $emitter.$addListener({ event: 'call' }, ({ method, data }) => {
        this._call(method, data)
      }),
    ])

    all_unlisten.push(unlisten_emitter)

    this._unit_unlisten = callAll(all_unlisten)

    $unit.$children({}, (children: $Children) => {
      if (children.length > 0) {
        const _children = children.map(this._$instanceChild)

        this.setChildren(_children)
      }
    })
    this.$connected = true

    this.onConnected($unit)
  }

  private _$instanceChild = ($child: $Child, at: number) => {
    const component = $childToComponent(this.$system, $child)

    const _ = component_(component)

    const $childRef = this.$unit.$refChild({ at, _ })

    component.connect($childRef)

    return component
  }

  public disconnect(deep: boolean = true): void {
    this._disconnect()

    if (this.$unbundled) {
      for (const subUnitId in this.$subComponent) {
        const childSubComponent = this.$subComponent[subUnitId]
        childSubComponent.disconnect()
      }
    }
  }

  public _disconnect(deep: boolean = true): void {
    // console.log(this.constructor.name, 'disconnect')

    if (!this.$connected) {
      throw new Error('component is not already disconnected')

      return
    }

    this._unit_unlisten()

    for (const child of this.$children) {
      child.disconnect()
    }

    this.$connected = false

    this.onDisconnected()
  }

  public setChildren(
    children: Component[] = [],
    slotNames: string[] = []
  ): void {
    const oldChildren = [...this.$children]

    for (const oldChild of oldChildren) {
      this.removeChild(oldChild)
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const slotName = slotNames[i]

      this.appendChild(child, slotName)
    }
  }

  public memRemoveChildAt(
    child: Component,
    slotName: string,
    at: number
  ): void {
    const slot = this.$slot[slotName]

    slot.memRemoveParentChildAt(child, slotName, at, at)

    remove(this.$slotChildren[slotName], child)
    removeAt(this.$children, at)
    removeAt(this.$childSlotName, at)
  }

  public removeChildAt(at: number): number {
    const child = this.$children[at]
    const slotName = this.$childSlotName[at]

    this.memRemoveChildAt(child, slotName, at)
    this.domRemoveChild(child, slotName, at)
    this.postRemoveChild(child, at)

    return at
  }

  public removeChild(child: Component): number {
    // console.log('Component', 'removeChild')
    const at = this.$children.indexOf(child)

    if (at > -1) {
      return this.removeChildAt(at)
    } else {
      throw new Error('child component not found')
    }
  }

  public removeChildren(): void {
    const children = [...this.$children]
    for (const child of children) {
      this.removeChild(child)
    }
  }

  public hasRoot(component: Component): boolean {
    return this.$root.includes(component)
  }

  public pushRoot(component: Component): void {
    if (this.$root.indexOf(component) > -1) {
      throw new Error('component is already a root')
    }

    this.$root.push(component)
  }

  public pullRoot(component: Component): void {
    const index = this.$root.indexOf(component)
    if (index > -1) {
      this.$root.splice(index, 1)
    } else {
      throw new Error('cannot pull; not root component')
    }
  }

  public fitRoot(component: Component, at: number): void {
    this.$root.splice(at, 0, component)
  }

  public registerRoot(component: Component): void {
    this.pushRoot(component)
    this.appendRoot(component)
  }

  public registerRootAt(component: Component, at: number): void {
    insert(this.$root, component, at)
    this.insertRootAt(component, at)
  }

  public unregisterRoot(component: Component): void {
    this.pullRoot(component)
    this.removeRoot(component)
  }

  public memAppendRoot(component: Component): void {
    if (this.$mountRoot.indexOf(component) > -1) {
      throw new Error('root is already mounted')
    }

    push(this.$mountRoot, component)
  }

  public postAppendRoot(component: Component): void {
    _if(this.$mounted, mount, component, this.$context)
  }

  public domAppendRoot(component: Component): void {
    set(component, '$slotParent', this)

    if (!this.$primitive) {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domAppendRoot(root)
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domAppendParentChildAt(
            component,
            'default',
            this.$slotParent.$mountParentChildren.length,
            this.$slotParent.$mountParentChildren.length
          )
        } else {
          this.domCommitAppendChild(component)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domAppendRoot(root)
        }
      } else {
        this.domCommitAppendChild(component)
      }
    }
  }

  protected domCommitAppendChild(component: Component) {
    appendChild(this.$element, component.$element)

    // set(component, '$slotParent', this)
  }

  protected domCommitInsertChild(component: Component, at: number) {
    insertAt(this.$element, component.$element, at)

    // set(component, '$slotParent', this)
  }

  public appendRoot(component: Component): void {
    // console.log('Component', 'appendRoot', component)

    this.memAppendRoot(component)
    this.domAppendRoot(component)
    this.postAppendRoot(component)
  }

  public insertRootAt(component: Component, _at: number): void {
    this.memInsertRootAt(component, _at)
    this.domInsertRootAt(component, _at)
    this.postInsertRootAt(component, _at)
  }

  public postInsertRootAt(component: Component, _at: number): void {
    this.$mounted && this.mountChild(component)
  }

  public memInsertRootAt(component: Component, _at: number): void {
    if (this.$mountRoot.indexOf(component) > -1) {
      throw new Error('root is already mounted')
    }
    insert(this.$mountRoot, component, _at)
  }

  public domInsertRootAt(component: Component, _at: number): void {
    set(component, '$slotParent', this)

    if (!this.$primitive) {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          if (this.$slotParent) {
            const index = this.$parent?.$root.includes(this)
              ? this.$parent?.$root.indexOf(this)
              : this.$slotParent.$mountParentChildren.indexOf(this)

            this.$slotParent.domInsertParentChildAt(
              component,
              'default',
              index + _at
            )
          } else {
            this.domCommitInsertChild(root, _at)
          }
        }
      } else {
        if (this.$slotParent) {
          let p: Component = this
          let index: number = this.$slotParent.$mountParentChildren.indexOf(p)

          while (p && !this.$slotParent.$mountParentChildren.includes(p)) {
            p = p.$parent
            index = this.$slotParent.$mountParentChildren.indexOf(p)
          }

          this.$slotParent.domInsertParentChildAt(
            component,
            'default',
            index + _at
          )
        } else {
          this.domCommitInsertChild(component, _at)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domInsertRootAt(root, _at)
        }
      } else {
        this.domCommitInsertChild(component, _at)
      }
    }
  }

  public appendAllRoot(): void {
    for (const root of this.$root) {
      this.appendRoot(root)
    }
  }

  public appendAllMissingRoot(): void {
    for (const root of this.$root) {
      if (this.$mountRoot.includes(root)) {
        //
      } else {
        this.appendRoot(root)
      }
    }
  }

  public removeAllRoot(): void {
    for (const root of [...this.$mountRoot]) {
      this.removeRoot(root)
    }
  }

  public removeRoot(component: Component): void {
    const at = this.$root.indexOf(component)

    this.domRemoveRoot(component, at)
    this.memRemoveRoot(component)
    this.postRemoveRoot(component)
  }

  public memRemoveRoot(component: Component): void {
    pull(this.$mountRoot, component)
  }

  public domRemoveRoot(component: Component, at: number): void {
    if (!this.$primitive) {
      if (!component.$primitive) {
        for (let i = 0; i < component.$mountRoot.length; i++) {
          if (this.$slotParent) {
            this.$slotParent.domRemoveParentChildAt(
              component.$mountRoot[i],
              'default',
              at,
              at
            )
          } else {
            this.domCommitRemoveChild(component)
          }

          appendChild(component.$element, component.$mountRoot[i].$element)
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domRemoveParentChildAt(component, 'default', at, at)
        } else {
          this.domCommitRemoveChild(component)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domRemoveRoot(root, at)

          appendChild(component.$element, root.$element)
        }
      } else {
        this.domCommitRemoveChild(component)
      }
    }
  }

  public postRemoveRoot(component: Component): void {
    _if(this.$mounted, unmount, component)
  }

  public compose(): void {
    for (const component of this.$root) {
      component.collapse()

      this.appendRoot(component)
    }
  }

  public decompose(deep: boolean = true): void {
    for (const component of [...this.$mountRoot]) {
      this.removeRoot(component)

      deep && component.uncollapse(deep)
    }
  }

  public startTransaction(): Unlisten {
    const unlisten = this._startTransaction()

    const allUnlisten: Unlisten[] = [unlisten]

    for (const subComponentId in this.$subComponent) {
      const subComponent = this.$subComponent[subComponentId]

      const subComponentUnlisten = subComponent.startTransaction()

      allUnlisten.push(subComponentUnlisten)
    }

    return callAll(allUnlisten)
  }

  private _startTransaction(): Unlisten {
    this.$transaction = true

    return () => {
      this.$transaction = false
    }
  }

  public hasParentRoot(component: Component): boolean {
    return this.$parentRoot.includes(component)
  }

  public pushParentRoot(component: Component, slotName: string): void {
    push(this.$parentRoot, component)
    push(this.$parentRootSlotName, slotName)

    const slot = get(this.$slot, slotName)

    slot.memPushParentChild(component, slotName)
  }

  public insertParentRoot(
    component: Component,
    at: number,
    slotName: string
  ): void {
    insert(this.$parentRoot, component, at)
    insert(this.$parentRootSlotName, slotName, at)
  }

  public unshiftParentRoot(component: Component, slotName: string): void {
    unshift(this.$parentRoot, component)
    unshift(this.$parentRootSlotName, slotName)
  }

  public pullParentRoot(component: Component): void {
    // console.log(this.constructor.name, 'pullParentRoot')

    const i = this.$parentRoot.indexOf(component)

    if (i > -1) {
      removeAt(this.$parentRoot, i)

      const [slotName] = removeAt(this.$parentRootSlotName, i)

      const slot = get(this.$slot, slotName)

      slot.memPullParentChild(component, i)
    } else {
      throw new Error('parent root not found')
    }
  }

  public registerParentRoot(
    component: Component,
    slotName: string = 'default'
  ): void {
    this.pushParentRoot(component, slotName)
    this.appendParentRoot(component, slotName)
  }

  public unregisterParentRoot(component: Component): void {
    // console.log('unregisgerParentRoot')
    this.removeParentRoot(component)
    this.pullParentRoot(component)
  }

  public collapse(deep: boolean = true): void {
    let i = 0

    for (const component of this.$parentRoot) {
      const slotName = this.$parentRootSlotName[i]

      deep && component.collapse()

      this.appendParentRoot(component, slotName)

      i++
    }
  }

  public uncollapse(deep: boolean = true): void {
    for (const component of this.$parentRoot) {
      this.removeParentRoot(component)

      deep && component.uncollapse(deep)
    }
  }

  public appendParentRoot(component: Component, slotName: string): void {
    // console.log(
    //   this.constructor.name,
    //   'appendParentRoot',
    //   component.constructor.name
    // )
    const at = this.$parentRoot.indexOf(component)

    this.memAppendParentRoot(component, slotName, at)
    this.domAppendParentRoot(component, slotName, at)
    this.postAppendParentRoot(component, slotName, at)
  }

  public memAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    // console.log(this.constructor.name, 'memAppendParentRoot', component.constructor.name, slotName, at)

    push(this.$mountParentRoot, component)

    const slot = get(this.$slot, slotName)

    slot.memAppendParentChild(component, 'default', at, at)
  }

  public domAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    const slot = get(this.$slot, slotName)

    slot.domAppendParentChildAt(component, 'default', at, at)
  }

  public postAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    const slot = get(this.$slot, slotName)

    slot.postAppendParentChild(component, slotName, at)
  }

  public memPushParentChild(component: Component, slotName: string): void {
    push(this.$parentChildren, component)
    push(this.$parentChildrenSlot, slotName)
  }

  public memPullParentChild(component, _at: number): void {
    removeAt(this.$parentChildren, _at)
    removeAt(this.$parentChildrenSlot, _at)
  }

  public memAppendParentChild(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    push(this.$mountParentChildren, component)
  }

  public domAppendParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    if (!this.$primitive) {
      if (!component.$primitive) {
        for (let i = 0; i < component.$mountRoot.length; i++) {
          this.domAppendParentChildAt(
            component.$mountRoot[i],
            slotName,
            at,
            at + i
          )
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domAppendParentChildAt(
            component,
            'default',
            this.$slotParent.$mountParentChildren.length,
            this.$slotParent.$mountParentChildren.length
          )
        } else {
          this.domCommitAppendChild(component)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domAppendParentChildAt(root, slotName, at, at)
        }
      } else {
        this.domCommitAppendChild(component)
      }
    }

    set(component, '$slotParent', this)
  }

  public postAppendParentChild(
    component: Component,
    slotName: string,
    at: number
  ): void {
    if (this.$mounted) {
      this.mountChild(component)
    }
  }

  public postInsertParentChildAt(
    component: Component,
    slotName: string,
    at: number
  ) {
    if (this.$mounted) {
      this.mountChild(component)
    }
  }

  public insertParentChildAt(
    component: Component,
    slotName: string,
    i: number
  ): void {
    const slot = this.$slot[slotName]
    if (this === slot) {
      this.memInsertParentChildAt(component, slotName, i)
      this.domInsertParentChildAt(component, slotName, i)
      this.postInsertParentChildAt(component, slotName, i)
    } else {
      slot.insertParentChildAt(component, 'default', i)
    }
  }

  public memInsertParentChildAt(
    component: Component,
    slotName: string,
    i: number
  ): void {
    if (this.$mountRoot.indexOf(component) > -1) {
      throw new Error('root is already mounted')
    }

    insert(this.$mountParentChildren, component, i)
  }

  public domInsertParentChildAt(
    component: Component,
    slotName: string,
    i: number
  ): void {
    set(component, '$slotParent', this)

    if (!this.$primitive) {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          if (this.$slotParent) {
            const index = this.$parent?.$root.includes(this)
              ? this.$parent?.$root.indexOf(this)
              : this.$slotParent.$mountParentChildren.indexOf(this)

            this.$slotParent.domInsertParentChildAt(
              component,
              'default',
              index + i
            )
          } else {
            this.domCommitInsertChild(root, i)
          }
        }
      } else {
        if (this.$slotParent) {
          const index = this.$parent?.$root.includes(this)
            ? this.$slotParent.$mountParentChildren.indexOf(this.$parent)
            : this.$slotParent.$mountParentChildren.indexOf(this)

          this.$slotParent.domInsertParentChildAt(
            component,
            'default',
            index + i
          )
        } else {
          this.domCommitInsertChild(component, i)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domInsertParentChildAt(root, 'default', i)
        }
      } else {
        this.domCommitInsertChild(component, i)
      }
    }
  }

  public removeParentChild(
    component: Component,
    slotName: string = 'default',
    at: number
  ): void {
    const slot = this.$slot[slotName]
    if (slot === this) {
      const _at = this.$parentChildren.indexOf(component)
      this.domRemoveParentChildAt(component, slotName, at, _at)
      this.memRemoveParentChildAt(component, slotName, at, _at)
    } else {
      slot.removeParentChild(component, 'default', at)
    }
  }

  public memRemoveParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log(this.constructor.name, 'memRemoveParentChildAt')

    const __at = this.$mountParentChildren.indexOf(component)

    removeAt(this.$mountParentChildren, __at)
  }

  public domRemoveParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    if (!this.$primitive) {
      if (!component.$primitive) {
        for (let i = 0; i < component.$mountRoot.length; i++) {
          if (this.$slotParent) {
            this.$slotParent.domRemoveParentChildAt(
              component.$mountRoot[i],
              slotName,
              at,
              at
            )
          } else {
            this.domCommitRemoveChild(component)
          }

          appendChild(component.$element, component.$mountRoot[i].$element)
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domRemoveParentChildAt(component, 'default', at, at)
        } else {
          this.domCommitRemoveChild(component)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domRemoveParentChildAt(root, slotName, at, at)

          appendChild(component.$element, root.$element)
        }
      } else {
        this.domCommitRemoveChild(component)
      }
    }

    set(component, '$slotParent', null)
  }

  protected domCommitRemoveChild(component: Component) {
    removeChild(this.$element, component.$element)
  }

  public insertParentRootAt(
    component: Component,
    at: number,
    slotName: string
  ): void {
    this.memInsertParentRootAt(component, at, slotName)
    this.domInsertParentRootAt(component, at, slotName)
    this.postInsertParentRootAt(component, at, slotName)
  }

  public memInsertParentRootAt(
    component: Component,
    i: number,
    slotName: string
  ): void {
    insert(this.$mountParentRoot, component, i)
    const slot = get(this.$slot, slotName)
    slot.memInsertParentChildAt(component, slotName, i)
  }

  public domInsertParentRootAt(
    component: Component,
    i: number,
    slotName: string
  ): void {
    const slot = get(this.$slot, slotName)
    slot.domInsertParentChildAt(component, slotName, i)
  }

  public postInsertParentRootAt(
    component: Component,
    _at: number,
    slotName: string
  ): void {
    const slot = get(this.$slot, slotName)
    slot.postInsertParentChildAt(component, slotName, _at)
  }

  public prependParentRoot(component: Component, slotName: string): void {
    this.insertParentRootAt(component, 0, slotName)
  }

  public removeParentRoot(component: Component): void {
    const at = this.$parentRoot.indexOf(component)
    const _at = this.$mountParentRoot.indexOf(component)
    const slotName = this.$parentRootSlotName[at]
    this.postRemoveParentRootAt(component, slotName, at, _at)
    this.domRemoveParentRootAt(component, slotName, at, _at)
    this.memRemoveParentRootAt(component, slotName, at, _at)
  }

  public memRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    pull(this.$mountParentRoot, component)

    const slot = this.$slot[slotName]

    slot.memRemoveParentChildAt(component, 'default', at, _at)
  }

  public domRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log(this.constructor.name, 'domRemoveParentRootAt', component.constructor.name, slotName, at, _at)
    const slot = this.$slot[slotName]
    slot.domRemoveParentChildAt(component, 'default', at, _at)
  }

  public postRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    if (this.$mounted) {
      component.unmount()
    }
  }

  public getSubComponent(id: string): Component {
    return this.$subComponent[id]
  }

  public setSubComponent(id: string, component: Component): void {
    set(component, '$parent', this)

    this.$subComponent[id] = component
  }

  public setSubComponents(component_map: Dict<Component>): void {
    forEachObjKV(component_map, this.setSubComponent.bind(this))
  }

  public removeSubComponent(id: string): Component {
    const component = this.$subComponent[id]

    set(component, '$parent', null)

    delete this.$subComponent[id]

    return component
  }

  public getSubComponentParentId(id: string): string | null {
    const subComponent = this.getSubComponent(id)

    for (const parentSubComponentId in this.$subComponent) {
      const parentSubComponent = this.$subComponent[parentSubComponentId]

      if (parentSubComponent.$parentRoot.includes(subComponent)) {
        return parentSubComponentId
      }
    }
    return null
  }

  public getSlotSubComponentId(slotName: string): string | null {
    const subComponentId = this.$slotId[slotName]

    return subComponentId
    // const slot = this.$slot[slotName] || this

    // if (slot === this) {
    //   return null
    // } else {
    //   return this.getSubComponentId(slot)
    // }
  }

  public getSubComponentId(subComponent: Component): string | null {
    for (const subComponentId in this.$subComponent) {
      const _subComponent = this.$subComponent[subComponentId]

      if (subComponent === _subComponent) {
        return subComponentId
      }
    }

    return null
  }

  public getParentRootSlotId(subComponent: Component): string | null {
    const i = this.$parentRoot.indexOf(subComponent)

    if (i > -1) {
      const slotName = this.$parentRootSlotName[i]

      return slotName
    } else {
      return null
    }
  }

  public getSlotPath(slotName: string): string[] {
    const slotSubComponentId = this.getSlotSubComponentId(slotName)
    if (slotSubComponentId) {
      const slotSubComponent = this.getSubComponent(slotSubComponentId)
      const mappedSlotName = this.$slotTarget[slotName]
      const mappedSlotPath = slotSubComponent.getSlotPath(mappedSlotName)
      return [slotSubComponentId, ...mappedSlotPath]
    } else {
      return []
    }
  }

  public addEventListener = (listener: Listener): Unlisten => {
    if (this.$primitive) {
      return addListener(this, listener)
    } else {
      const allRootUnlisten = []

      for (const root of this.$root) {
        const rootUnlisten = root.addEventListener(listener)

        allRootUnlisten.push(rootUnlisten)
      }

      return callAll(allRootUnlisten)
    }
  }

  public addEventListeners = (listeners: Listener[]): Unlisten => {
    if (this.$primitive) {
      return addListeners(this, listeners)
    } else {
      const allRootUnlisten = []

      for (const root of this.$root) {
        const rootUnlisten = root.addEventListeners(listeners)

        allRootUnlisten.push(rootUnlisten)
      }

      return callAll(allRootUnlisten)
    }
  }

  private _call(method: string, data: any[] = []): void {
    if (this[method]) {
      this[method](...data)
    } else {
      throw 'method not implemented'
    }
  }

  public destroy() {
    this.onDestroy()
  }
}
