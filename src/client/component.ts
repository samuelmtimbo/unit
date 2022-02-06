import { $Children } from '../component/Children'
import { Moment } from '../debug/Moment'
import { UnitMoment } from '../debug/UnitMoment'
import { $Component } from '../interface/async/$Component'
import { $Graph } from '../interface/async/$Graph'
import { NOOP } from '../NOOP'
import { Pod } from '../pod'
import { evaluate } from '../spec/evaluate'
import { ComponentClass, System } from '../system'
import { pushGlobalComponent } from '../system/globalComponent'
import { GraphSpec } from '../types'
import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import {
  at,
  insert,
  pull,
  push,
  remove,
  removeAt,
  unshift,
} from '../util/array'
import callAll from '../util/call/callAll'
import { _if } from '../util/control'
import {
  appendChild,
  insertBefore,
  prepend,
  removeChild,
} from '../util/element'
import { get, mapObjVK, set } from '../util/object'
import { addListener, addListeners } from './addListener'
import { componentClassFromSpecId } from './componentClassFromSpecId'
import { componentFromSpecId } from './componentFromSpecId'
import { component_ } from './component_'
import { Context, dispatchContextEvent, dispatchCustomEvent } from './context'
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  DEFAULT_TEXT_ALIGN,
} from './DEFAULT_FONT_SIZE'
import { IOElement } from './IOElement'
import { Listener } from './Listener'
import { makeEventListener } from './makeEventListener'
import { mount } from './mount'
import parentElement from './platform/web/parentElement'
import { unmount } from './unmount'
import { addVector, NULL_VECTOR, Position, Rect } from './util/geometry'
import { getFontSize } from './util/style/getFontSize'
import { getOpacity } from './util/style/getOpacity'
import { getPosition } from './util/style/getPosition'
import { getSize } from './util/style/getSize'
import { getTextAlign } from './util/style/getTextAlign'

export type ComponentMap = Dict<Component>

export function componentClassFromSpec(spec: GraphSpec): ComponentClass {
  const {
    id,
    name,
    units = {},
    component = { defaultWidth: 120, defaultHeight: 120 },
  } = spec

  const { children = [], subComponents = {}, slots = [] } = component

  class Parent extends Component<any, any> {
    static id = id

    constructor($props: {}, $system: System, $pod: Pod) {
      super($props, $system, $pod)

      const $subComponent: Dict<Component> = {}

      for (const unitId in subComponents) {
        const unitSpec = units[unitId]
        const { id } = unitSpec
        const Class = componentClassFromSpecId($system, id)
        const childComponent: Component = new Class({}, $system, $pod)
        $subComponent[unitId] = childComponent
      }

      const fillParentRoot = (unitId: string): void => {
        const component = $subComponent[unitId]
        const subComponentSpec = subComponents[unitId]
        const { children = [], childSlot = {} } = subComponentSpec
        for (const childUnitId of children) {
          fillParentRoot(childUnitId)
          const slot = childSlot[childUnitId] || 'default'
          const childRoot: Component = $subComponent[childUnitId]
          component.registerParentRoot(childRoot, slot)
        }
      }

      const $element = parentElement($system)

      this.$element = $element

      this.$primitive = false

      this.$subComponent = $subComponent

      let i = 0
      for (const _slot of slots) {
        const [slot, slotSlot] = _slot
        const subComponent = $subComponent[slot]
        // AD HOC
        const slotName = i === 0 ? 'default' : `${i}`
        this.$slot[slotName] = subComponent.$slot[slotSlot]
        i++
      }

      for (let child_id of children) {
        const rootComponent = $subComponent[child_id]
        fillParentRoot(child_id)
        this.registerRoot(rootComponent)
      }
    }
  }

  Object.defineProperty(Parent, 'name', {
    value: name,
  })

  return Parent as ComponentClass
}

