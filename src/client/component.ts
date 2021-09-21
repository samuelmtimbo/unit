import { $Component } from '../async/$Component'
import { $Graph } from '../async/$Graph'
import { System } from '../boot'
import callAll from '../callAll'
import { Callback } from '../Callback'
import { $Children } from '../component/Children'
import { Moment } from '../debug/Moment'
import { UnitMoment } from '../debug/UnitMoment'
import NOOP from '../NOOP'
import { GraphSpec } from '../types'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { at, insert, pull, push, removeAt, unshift } from '../util/array'
import { _if } from '../util/control'
import {
  appendChild,
  insertBefore,
  prepend,
  removeChild,
} from '../util/element'
import { get, set } from '../util/object'
import { addListener, addListeners } from './addListener'
import { attach } from './attach'
import { Context, dispatchContextEvent, dispatchCustomEvent } from './context'
import { dettach } from './dettach'
import { pushGlobalComponent } from './globalComponent'
import { isBaseSpecId } from './id'
import { Listener } from './Listener'
import { makeEventListener } from './makeEventListener'
import { mount } from './mount'
import parentElement from './parentElement'
import { unmount } from './unmount'

export type ComponentMap = Dict<Component>

export function componentClassFromSpecId(id: string): typeof Component {
  if (isBaseSpecId(id)) {
    const Class = globalThis.__components[id]
    Class.id = id
    return Class
  } else {
    const spec = globalThis.__specs[id] as GraphSpec
    return componentClassFromSpec(spec)
  }
}

export function componentFromSpecId(id: string, props: Dict<any>): Component {
  const Class = componentClassFromSpecId(id)
  const component = new Class(props)
  return component
}

export function componentFromSpec(spec: GraphSpec): Component {
  const Class = componentClassFromSpec(spec)
  const component = new Class({})
  return component
}

export function component_(childSubComponent: Component): string[] {
  let _ = ['$U', '$C']
  if (childSubComponent.$primitive) {
    _ = [..._, '$V', '$J']
  }
  if (childSubComponent.$unbundled) {
    _ = [..._, '$G']
  }
  return _
}