export function findRef(component: Component, name: string): Component | null {
  let c: Component | null = component
  while (c) {
    if (c.$ref[name]) {
      return c.$ref[name]
    }
    c = c.$parent
  }
  return null
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
  public $pod: Pod

  public $globalId: string

  public $ref: Dict<Component> = {}

  public $context: Context

  public $connected: boolean = false
  public $unit: U

  public $primitive: boolean = true

  // AD HOC
  // Avoid recursively connecting "JavaScript Defined Components"
  public $unbundled: boolean = true

  public $children: Component[] = []
  public $slotChildren: Dict<Component[]> = { default: [] }
  public $childrenSlot: string[] = []

  public $slot: Dict<Component> = { default: this }

  public $subComponent: Dict<Component> = {}

  public $root: Component[] = []

  public $parentRoot: Component[] = []
  public $parentRootSlot: string[] = []

  public $mountRoot: Component[] = []
  public $mountParentRoot: Component[] = []

  public $parentChildren: Component[] = []
  public $parentChildrenSlot: string[] = []

  public $parent: Component | null = null

  public $mounted: boolean = false

  public $listenCount: Dict<number> = {}

  constructor($props: P, $system: System, $pod: Pod) {
    this.$props = $props
    this.$system = $system
    this.$pod = $pod
  }

  getProp(name: string): any {
    return this.$props[name]
  }

  setProp<K extends keyof P>(prop: K, data: P[K]) {
    this.$props[prop] = data

    if (this.$mounted) {
      this.onPropChanged(prop, data)
    } else {
      this.$changed.add(prop)
    }
  }

  getSlot(slotName: string): Component {
    return this.$slot[slotName]
  }

  onPropChanged(prop: string, current: any) {}

  onConnected($unit: U) {}

  onDisconnected() {}

  onMount() {}

  onUnmount($context: Context) {}

  onDestroy() {}

  dispatchEvent(type: string, detail: any = {}, bubbles: boolean = true) {
    dispatchCustomEvent(this.$element, type, detail, bubbles)
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

  preventDefault(event: string): void {
    this.$element.addEventListener(
      event,
      (event: Event) => {
        event.preventDefault()
        return false
      },
      { passive: false }
    )
  }

  setPointerCapture(pointerId: number): void {
    // console.log(this.constructor.name, 'setPointerCapture', pointerId)
    try {
      if (this.$element instanceof Text) {
        return
      }

      this.$element.setPointerCapture(pointerId)
    } catch (err) {
      return
    }
    this.$system.cache.pointerCapture[pointerId] = this.$element
  }

  releasePointerCapture(pointerId: number): void {
    // console.log(this.constructor.name, 'releasePointerCapture', pointerId)
    // AD HOC
    try {
      if (this.$element instanceof Text) {
        return
      }

      this.$element.releasePointerCapture(pointerId)
    } catch (err) {
      // swallow
      return
    }
    delete this.$system.cache.pointerCapture[pointerId]
  }

  public mountDescendent(child: Component): void {
    child.mount(this.$context)
  }

  public unmountDescendent(child: Component): void {
    return child.unmount()
  }

  private _forAllDescendent(callback: Callback<Component>): void {
    for (const subComponent of this.$mountRoot) {
      callback(subComponent)
    }

    for (const subComponent of this.$mountParentRoot) {
      callback(subComponent)
    }

    for (const child of this.$children) {
      callback(child)
    }
  }

  mount($context: Context): void {
    // console.log(this.constructor.name, 'mount')

    if (this.$mounted) {
      throw new Error('Cannot mount a mounted component.')
      this.unmount()
    }

    this.$context = $context

    this.$mounted = true

    this.onMount()

    this._forAllDescendent((child) => {
      this.mountDescendent(child)
    })

    const $changed = new Set(this.$changed)
    for (const name of $changed) {
      const current = this.$props[name]
      this.$changed.delete(name)
      this.onPropChanged(name, current)
    }

    if (this.$listenCount['mount']) {
      this.dispatchEvent('mount', {}, false)
    }
  }

  unmount() {
    // console.log(this.constructor.name, 'unmount')
    if (!this.$mounted) {
      // throw new Error('Cannot unmount unmounted component')
      return
    }

    const $context = this.$context

    this._forAllDescendent((child) => {
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

      this.$element.focus(options)
    } else {
      this.$slot['default'].focus(options)
    }
  }

  blur() {
    if (this.$slot['default'] === this) {
      if (this.$element instanceof Text) {
        return
      }

      this.$element.blur()
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

    return containsSelection(this.$element)
  }

  animate(keyframes, options): Animation {
    if (this.$slot['default'] === this) {
      if (this.$element instanceof Text) {
        // RETURN
        return
      }

      return this.$element.animate(keyframes, options)
    } else {
      return this.$slot['default'].animate(keyframes, options)
    }
  }

  getOffset(): Component {
    let slot_offset: Component = this

    while (
      slot_offset &&
      (!(slot_offset.$element instanceof HTMLElement) ||
        slot_offset.$element.style.position === '' ||
        slot_offset.$element.style.position === 'contents') &&
      slot_offset.$element instanceof HTMLElement &&
      slot_offset.$element.style.display !== 'flex'
    ) {
      slot_offset = slot_offset.$parent
    }

    return slot_offset
  }

  getElementPosition() {
    if (!this.$mounted) {
      throw new Error('Cannot calculate position of unmounted component')
    }

    const context_position = {
      x: this.$context.$x,
      y: this.$context.$y,
    }

    const relative_position = getPosition(this.$element, this.$context.$element)

    const position = addVector(context_position, relative_position)

    return position
  }

  getElementSize() {
    return getSize(this.$element)
  }

  getFontSize(): number {
    const fontSize = getFontSize(this.$element)

    if (fontSize) {
      return fontSize
    }

    if (this.$parent) {
      return this.$parent.getFontSize()
    }

    return DEFAULT_FONT_SIZE
  }

  getOpacity(): number {
    const opacity = getOpacity(this.$element)

    if (opacity) {
      return opacity
    }

    if (this.$parent) {
      return this.$parent.getOpacity()
    }

    return DEFAULT_OPACITY
  }

  getTextAlign(): string {
    const fontSize = getTextAlign(this.$element)

    if (fontSize) {
      return fontSize
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

  getRootBase(path: string[] = []): [string[], Component][] {
    if (this.$primitive && this.$root.length === 0) {
      return [[path, this]]
    }

    let p = []

    for (const subComponent of this.$root) {
      const subComponentId = this.getSubComponentId(subComponent)
      const subComponentPrim = subComponent.getRootBase([
        ...path,
        subComponentId,
      ])
      p = [...p, ...subComponentPrim]
    }

    return p
  }

  getBase(path: string[] = []): [string[], Component][] {
    if (this.$primitive && this.$root.length === 0) {
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

  getBoundingClientRect(): {
    x: number
    y: number
    width: number
    height: number
  } {
    if (this.$context) {
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

  public appendChild(child: Component, slotName: string = 'default'): number {
    // console.log('Component', 'appendChild', slotName)
    const at = this.$children.length
    this.memAppendChild(child, slotName, at)
    this.domAppendChild(child, slotName, at)
    this.postAppendChild(child, at)

    return at
  }

  public memAppendChild(child: Component, slotName: string, at: number): void {
    // console.log('Component', 'memAppendChild')
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []
    this.$slotChildren[slotName].push(child)
    this.$children.push(child)
    this.$childrenSlot[at] = slotName
  }

  public domAppendChild(child: Component, slotName: string, at: number): void {
    // console.log('Component', '_domAppendChild')
    const slot = this.$slot[slotName]

    slot.$element.appendChild(child.$element)
  }

  public postAppendChild(child: Component, at: number): void {
    child.$parent = this
    if (this.$mounted) {
      this.mountDescendent(child)
    }
  }

  public domRemoveChild(child: Component, slotName: string, at: number): void {
    const slot = this.$slot[slotName]

    slot.$element.removeChild(child.$element)
  }

  public postRemoveChild(child: Component, at: number): void {
    child.$parent = null
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

  private _addUnitEventListener = (event: string): void => {
    const unlisten = this.addEventListener(
      makeEventListener(event, (data) => {
        this.$unit.$refEmitter({}).$emit({ type: event, data }, NOOP)
      })
    )
    this.$named_unlisten[event] = unlisten
  }

  private _removeUnitEventListener = (event: string): void => {
    const unlisten = this.$named_unlisten[event]
    delete this.$named_unlisten[event]
    unlisten()
  }

  public connect($unit: U): void {
    if (this.$connected) {
      // throw new Error ('Component is already connected')
      console.log('Component', 'connect called unnecessarily')
      return
    }

    this._connect($unit)

    if (this.$unbundled) {
      for (let unitId in this.$subComponent) {
        const childSubComponent = this.$subComponent[unitId]
        const _ = component_(childSubComponent)
        const subUnit = (this.$unit as $Graph).$refSubComponent({ unitId, _ })
        childSubComponent.connect(subUnit)
      }
    }
  }

  public _connect($unit: U): void {
    // console.log(this.constructor.name, 'connect')
    if (this.$connected) {
      // throw new Error ('Component is already connected')
      // console.log('Component', 'connect called unnecessarily')
      return
    }

    this.$unit = $unit

    const listen = (event: string): void => {
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
        // if (event_event === 'call') {
        //   const { method, data } = event_data
        //   this._call(method, data)
        // } else if (event_event === 'listen') {
        //   const { event } = event_data
        //   listen(event)
        // } else if (event_event === 'unlisten') {
        //   const { event } = event_data
        //   unlisten(event)
        // } else
        if (event_event === 'append_child') {
          const { bundle } = event_data
          const { unit } = bundle
          const { id, input = {} } = unit
          const props = mapObjVK(input, ({ data }) => {
            return evaluate(data, this.$system.specs, this.$system.classes)
          })
          const child = componentFromSpecId(this.$system, this.$pod, id, props)
          const _ = component_(child)
          const at = this.$children.length
          const child_unit = this.$unit.$refChild({ at, _ })
          child.connect(child_unit)
          const slot_name = 'default'
          this.appendChild(child, slot_name)
        } else if (event_event === 'remove_child_at') {
          const { at } = event_data
          this.removeChildAt(at)
        }
      },
    }

    const pod_unit_listener = (moment: Moment): void => {
      const { type } = moment
      handler[type] && handler[type](moment)
    }

    this.$named_listener_count = {}

    $unit.$getGlobalId({}, (__global_id: string) => {
      this.$globalId = __global_id

      pushGlobalComponent(this.$system, __global_id, this)
    })

    const all_unlisten: Unlisten[] = []

    const events = [
      // 'call',
      // 'listen',
      // 'unlisten',
      'append_child',
      'remove_child_at',
    ]

    const pod_unit_unlisten = this.$unit.$watch({ events }, pod_unit_listener)

    all_unlisten.push(pod_unit_unlisten)

    const $emitter = $unit.$refEmitter({})

    $emitter.$getEventNames({}, (events: string[]) => {
      for (const event of events) {
        listen(event)
      }
    })

    const unlisten_emitter = callAll([
      $emitter.$addListener({ event: 'listen' }, ({ event }) => {
        listen(event)
      }),
      $emitter.$addListener({ event: 'unlisten' }, ({ event }) => {
        unlisten(event)
      }),
      $emitter.$addListener({ event: 'call' }, ({ method, data }) => {
        this._call(method, data)
      }),
    ])

    all_unlisten.push(unlisten_emitter)

    this._unit_unlisten = callAll(all_unlisten)

    $unit.$children({}, (children: $Children) => {
      if (children.length > 0) {
        const _children = children.map(({ id }, at) => {
          const component = componentFromSpecId(this.$system, this.$pod, id, {})
          const _ = component_(component)
          const unit = $unit.$refChild({ at, _ })
          component.connect(unit)
          return component
        })

        this.setChildren(_children)
      }
    })

    this.$connected = true

    this.onConnected($unit)
  }

  public disconnect(): void {
    this._disconnect()

    if (this.$unbundled) {
      for (let subUnitId in this.$subComponent) {
        const childSubComponent = this.$subComponent[subUnitId]
        childSubComponent.disconnect()
      }
    }
  }

  public _disconnect(): void {
    // console.log(this.constructor.name, 'disconnect')

    if (!this.$connected) {
      // throw new Error ('Component is not already disconnected')
      console.log('Component', 'disconnect called unnecessarily')
      return
    }

    this._unit_unlisten()

    for (const child of this.$children) {
      child.disconnect()
    }

    this.$connected = false

    this.onDisconnected()
  }

  public prependChild(child: Component, slotName: string = 'default') {
    const slot = this.$slot[slotName]
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []
    this.$slotChildren[slotName].unshift(child)
    child.$parent = this
    if (slot.$element instanceof Text) {
      //
    } else {
      slot.$element.prepend(child.$element)
    }
    if (this.$mounted) {
      this.mountDescendent(child)
    }
  }

  public insertAt(
    child: Component,
    at: number,
    slotName: string = 'default'
  ): void {
    const slot = this.$slot[slotName]
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []
    if (at >= this.$slotChildren[slotName].length - 1) {
      this.appendChild(child, slotName)
    } else {
      child.$parent = this
      slot.$element.insertBefore(
        child.$element,
        this.$slotChildren[slotName][at].$element
      )
      this.$slotChildren[slotName].splice(at, 0, child)
      if (this.$mounted) {
        this.mountDescendent(child)
      }
    }
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
    remove(this.$slotChildren[slotName], child)
    removeAt(this.$children, at)
    removeAt(this.$childrenSlot, at)
  }

  public removeChildAt(at: number): number {
    const child = this.$children[at]
    const slotName = this.$childrenSlot[at]

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
    set(component, '$parent', this)
    this.$root.push(component)
  }

  public pullRoot(component: Component): void {
    const index = this.$root.indexOf(component)
    if (index > -1) {
      set(component, '$parent', null)
      this.$root.splice(index, 1)
    } else {
      throw new Error('Cannot pull; not root component')
    }
  }

  public fitRoot(component: Component, at: number): void {
    this.$root.splice(at, 0, component)
  }

  public prependRoot(component: Component): void {
    unshift(this.$root, component)
    prepend(this.$element, component.$element)
    _if(this.$mounted, mount, component, this.$context)
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
    push(this.$mountRoot, component)
  }

  public postAppendRoot(component: Component): void {
    set(component, '$parent', this)
    _if(this.$mounted, mount, component, this.$context)
  }

  public domAppendRoot(component: Component): void {
    appendChild(this.$element, component.$element)
  }

  public appendRoot(component: Component): void {
    const at = this.$mountRoot.length
    this.memAppendRoot(component)
    this.domAppendRoot(component)
    this.postAppendRoot(component)
  }

  public insertRootAt(component: Component, _at: number): void {
    insert(this.$mountRoot, component, _at)
    const nextRoot = at(this.$root, _at + 1)
    insertBefore(this.$element, component.$element, nextRoot.$element)
    set(component, '$parent', this)
    // _if(this.$mounted, mount, component, this.$context)
    this.$mounted && this.mountDescendent(component)
  }

  public removeRoot(component: Component): void {
    pull(this.$mountRoot, component)
    removeChild(this.$element, component.$element)
    _if(this.$mounted, unmount, component)
  }

  public compose(): void {
    for (const component of this.$root) {
      this.appendRoot(component)

      component.collapse()
    }
  }

  public decompose(): void {
    for (const component of this.$root) {
      component.uncollapse()

      this.removeRoot(component)
    }
  }

  public hasParentRoot(component: Component): boolean {
    return this.$parentRoot.includes(component)
  }

  public pushParentRoot(component: Component, slotName: string): void {
    push(this.$parentRoot, component)
    push(this.$parentRootSlot, slotName)
  }

  public insertParentRoot(
    component: Component,
    at: number,
    slotName: string
  ): void {
    insert(this.$parentRoot, component, at)
    insert(this.$parentRootSlot, slotName, at)
  }

  public unshiftParentRoot(component: Component, slotName: string): void {
    unshift(this.$parentRoot, component)
    unshift(this.$parentRootSlot, slotName)
  }

  public pullParentRoot(component: Component): void {
    const i = this.$parentRoot.indexOf(component)
    if (i > -1) {
      removeAt(this.$parentRoot, i)
      removeAt(this.$parentRootSlot, i)
    } else {
      throw new Error('Parent Root not found')
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

  public collapse(): void {
    let i = 0
    for (const component of this.$parentRoot) {
      const slotName = this.$parentRootSlot[i]
      this.appendParentRoot(component, slotName)
      component.collapse()
      i++
    }
  }

  public uncollapse(): void {
    for (const component of this.$parentRoot) {
      this.removeParentRoot(component)

      component.uncollapse()
    }
  }

  public appendParentRoot(
    component: Component,
    slotName: string = 'default'
  ): void {
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
    set(component, '$parent', this)
    // _if(this.$mounted, mount, component, this.$context)
  }

  public memAppendParentChild(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    push(this.$parentChildren, component)
    push(this.$parentChildrenSlot, slotName)
  }

  public domAppendParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    appendChild(this.$element, component.$element)
  }

  public postAppendParentChild(
    component: Component,
    slotName: string,
    at: number
  ): void {
    if (this.$mounted) {
      this.mountDescendent(component)
    }
  }

  public insertParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    const slot = this.$slot[slotName]
    if (this === slot) {
      this.memInsertParentChildAt(component, slotName, at, _at)
      this.domInsertParentChildAt(component, slotName, at, _at)
    } else {
      slot.insertParentChildAt(component, 'default', at, _at)
    }
  }

  public memInsertParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    insert(this.$parentChildren, component, _at)
    insert(this.$parentChildrenSlot, slotName, _at)
  }

  public domInsertParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    const slot = this.$slot[slotName]
    const nextElement = slot.$element.childNodes[_at]
    insertBefore(slot.$element, component.$element, nextElement)
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
    removeAt(this.$parentChildren, _at)
    removeAt(this.$parentChildrenSlot, _at)
  }

  public domRemoveParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
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
    at: number,
    slotName: string
  ): void {
    insert(this.$mountParentRoot, component, at)
  }

  public domInsertParentRootAt(
    component: Component,
    _at: number,
    slotName: string
  ): void {
    const slot = get(this.$slot, slotName)

    const at = this.$parentRoot.indexOf(component)

    slot.insertParentChildAt(component, slotName, at, _at)
  }

  public postInsertParentRootAt(
    component: Component,
    at: number,
    slotName: string
  ): void {
    set(component, '$parent', this)
    _if(this.$mounted, mount, component, this.$context)
  }

  public prependParentRoot(component: Component, slotName: string): void {
    this.insertParentRootAt(component, 0, slotName)
  }

  public removeParentRoot(component: Component): void {
    const at = this.$parentRoot.indexOf(component)
    const _at = this.$mountParentRoot.indexOf(component)
    const slotName = this.$parentRootSlot[at]
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
    const slot = this.$slot[slotName]
    slot.domRemoveParentChildAt(component, 'default', at, _at)
  }

  public postRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    component.$parent = null
    if (this.$mounted) {
      component.unmount()
    }
  }

  public getSubComponent(id: string): Component {
    return this.$subComponent[id]
  }

  public setSubComponent(id: string, component: Component): void {
    this.$subComponent[id] = component
  }

  public removeSubComponent(id: string): Component {
    const component = this.$subComponent[id]
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

  public getSlotSubComponentId(slotName: string): string {
    const slot = this.$slot[slotName] || this

    if (slot === this) {
      return null
    } else {
      return this.getSubComponentId(slot)
    }
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

  public getParentChildSlotId(subComponent: Component): string {
    const i = this.$parentRoot.indexOf(subComponent)

    if (i > -1) {
      const slotName = this.$parentRootSlot[i]
      return slotName
    } else {
      throw new Error('Parent Child Not Found')
    }
  }

  public addEventListener = (listener: Listener): Unlisten => {
    return addListener(this, listener)
  }

  public addEventListeners = (listeners: Listener[]): Unlisten => {
    return addListeners(this, listeners)
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