export function componentClassFromSpec(spec: GraphSpec): typeof Component {
  const {
    id,
    units = {},
    component = { defaultWidth: 120, defaultHeight: 120 },
  } = spec

  const { children = [], subComponents = {}, slots = [] } = component

  class Parent extends Component<any, any, any> {
    static id = id

    constructor($props: {}) {
      super($props)

      const $subComponent: Dict<Component> = {}

      for (const unitId in subComponents) {
        const unitSpec = units[unitId]
        const { path: id } = unitSpec
        const Class = componentClassFromSpecId(id)
        const childComponent: Component = new Class({})
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

      const $element = parentElement()

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

  return Parent
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
  E extends HTMLElement | SVGElement = any,
  P extends object = {},
  U extends $Component | $Graph = $Component
> {
  static id: string

  public $element: E
  public $props: P
  public $changed: Set<string> = new Set()

  public $attached: boolean = false
  public $system: System

  public $globalId: string

  public $ref: Dict<Component> = {}

  public $context: Context

  public $connected: boolean = false
  public $unit: U

  public $primitive: boolean = true

  // AD HOC
  // avoid recursively connecting
  // "JavaScript Defined Components"
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

  public $parent: Component | null = null

  public $mounted: boolean = false

  public $listenCount: Dict<number> = {}

  constructor($props: P) {
    this.$props = $props
  }

  getProp(name: string): any {
    return this.$props[name]
  }

  setProp(prop: string, data: any) {
    this.$props[prop] = data

    if (this.$mounted) {
      this.onPropChanged(prop, data)
    } else {
      this.$changed.add(prop)
    }
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
    this.$element.addEventListener(event, (event: Event) => {
      event.preventDefault()
      return false
    })
  }

  setPointerCapture(pointerId: number): void {
    // console.log(this.constructor.name, 'setPointerCapture', pointerId)
    // AD HOC
    try {
      this.$element.setPointerCapture(pointerId)
    } catch (err) {
      return
    }

    this.$system.$flag.__POINTER__CAPTURE__[pointerId] = this.$element
  }

  releasePointerCapture(pointerId: number): void {
    // console.log(this.constructor.name, 'releasePointerCapture', pointerId)
    // AD HOC
    try {
      this.$element.releasePointerCapture(pointerId)
    } catch (err) {
      // swallow
      return
    }
    delete this.$system.$flag.__POINTER__CAPTURE__[pointerId]
  }

  protected mountDescendent(child: Component): void {
    child.mount(this.$context)
  }

  protected unmountDescendent(child: Component): void {
    return child.unmount()
  }

  protected attachDescendent(child: Component): void {
    return child.attach(this.$system)
  }

  protected dettachDescendent(child: Component): void {
    return child.dettach()
  }

  private _forAllDescendent(callback: Callback<Component>): void {
    for (const subComponent of this.$mountRoot) {
      callback(subComponent)
    }

    for (const subComponent of this.$mountParentRoot) {
      callback(subComponent)
    }

    for (const slotName in this.$slotChildren) {
      for (const child of this.$slotChildren[slotName]) {
        callback(child)
      }
    }
  }

  onAttach() {}

  onDettach($system: System) {}

  attach($system: System): void {
    // console.log(this.constructor.name, 'attach')
    this._attach($system)
    this._forAllDescendent((child) => {
      this.attachDescendent(child)
    })
    this.onAttach()
  }

  _attach($system: System): void {
    if (this.$system) {
      console.log(this.constructor.name, this.$element)
      throw new Error('_attach called on an already attached component')
    }

    this.$attached = true

    this.$system = $system

    for (let i = 0; i < this.$listener.length; i++) {
      const listener = this.$listener[i]
      const unlisten = listener(this)
      this.$unlisten[i] = unlisten
    }
  }

  dettach(): void {
    // console.log(this.constructor.name, 'dettach')
    const $system = this.$system
    this._dettach()
    this._forAllDescendent((child) => {
      this.dettachDescendent(child)
    })
    this.onDettach($system)
  }

  _dettach(): void {
    for (let i = 0; i < this.$listener.length; i++) {
      const unlisten = this.$unlisten[i]
      unlisten()
      this.$unlisten[i] = NOOP
    }

    this.$system = null

    this.$attached = false
  }

  mount($context: Context): void {
    // console.log(this.constructor.name, 'mount')
    if (this.$mounted) {
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
      throw new Error('Cannot unmount unmounted component')
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
      this.$element.focus(options)
    } else {
      this.$slot['default'].focus(options)
    }
  }

  blur() {
    if (this.$slot['default'] === this) {
      this.$element.blur()
    } else {
      this.$slot['default'].blur()
    }
  }

  animate(keyframes, options): Animation {
    if (this.$slot['default'] === this) {
      return this.$element.animate(keyframes, options)
    } else {
      return this.$slot['default'].animate(keyframes, options)
    }
  }

  getBoundingClientRect(): {
    x: number
    y: number
    width: number
    height: number
  } {
    if (this.$context) {
      const { $x, $y, $sx, $sy } = this.$context
      const bcr: DOMRect = this.$element.getBoundingClientRect()
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
    // console.log('Component', 'appendChild')
    const slot = this.$slot[slotName]

    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []
    this.$slotChildren[slotName].push(child)

    this.$children.push(child)

    child.$parent = this

    slot.$element.appendChild(child.$element)

    if (this.$system) {
      this.attachDescendent(child)
    }

    if (this.$mounted) {
      this.mountDescendent(child)
    }

    const at = this.$children.length - 1

    return at
  }

  public hasChild(at: number): boolean {
    const has = this.$children.length > at
    return has
  }

  public ascendChild(child: Component, slotName: string = 'default'): void {
    this.removeChild(child, slotName)
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
        this.$unit.$emit({ type: event, data })
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
      // throw new Error ('Component is not already connected')
      console.log('Component', 'connect called unnecessarily')
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
        if (event_event === 'listen') {
          const { event } = event_data
          listen(event)
        } else if (event_event === 'unlisten') {
          const { event } = event_data
          unlisten(event)
        } else if (event_event === 'append_child') {
          const { id } = event_data
          const child = componentFromSpecId(id, {})
          const _ = component_(child)
          const at = this.$children.length
          const child_unit = this.$unit.$refChild({ at, _ })
          child.connect(child_unit)
          this.appendChild(child)
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

    const all_unlisten: Unlisten[] = []

    const events = ['listen', 'unlisten', 'append_child', 'remove_child_at']

    const pod_unit_unlisten = this.$unit.$watch({ events }, pod_unit_listener)

    all_unlisten.push(pod_unit_unlisten)

    this._unit_unlisten = callAll(all_unlisten)

    $unit.$getGlobalId({}, (globalId: string) => {
      this.$globalId = globalId
      pushGlobalComponent(globalId, this)
    })

    $unit.$getListeners({}, (events) => {
      for (const event of events) {
        listen(event)
      }
    })

    $unit.$children({}, (children: $Children) => {
      if (children.length > 0) {
        const _children = children.map(({ id }, at) => {
          const component = componentFromSpecId(id, {})
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
    slot.$element.prepend(child.$element)
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
    slotName: string = 'default'
  ): void {
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []
    const oldChildren = [...this.$slotChildren[slotName]]
    for (const oldChild of oldChildren) {
      this.removeChild(oldChild, slotName)
    }
    for (let child of children) {
      this.appendChild(child, slotName)
    }
  }

  public removeChildAt(at): void {
    // TODO
    // slot name should be extracted from memory
    const slotName = 'default'
    const child = this.$slotChildren[slotName][at]
    this.removeChild(child, slotName)
  }

  public removeChild(child: Component, slotName: string = 'default'): number {
    // console.log('Component', 'removeChild')
    const slot = this.$slot[slotName]

    const at = this.$children.indexOf(child)

    if (at > -1) {
      this.$children.splice(at, 1)

      const slotAt = this.$slotChildren[slotName].indexOf(child)
      this.$slotChildren[slotName].splice(slotAt, 1)

      slot.$element.removeChild(child.$element)

      child.$parent = null

      if (this.$mounted) {
        child.unmount()
      }

      if (this.$system) {
        this.dettachDescendent(child)
      }

      return at
    } else {
      throw new Error('child component not found')
    }
  }

  public removeChildren(slotName: string = 'default'): void {
    const children = [...(this.$slotChildren[slotName] || [])]
    for (const child of children) {
      this.removeChild(child, slotName)
    }
  }

  public pushRoot(component: Component): void {
    set(component, '$parent', this)
    this.$root.push(component)
  }

  public pullRoot(component: Component): void {
    const index = this.$root.indexOf(component)
    set(component, '$parent', null)
    this.$root.splice(index, 1)
  }

  public fitRoot(component: Component, at: number): void {
    this.$root.splice(at, 0, component)
  }

  public prependRoot(component: Component): void {
    unshift(this.$root, component)
    prepend(this.$element, component.$element)
    _if(this.$attached, attach, component, this.$system)
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

  public appendRoot(component: Component): void {
    push(this.$mountRoot, component)
    appendChild(this.$element, component.$element)
    set(component, '$parent', this)
    _if(this.$attached, attach, component, this.$system)
    _if(this.$mounted, mount, component, this.$context)
  }

  public insertRootAt(component: Component, _at: number): void {
    insert(this.$mountRoot, component, _at)
    const nextRoot = at(this.$root, _at + 1)
    insertBefore(this.$element, component.$element, nextRoot.$element)
    set(component, '$parent', this)
    _if(this.$attached, attach, component, this.$system)
    _if(this.$mounted, mount, component, this.$context)
  }

  public removeRoot(component: Component): void {
    pull(this.$mountRoot, component)
    removeChild(this.$element, component.$element)
    _if(this.$mounted, unmount, component)
    _if(this.$attached, dettach, component)
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

  public pushParentRoot(component: Component, slotName: string): void {
    push(this.$parentRoot, component)
    push(this.$parentRootSlot, slotName)
    set(component, '$parent', this)
  }

  public fitParentRoot(
    component: Component,
    at: number,
    slotName: string
  ): void {
    insert(this.$parentRoot, component, at)
    insert(this.$parentRootSlot, slotName, at)
    set(component, '$parent', this)
  }

  public unshiftParentRoot(component: Component, slotName: string): void {
    unshift(this.$parentRoot, component)
    unshift(this.$parentRootSlot, slotName)
    set(component, '$parent', this)
  }

  public pullParentRoot(component: Component): void {
    set(component, '$parent', null)
    const i = this.$parentRoot.indexOf(component)
    removeAt(this.$parentRoot, i)
    removeAt(this.$parentRootSlot, i)
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
      i++
    }
  }

  public uncollapse(): void {
    for (const component of this.$parentRoot) {
      this.removeParentRoot(component)
    }
  }

  public appendParentRoot(component: Component, slotName: string): void {
    // console.log(this.constructor.name, 'appendParentRoot', component.constructor.name)
    push(this.$mountParentRoot, component)
    const slot = get(this.$slot, slotName)
    appendChild(slot.$element, component.$element)
    set(component, '$parent', this)
    _if(this.$attached, attach, component, this.$system)
    _if(this.$mounted, mount, component, this.$context)
  }

  public insertParentRootAt(
    component: Component,
    _at: number,
    slotName: string
  ): void {
    insert(this.$mountParentRoot, component, _at)
    const slot = get(this.$slot, slotName)
    // const nextParentRoot = at(this.$parentRoot, _at + 1)
    const nextParentRoot = at(this.$mountParentRoot, _at + 1)
    insertBefore(slot.$element, component.$element, nextParentRoot.$element)
    set(component, '$parent', this)
    _if(this.$attached, attach, component, this.$system)
    _if(this.$mounted, mount, component, this.$context)
  }

  public prependParentRoot(component: Component, slotName: string): void {
    this.insertParentRootAt(component, 0, slotName)
  }

  public removeParentRoot(component: Component): void {
    pull(this.$mountParentRoot, component)
    const parentRootIndex = this.$parentRoot.indexOf(component)
    const slotName = this.$parentRootSlot[parentRootIndex]
    const slot = this.$slot[slotName]
    slot.$element.removeChild(component.$element)
    // component.$parent = null
    if (this.$mounted) {
      component.unmount()
    }
    if (this.$system) {
      component.dettach()
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

  addEventListener = (listener: Listener): Unlisten => {
    return addListener(this, listener)
  }

  addEventListeners = (listeners: Listener[]): Unlisten => {
    return addListeners(this, listeners)
  }

  call(method: string, data: any[] = []): void {
    if (this[method]) {
      this[method](...data)
    } else {
      throw 'method not implemented'
    }
  }

  destroy() {
    this.onDestroy()
  }
}
