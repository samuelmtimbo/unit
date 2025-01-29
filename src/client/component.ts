import { NOOP } from '../NOOP'
import { Child } from '../component/Child'
import { Children } from '../component/Children'
import { Moment } from '../debug/Moment'
import { UnitMoment } from '../debug/UnitMoment'
import { proxyWrap } from '../proxyWrap'
import { System } from '../system'
import { Tag } from '../system/platform/Style'
import { Tree } from '../tree'
import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { GlobalRefSpec } from '../types/GlobalRefSpec'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { Unlisten } from '../types/Unlisten'
import { UCGEE } from '../types/interface/UCGEE'
import { $Component } from '../types/interface/async/$Component'
import { $EE } from '../types/interface/async/$EE'
import { $Graph } from '../types/interface/async/$Graph'
import { insert, pull, push, remove, removeAt, unshift } from '../util/array'
import { callAll } from '../util/call/callAll'
import { _if } from '../util/control'
import { insertAt, removeChild } from '../util/element'
import { forEachObjKV, get, set } from '../util/object'
import { weakMerge } from '../weakMerge'
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  DEFAULT_TEXT_ALIGN,
} from './DEFAULT_FONT_SIZE'
import { IOElement } from './IOElement'
import { LayoutNode } from './LayoutNode'
import { Listener } from './Listener'
import { getActiveElement } from './activeElement'
import { addListeners } from './addListener'
import { animateSimulate } from './animation/animateSimulate'
import { RGBA, colorToHex, hexToRgba } from './color'
import { ANIMATION_PROPERTY_DELTA_PAIRS } from './component/app/graph/ANIMATION_PROPERTY_DELTA_PAIRS'
import { namespaceURI } from './component/namespaceURI'
import { componentFromSpecId } from './componentFromSpecId'
import { Context, dispatchCustomEvent } from './context'
import { makeCustomListener } from './event/custom'
import { readDataTransferItemAsText } from './event/drag'
import { extractTrait } from './extractTrait'
import { getComponentInterface } from './interface'
import { isHTML } from './isHTML'
import { isSVG, isSVGSVG } from './isSVG'
import {
  IOUIEventName,
  UI_EVENT_SET,
  makeUIEventListener,
} from './makeEventListener'
import { mount } from './mount'
import { parseLayoutValue } from './parseLayoutValue'
import { rawExtractStyle } from './rawExtractStyle'
import { stopImmediatePropagation, stopPropagation } from './stopPropagation'
import { applyStyle } from './style'
import { unmount } from './unmount'
import { addVector, rectsBoundingRect } from './util/geometry'
import { Rect } from './util/geometry/types'
import { getFontSize } from './util/style/getFontSize'
import { getOpacity } from './util/style/getOpacity'
import {
  getRelativePosition,
  getScrollPosition,
} from './util/style/getPosition'
import { getRect } from './util/style/getRect'
import { Scale, getScale } from './util/style/getScale'
import { getSize } from './util/style/getSize'
import { getTextAlign } from './util/style/getTextAlign'
import { getTextRect } from './util/web/getTextRect'

const $childToComponent = (
  system: System,
  { bundle }: Child
): Component<IOElement, {}, $Component> => {
  const { unit, specs = {} } = bundle

  const { id, memory = { input: {} } } = unit

  const props = {}

  forEachObjKV(memory.input ?? {}, (pinId, { _data }) => {
    props[pinId] = _data
  })

  const component = componentFromSpecId(
    system,
    weakMerge(specs, system.specs),
    id,
    props
  )

  return component
}

export const defaultFocusLookup = (
  component: Component,
  options: FocusOptions | undefined = { preventScroll: true }
): void => {
  if (component.$root.length > 0) {
    component.$root[0].focus(options)
  }

  if (component.$parentRoot.length > 0) {
    component.$parentRoot[0].focus(options)
  }

  if (component.$children.length > 0) {
    component.$children[0].focus(options)
  }
}

export class Component<
  E extends IOElement = any,
  P extends Dict<any> = Dict<any>,
  U extends $Component | $Graph = any,
> {
  static id: string

  public $_: string[] = []
  public $element: E
  public $props: P
  public $changed: Set<string> = new Set()

  private _$node: E

  public $system: System

  public $remoteId: string

  public $ref: Dict<Component<any>> = {}

  private _$context: Context

  public get $context(): Context {
    return this._$context ?? this.$system.context[0]
  }

  public $connected: boolean = false
  public $unit: U

  public $primitive: boolean = true

  public $propUnlisten: Dict<Unlisten> = {}

  public $unbundled: boolean = true
  public $controlled: boolean = false

  public $children: Component[] = []
  public $slotChildren: Dict<Component[]> = { default: [] }
  public $slotParentChildren: Dict<Component[]> = { default: [] }
  public $childSlotName: string[] = []

  public $remoteChildren: Component[] = []

  public $domChildren: Component[] = []

  public $slot: Dict<Component> = { default: this }
  public $slotId: Dict<string> = {}
  public $slotTarget: Dict<string> = {}

  public $subComponent: Dict<Component> = {}

  public $root: Component[] = []

  public $wrap: boolean = false

  public $shadowSlot: HTMLSlotElement

  public $output: Dict<any> = {}

  public $parentRoot: Component[] = []
  public $parentRootSlotName: string[] = []

  public $parentChildren: Component[] = []
  public $parentChildrenSlot: string[] = []

  public $mountRoot: Component[] = []
  public $mountParentRoot: Component[] = []
  public $mountParentChildren: Component[] = []

  public $rootParent: Component = null

  public $parent: Component | null = null
  public $slotParent: Component | null = null
  public $domParent: Component | null = null
  public $detachedContext: Context | null = null
  public $detachedSlotParent: Component | null = null
  public $attachedChildren: Component[] = []
  public $hostSlot: Component | null = null

  public $returnIndex: number = 0

  public $mounted: boolean = false
  public $detached: boolean = false

  private _stopPropagationSet: Set<string>
  private _stopImmediatePropagationSet: Set<string>
  private _preventDefaultCounter: Dict<number> = {}

  constructor($props: P, $system: System, $element?: E, $node?: E) {
    this.$props = $props
    this.$system = $system
    this.$element = $element
    this._$node = $node ?? $element
  }

  get $node() {
    return this._$node ?? this.$element
  }

  set $node($node: E) {
    this._$node = $node
  }

  getProp<K extends keyof P>(name: K): any {
    return this.$props[name]
  }

  setProp<K extends keyof P>(prop: K, data: P[K]) {
    const prev = this.$props[prop]

    this.$props[prop] = data

    const current = this._current(prop as string)

    if (this.$mounted) {
      this.onPropChanged(prop, current, prev)
    } else {
      this.$changed.add(prop as string)
    }
  }

  private _prop_transformer: { [K in keyof P]?: Callback[] } = {}

  interceptProp<K extends keyof P>(prop: K, transformer: Callback): Unlisten {
    this._prop_transformer[prop] = this._prop_transformer[prop] || []
    this._prop_transformer[prop].push(transformer)

    return () => {
      remove(this._prop_transformer[prop], transformer)
    }
  }

  getSlot(slotName: string): Component {
    return this.$slot[slotName]
  }

  onPropChanged<K extends keyof P>(prop: K, current: any, prev: any) {}

  refreshProp(prop: string) {
    this.setProp(prop, this.$props[prop])
  }

  onConnected($unit: U) {}

  onDisconnected() {}

  onMount() {}

  onUnmount($context: Context) {}

  onDestroy() {
    for (const child of this.$children) {
      child.destroy()
    }
  }

  dispatchEvent(
    type: string,
    detail: any = {},
    bubbles: boolean = true,
    id?: string
  ) {
    const {
      cache: { events },
      api: {
        window: { nextTick },
      },
    } = this.$system

    if (id) {
      if (events[id]) {
        return
      }
    }

    events[id] = true

    for (const root of this.getBaseRoots()) {
      dispatchCustomEvent(root.$element, type, detail, bubbles)
    }

    if (id) {
      nextTick(() => {
        delete events[id]
      })
    }
  }

  stopPropagation(event: string): Unlisten {
    this._stopPropagationSet = this._stopPropagationSet ?? new Set()

    if (this._stopPropagationSet.has(event)) {
      return
    }

    this._stopPropagationSet.add(event)

    return this._addBaseListener(event, stopPropagation, { passive: true })
  }

  cancelStopPropagation(event: string): void {
    if (!this._stopPropagationSet.has(event)) {
      return
    }

    this._stopPropagationSet.delete(event)

    const base = this.getRootBase()

    for (const [_, leaf] of base) {
      leaf.$element.removeEventListener(event, stopPropagation)
    }
  }

  stopImmediatePropagation(event: string): void {
    this._stopImmediatePropagationSet =
      this._stopImmediatePropagationSet ?? new Set()

    if (this._stopImmediatePropagationSet.has(event)) {
      return
    }

    this._stopImmediatePropagationSet.add(event)

    this.$element.addEventListener(event, stopImmediatePropagation, {
      passive: true,
    })
  }

  private _attachTextUnlisten: Dict<Unlisten> = {}

  attachText(type: string, text: string): void {
    if (this._attachTextUnlisten[type]) {
      this.detachText(type)
    }

    const base = this.getRootBase()

    const unlistenAll = []

    for (const [_, leaf] of base) {
      const listener = (event: DragEvent) => {
        event.dataTransfer.setData(type, text)
      }

      leaf.$element.addEventListener('dragstart', listener)

      unlistenAll.push(() => {
        leaf.$element.removeEventListener('dragstart', listener)
      })
    }

    this._attachTextUnlisten[type] = callAll(unlistenAll)
  }

  detachText(type: string): void {
    const unlisten = this._attachTextUnlisten[type]

    if (unlisten) {
      unlisten()
    }
  }

  attachDropTarget(): void {
    const rootLeaf = this.getFirstRootLeaf()

    rootLeaf.$element.addEventListener('dragover', (event) => {
      event.preventDefault()
    })

    rootLeaf.$element.addEventListener('drop', async (event: DragEvent) => {
      event.preventDefault()

      const { dataTransfer } = event

      const { items } = dataTransfer

      const promises: Promise<string>[] = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        promises.push(readDataTransferItemAsText(item))
      }

      const texts: string[] = await Promise.all(promises)

      if (this.$unit) {
        const $emitter = this.$unit.$refEmitter({ _: ['EE'] })

        $emitter.$emit({ type: 'drop', data: texts }, NOOP)
      }
    })
  }

  preventDefault(event: string): Unlisten {
    this._preventDefaultCounter[event] = this._preventDefaultCounter[event] ?? 0

    let unlisten = NOOP

    const unlisten_ = () => {
      this._preventDefaultCounter[event]--

      if (this._preventDefaultCounter[event] === 0) {
        unlisten()
      }
    }

    this._preventDefaultCounter[event]++

    if (this._preventDefaultCounter[event] === 1) {
      const listener = (event: Event) => {
        event.preventDefault()

        return false
      }

      const opt = { passive: false }

      unlisten = this._addBaseListener(event, listener, opt)
    }

    return unlisten_
  }

  private _addBaseListener = (
    event: string,
    listener: (event: Event) => boolean | void,
    opt?: boolean | AddEventListenerOptions
  ): Unlisten => {
    const roots = this.getBaseRoots()

    const allUnlisten = []

    for (const root of roots) {
      root.$element.addEventListener(event, listener, opt)

      allUnlisten.push(() => {
        root.$element.removeEventListener(event, listener)
      })
    }

    return callAll(allUnlisten)
  }

  private _releasePointerCapture: Dict<Unlisten> = {}

  hasPointerCapture(pointerId: number): boolean {
    return !!this._releasePointerCapture[pointerId]
  }

  setPointerCapture(pointerId: number): void {
    const {
      api: {
        window: { Text },
        input: {
          pointer: { setPointerCapture },
        },
      },
    } = this.$system
    // console.log(this.constructor.name, 'setPointerCapture', pointerId)

    const leaf = this.getFirstRootLeaf()

    if (leaf.$node instanceof Text) {
      throw new Error('cannot set pointer capture on a text element')
    }

    this._releasePointerCapture[pointerId] = setPointerCapture(
      leaf.$node,
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

  scroll(opt: ScrollOptions): void {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    const leaf = this.getFirstRootLeaf()

    if (leaf && leaf.$element instanceof HTMLElement) {
      leaf.$element.scroll(opt)
    }
  }

  scrollIntoView(opt: ScrollIntoViewOptions): void {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    if (this.$slot['default'] === this) {
      if (this.$primitive) {
        if (this.$element instanceof HTMLElement) {
          this.$element.scrollIntoView(opt)
        }
      } else {
        if (this.$root.length > 0) {
          this.$root[0].scrollIntoView(opt)
        }
      }
    } else {
      this.$slot['default'].scrollIntoView(opt)
    }
  }

  togglePopover() {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    const firstLeaf = this.getFirstRootLeaf()

    if (firstLeaf.$element instanceof HTMLElement) {
      if (firstLeaf.$element.togglePopover) {
        firstLeaf.$element.togglePopover()
      }
    } else {
      //
    }
  }

  hidePopover() {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    const firstLeaf = this.getFirstRootLeaf()

    if (firstLeaf.$element instanceof HTMLElement) {
      if (firstLeaf.$element.hidePopover) {
        firstLeaf.$element.hidePopover()
      }
    } else {
      //
    }
  }

  showPopover() {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    const firstLeaf = this.getFirstRootLeaf()

    if (firstLeaf.$element instanceof HTMLElement) {
      if (firstLeaf.$element.showPopover) {
        firstLeaf.$element.showPopover()
      }
    } else {
      //
    }
  }

  private _baseAnimationAbort: Unlisten

  private _animateBase = (
    leaves: Component[],
    slot: Component<any>,
    reverse: boolean = false,
    prepend: boolean = false,
    commit: Callback
  ): Unlisten => {
    const {
      foreground: { html },
      api: {
        window: { HTMLElement },
        text: { measureText },
        document: { createElement },
        layout: { reflectTreeTrait },
      },
    } = this.$system

    const allAbort = []

    let target = slot

    while (
      target.isParent() ||
      (target.$element instanceof HTMLElement && target.$element).style
        .display === 'contents'
    ) {
      target = target.$slotParent
    }

    const trait = extractTrait(target, measureText)
    const style = rawExtractStyle(target.$element, trait, measureText)

    // delete style['transform']
    delete style['opacity']

    const tree: Tree<Tag & { trait?: LayoutNode }> = {
      value: {
        name: 'div',
        style: {
          ...style,
          width: '100%',
          height: '100%',
        },
        textContent: '',
      },
      children: leaves.map((leaf) => ({
        value: {
          name: (leaf.$element as Node).nodeName,
          style: rawExtractStyle(leaf.$element, trait, measureText),
          textContent: (leaf.$element as Node).textContent,
        },
        children: [],
      })),
    }

    reflectTreeTrait(trait, [tree], () => {
      return []
    })

    let targetTraits = tree.children.map((child) => child.value.trait)

    let finished = 0
    let frames: HTMLDivElement[] = []

    let j = 0

    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]

      const leafTrait = extractTrait(leaf, measureText)

      const frame = createElement('div')

      applyStyle(frame, {
        position: 'absolute',
        left: `${leafTrait.x}px`,
        top: `${leafTrait.y}px`,
        width: `${leafTrait.width}px`,
        height: `${leafTrait.height}px`,
        pointerEvents: 'none',
        zIndex: '0',
        // border: `1px solid ${randomColorString()}`,
      })

      if (prepend) {
        target.$element.prepend(frame)
      } else {
        target.$element.appendChild(frame)
      }

      !reverse && this.domRemoveLeaf(leaf)

      leaf.unmount()

      frame.appendChild(leaf.$element)

      leaf.$slotParent = target

      leaf.mount(target._$context)

      frames.push(frame)

      const { x: scrollX0, y: scrollY0 } = getScrollPosition(
        target.$element,
        target._$context.$element
      )

      const abortAnimation = animateSimulate(
        this.$system,
        leafTrait,
        () => {
          const targetTrait = targetTraits[i]

          return targetTrait
        },
        ANIMATION_PROPERTY_DELTA_PAIRS,
        ({ x, y, width, height, sx, sy, opacity, fontSize }) => {
          if (j % leaves.length === 0) {
            reflectTreeTrait(trait, [tree], () => {
              return []
            })

            targetTraits = tree.children.map((child) => child.value.trait)

            j = 0
          }

          j++

          const { x: scrollX, y: scrollY } = getScrollPosition(
            target.$element,
            target._$context.$element
          )

          const scrollDx = scrollX - scrollX0
          const scrollDy = scrollY - scrollY0

          frame.style.left = `${
            x -
            (reverse ? this._$context.$x : trait.x) +
            ((Math.abs(sx) - 1) * width) / 2 -
            scrollDx
          }px`
          frame.style.top = `${
            y -
            (reverse ? this._$context.$y : trait.y) +
            ((Math.abs(sy) - 1) * height) / 2 -
            scrollDy
          }px`
          frame.style.width = `${width}px`
          frame.style.height = `${height}px`
          frame.style.transform = `scale(${sx}, ${sy})`
          frame.style.opacity = `1`
          frame.style.fontSize = `${fontSize}px`
        },
        () => {
          finished++

          if (finished === leaves.length) {
            for (let i = 0; i < leaves.length; i++) {
              const frame = frames[i]
              const leaf = leaves[i]

              frame.removeChild(leaf.$element)

              target.$element.removeChild(frame)
            }

            commit()
          }
        }
      )

      allAbort.push(abortAnimation)
    }

    return callAll(allAbort)
  }

  register(remoteId: string) {
    if (this.$remoteId) {
      throw new Error('cannot register a registered component')
    }

    const { registerLocalComponent } = this.$system

    this.$remoteId = remoteId

    registerLocalComponent(this, remoteId)
  }

  unregister() {
    if (!this.$remoteId) {
      return
    }

    this.$remoteId = undefined

    const { unregisterLocalComponent } = this.$system

    unregisterLocalComponent(this, this.$remoteId)
  }

  isFocusInside(): boolean {
    let activeElementInside: boolean = false

    const activeElement = getActiveElement(this.$system)

    if (activeElement) {
      activeElementInside = this.$element.contains(activeElement)

      for (const $root of this.$root) {
        activeElementInside = activeElementInside || $root.isFocusInside()
      }
    }

    return activeElementInside
  }

  detach(host: string, opt: { animate?: boolean; prepend?: boolean }): void {
    // console.log('Component', 'detach', host, opt)

    const {
      api: {
        window: { HTMLElement, SVGElement },
      },
    } = this.$system

    const { getLocalComponents } = this.$system

    const { animate = false, prepend = false } = opt

    if (this.$detached) {
      throw new Error('component is already detached')
    }

    this.$detached = true

    if (this._baseAnimationAbort) {
      this._baseAnimationAbort()

      this._baseAnimationAbort = undefined
    }

    const hostGlobalId = host.replace('unit://', '')

    const hosts = getLocalComponents(hostGlobalId)

    if (hosts.length === 0) {
      return
    }

    const activeElementInside = this.isFocusInside()

    const activeElement = getActiveElement(this.$system)

    const hostComponent = hosts[0] as Component

    const hostSlot = hostComponent.getSlot('default')

    const leaves = this.getRootLeaves()

    const all = [...leaves]

    for (const attachedChild of hostSlot.$attachedChildren) {
      all.unshift(attachedChild)
    }

    const commit = () => {
      for (const leaf of leaves) {
        push(hostSlot.$attachedChildren, leaf)

        leaf.$hostSlot = hostSlot
      }

      for (let i = 0; i < all.length; i++) {
        const leaf = all[i]

        hostSlot.domInsertChild(leaf, 'default', i)
      }

      if (activeElementInside) {
        if (
          activeElement instanceof HTMLElement ||
          activeElement instanceof SVGElement
        ) {
          activeElement.focus()
        }
      }
    }

    this.$detachedSlotParent = this.$slotParent
    this.$detachedContext = this._$context

    let index = 0
    if (this.$rootParent) {
      index = this.$rootParent.$parentRoot.indexOf(this)
    } else if (this.$parent) {
      index = this.$parent.$parentRoot.indexOf(this)
    } else {
      index = this._$context.$children.indexOf(this)
    }

    this.$returnIndex = index

    if (animate) {
      this._baseAnimationAbort = this._animateBase(
        all,
        hostSlot,
        false,
        prepend,
        commit
      )
    } else {
      this.domRemoveLeaves(leaves)

      commit()
    }
  }

  attach(opt: { animate?: boolean }): void {
    // console.log('Component', 'attach', opt)

    if (!this.$detached) {
      throw new Error('component is not detached')
    }

    const { animate } = opt

    this.$detached = false

    if (this._baseAnimationAbort) {
      this._baseAnimationAbort()

      this._baseAnimationAbort = undefined
    }

    const leaves = this.getRootLeaves()

    let leafEnd = 0

    const couple = (leaf: Component) => {
      remove(leaf.$hostSlot.$attachedChildren, leaf)

      leaf.$hostSlot = null

      leaf.unmount()

      if (leaf.$rootParent) {
        leaf.$rootParent.domInsertParentRootAt(
          leaf,
          this.$returnIndex,
          'default'
        )
      } else if (leaf.$parent) {
        leaf.$parent.domInsertRootAt(leaf, this.$returnIndex)
      } else {
        //
      }

      leaf.mount(this.$parent._$context)
    }

    if (animate) {
      const targetSlots = []

      this.templateLeaves(
        leaves,
        (root) => {
          targetSlots.push(root.$slot['default'])
        },
        (parentRoot) => {
          targetSlots.push(parentRoot.$slot['default'])
        },
        () => {
          //
        }
      )

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i]

        const targetSlot = this.$detachedSlotParent

        this._baseAnimationAbort = this._animateBase(
          [leaf],
          targetSlot,
          true,
          false,
          () => {
            leafEnd++

            couple(leaf)
          }
        )
      }
    } else {
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i]

        couple(leaf)
      }
    }
  }

  public templateLeaves = (
    leaves: Component[],
    root: (parent: Component, leafComp: Component) => void,
    parentRoot: (parent: Component, leafComp: Component) => void,
    self: (leafComp: Component) => void
  ): void => {
    // console.log('Component', 'templateBase', sub_component_id)

    for (const leaf of leaves) {
      this.templateLeaf(leaf, root, parentRoot, self)
    }
  }

  public templateLeaf = (
    leaf: Component,
    root: (parent: Component, leafComp: Component) => void,
    parentRoot: (parent: Component, leafComp: Component) => void,
    self: (leafComp: Component) => void
  ): void => {
    // console.log('Component', 'templateLeaf', sub_component_id)

    const leafParent = leaf.$parent

    if (leafParent === leaf) {
      self(leaf)
    } else {
      if (leaf.$parent) {
        const subComponentId = leaf.$parent.getSubComponentId(leaf)

        const parentId = leafParent.getSubComponentParentId(subComponentId)

        if (parentId) {
          const parent = leafParent.getSubComponent(parentId)

          parentRoot(parent, leaf)
        } else {
          root(leafParent, leaf)
        }
      } else {
        //
      }
    }
  }

  public domRemoveLeaves = (leaves: Component[]): void => {
    this.templateLeaves(
      leaves,
      (parent, leafComp) => {
        const index = parent.$root.indexOf(leafComp)

        parent.domRemoveRoot(leafComp, index, index)
      },
      (parent, leafComp) => {
        const index = parent.$parentRoot.indexOf(leafComp)

        parent.domRemoveParentRootAt(
          leafComp,
          'default',
          index,
          index,
          this.$slotParent
        )
      },
      (leafComp) => {
        //
      }
    )
  }

  public domRemoveLeaf = (leaf: Component): void => {
    this.templateLeaf(
      leaf,
      (parent, leafComp) => {
        const index = parent.$root.indexOf(leafComp)

        parent.domRemoveRoot(leafComp, index, index)
      },
      (parent, leafComp) => {
        const index = parent.$parentRoot.indexOf(leafComp)

        parent.domRemoveParentRootAt(
          leafComp,
          'default',
          index,
          index,
          this.$slotParent
        )
      },
      () => {
        //
      }
    )
  }

  public domAppendBase = (leaves: Component[]): void => {
    // console.log('Component', 'domAppendBase', sub_component_id)

    this.templateLeaves(
      leaves,
      (parent, leafComp) => {
        parent.domAppendRoot(
          leafComp,
          this.$root.length - 1,
          this.$root.length - 1
        )
      },
      (parent, leafComp) => {
        const index = parent.$parentRoot.indexOf(leafComp)

        parent.domAppendParentRoot(leafComp, 'default', index)
      },
      () => {
        //
      }
    )
  }

  public mountChild(child: Component, commit: boolean = true): void {
    child.mount(this._$context, commit)
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

  private _forAllDescendent(callback: Callback<Component>): void {
    for (const subComponent of this.$root) {
      callback(subComponent)
    }

    for (const subComponent of this.$parentChildren) {
      callback(subComponent)
    }
  }

  commit() {
    if (this.$detached) {
      return
    }

    this.onMount()

    this._forAllMountDescendent((child) => {
      child.commit()
    })

    const $changed = new Set(this.$changed)

    for (const name of $changed) {
      const current = this._current(name)

      this.$changed.delete(name)

      this.onPropChanged(name, current, current)
    }
  }

  protected _current(name: string): any {
    const data = this.$props[name]

    const current =
      (this._prop_transformer[name] || []).reduce((acc, t) => {
        return t(acc)
      }, data as any) ?? data

    return current
  }

  mount(_$context: Context, commit: boolean = true): void {
    // console.log(this.constructor.name, 'mount')

    if (this.$detached) {
      return
    }

    if (this.$mounted) {
      throw new Error('cannot mount a mounted component')
    }

    this._$context = _$context
    this.$mounted = true

    this._forAllMountDescendent((child) => {
      this.mountChild(child, false)
    })

    if (commit) {
      this.commit()
    }

    if (this.isBase()) {
      this.dispatchEvent('mount', {}, false)
    }
  }

  unmount() {
    // console.log(this.constructor.name, 'unmount')

    if (this.$detached) {
      return
    }

    if (!this.$mounted) {
      throw new Error('cannot unmount unmounted component')
    }

    const _$context = this._$context

    this._forAllMountDescendent((child) => {
      if (child.$detached) {
        return
      }

      this.unmountDescendent(child)
    })

    this.$mounted = false

    this._$context = null

    this.onUnmount(_$context)

    if (this.isBase()) {
      this.dispatchEvent('unmount', {}, false)
    }
  }

  focus(options: FocusOptions | undefined = { preventScroll: true }) {
    const {
      api: {
        window: { Text },
      },
    } = this.$system

    if (this.$slot['default'] === this) {
      if (this.$element instanceof Text) {
        return
      }

      if (this.$primitive) {
        this.$element.focus(options)
      } else {
        defaultFocusLookup(this, options)
      }
    } else {
      this.$slot['default'].focus(options)
    }
  }

  blur() {
    const {
      api: {
        window: { Text },
      },
    } = this.$system

    if (this.$slot['default'] === this) {
      if (this.$element instanceof Text) {
        return
      }

      if (!this.$primitive) {
        let i = 0

        while (this.$root[i] instanceof Text) {
          i++
        }

        if (this.$mountRoot[i]) {
          this.$mountRoot[i].blur()
        }
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

  public $animationCount: number = 0

  animate(
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ): Animation[] {
    const base = this.getAnimatableBase()

    const animations = []

    for (const leaf of base) {
      const animation = leaf.$element.animate(keyframes, options)

      leaf.$element.dispatchEvent(new CustomEvent('animationstart'))

      leaf.$animationCount++

      leaf.$element.addEventListener('end', () => {
        leaf.$animationCount--

        leaf.$element.dispatchEvent(new CustomEvent('animationend'))
      })
      leaf.$element.addEventListener('cancel', () => {
        leaf.$animationCount--

        leaf.$element.dispatchEvent(new CustomEvent('animationend'))
      })

      animations.push(animation)
    }

    return animations
  }

  getAnimatableBase(): Component<HTMLElement | SVGElement>[] {
    const {
      api: {
        window: { Text },
      },
    } = this.$system

    const base = this.getRootBase()

    const root = []

    for (const [_, leaf] of base) {
      if (leaf.$element instanceof Text) {
        continue
      }

      root.push(leaf)
    }

    return root
  }

  getAnimationsById(id: string): Animation[] {
    const animations: Animation[] = this.getAnimations()

    const animations_ = animations.filter((a) => {
      return a.id === id
    })

    return animations_
  }

  getAnimations(): Animation[] {
    const base = this.getAnimatableBase()

    const animations: Animation[] = []

    for (const leaf of base) {
      const leafAnimations = leaf.$element.getAnimations()

      for (const animation of leafAnimations) {
        animations.push(animation)
      }
    }

    return animations
  }

  cancelAnimation(id: string) {
    const animations = this.getAnimationsById(id)

    for (const animation of animations) {
      animation.cancel()
    }
  }

  commitAnimation(id: string) {
    const animations = this.getAnimationsById(id)

    for (const animation of animations) {
      animation.commitStyles()
    }
  }

  getOffset(): Component {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    if (this.isSVG() || this.isText()) {
      return this
    }

    if (this.$element instanceof SVGSVGElement) {
      return this
    }

    let offset: Component = this

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

  getColor(): RGBA {
    const {
      api: {
        window: { HTMLElement, SVGElement },
      },
    } = this.$system

    const defaultColor = () => {
      if (this.$slotParent) {
        return this.$slotParent.getColor()
      } else if (this.$context) {
        return hexToRgba(this.$context.$color)
      } else {
        return hexToRgba(this.$system.color)
      }
    }

    if (this.$primitive) {
      if (
        this.$element instanceof HTMLElement ||
        this.$element instanceof SVGElement
      ) {
        const styleColor = this.$element.style.color

        if (styleColor === 'currentcolor') {
          return defaultColor()
        }
        if (styleColor) {
          const hex = colorToHex(styleColor)

          return (hex && hexToRgba(hex)) || defaultColor()
        } else {
          return defaultColor()
        }
      } else {
        return defaultColor()
      }
    } else {
      return defaultColor()
    }
  }

  getFontSize(): number {
    const { $width, $height } = this.$context

    if (this.$primitive) {
      const fontSize = getFontSize(this.$element, $width, $height)

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

  private _svg_wrapper: SVGSVGElement[] = []
  private _html_wrapper: SVGForeignObjectElement[] = []

  private _svgWrapper(): SVGSVGElement {
    const svg = this.$system.api.document.createElementNS(
      namespaceURI,
      'svg'
    ) as SVGSVGElement

    svg.style.display = 'block'
    svg.style.width = '100%'
    svg.style.height = '100%'

    return svg
  }

  private _htmlWrapper() {
    const foreignObject = this.$system.api.document.createElementNS(
      namespaceURI,
      'foreignObject'
    )

    foreignObject.style.width = '100%'
    foreignObject.style.height = '100%'

    return foreignObject
  }

  isSVG(): boolean {
    return isSVG(this.$system, this.$element as SVGElement)
  }

  isHTML(): boolean {
    return isHTML(this.$system, this.$element as HTMLElement)
  }

  isText(): boolean {
    const {
      api: {
        window: { Text },
      },
    } = this.$system

    return this.$element instanceof Text
  }

  isBase(): boolean {
    return this.$primitive && !this.$wrap && this.$root.length === 0
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

    if (p.length === 0) {
      p = [[path, this]]
    }

    return p
  }

  getRootLeaves(path: string[] = []): Component[] {
    if (this.isBase()) {
      return [this]
    }

    let p = []

    for (const subComponent of this.$root) {
      const subComponentId = this.getSubComponentId(subComponent)

      const subComponentRootBase = subComponent.getRootLeaves([
        ...path,
        subComponentId,
      ])

      p = [...p, ...subComponentRootBase]
    }

    if (p.length === 0) {
      p = [this]
    }

    return p
  }

  getBaseRoots(): Component[] {
    if (this.isBase()) {
      return [this]
    }

    let p: Component[] = []

    for (const root of this.$root) {
      const rootRoots = root.getBaseRoots()

      p = [...p, ...rootRoots]
    }

    if (p.length === 0) {
      p = [this]
    }

    return p
  }

  getFirstRootLeaf(): Component {
    const base = this.getRootBase()

    const [_, leaf] = base[0]

    return leaf
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

      if (!subComponent) {
        return null
      }

      return subComponent.pathGetSubComponent(tail)
    }
  }

  getRect(): Rect {
    return getRect(this.$node)
  }

  getBoundingClientRect(): Rect {
    const {
      api: {
        window: { Text },
      },
    } = this.$system

    if (!this.$primitive) {
      const base = this.getRootLeaves()

      const rects = base.map((leaf) => leaf.getBoundingClientRect())

      return rectsBoundingRect(rects)
    }

    let bcr: Rect

    if (this.$node instanceof Text) {
      bcr = getTextRect(this.$system, this.$node)
    } else {
      bcr = this.$node.getBoundingClientRect()
    }

    const { $x, $y, $sx, $sy } = this.$context

    const { x, y, width, height } = bcr

    return {
      x: (x - $x) / $sx,
      y: (y - $y) / $sy,
      width: width / $sx,
      height: height / $sy,
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

  insertChild(
    child: Component,
    slotName: string = 'default',
    at: number
  ): number {
    // console.log('Component', 'insertChild', slotName, at)

    this.memInsertChild(child, slotName, at)
    this.domInsertChild(child, slotName, at)
    this.postInsertChild(child, slotName, at)

    return at
  }

  public appendChildren(children: Component[], slotName: string): void {
    this.memAppendChildren(children, slotName)
    this.domAppendChildren(children, slotName)
    this.postAppendChildren(children, slotName)
  }

  public memAppendChildren(children: Component[], slotName: string): void {
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []

    for (const child of children) {
      this.memInsertChild(child, slotName, this.$slotChildren[slotName].length)
    }
  }

  public postAppendChildren(children: Component[], slotName: string): void {
    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []

    for (const child of children) {
      this.postAppendChild(child, slotName, this.$slotChildren[slotName].length)
    }
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

  public memInsertChild(child: Component, slotName: string, at: number): void {
    // console.log('Component', 'memInsertChild', slotName, at)

    this.$slotChildren[slotName] = this.$slotChildren[slotName] || []

    insert(this.$slotChildren[slotName], child, at)

    const i = this.$children.length

    this.$children.push(child)
    this.$childSlotName[i] = slotName

    const slot = this.$slot[slotName]

    slot.memInsertParentChild(child, at, slotName)
  }

  public domAppendChildren(children: Component[], slotName: string) {
    const fragment = new Component({}, this.$system)

    fragment.$element = new DocumentFragment()

    const slot = this.getLeafSlot(slotName)

    for (const child of children) {
      fragment._domAppendChild(child)
    }

    this._domAppendChild(fragment, slotName)

    for (const child of children) {
      child.$slotParent = slot
    }
  }

  public getLeafSlot(slotName: string) {
    let slot = this.$slot[slotName]

    while (slot.$slot[slotName] && slot.$slot[slotName] !== slot) {
      slot = slot.$slot[slotName]
    }

    return slot
  }

  private _domAppendChild(
    child: Component,
    slotName: string = 'default'
  ): void {
    // console.log('Component', '_domAppendChild')

    const at = this.$children.length - 1

    this._domInsertChild(child, slotName, at)
  }

  private _domInsertChild(
    child: Component,
    slotName: string = 'default',
    at: number
  ): void {
    // console.log('Component', '_domAppendChild')

    const slot = this.getLeafSlot(slotName)

    slot.domInsertParentChildAt(child, slotName, at)
  }

  public domAppendChild(
    child: Component,
    slotName: string = 'default',
    at: number
  ): void {
    // console.log('Component', 'domAppendChild')

    this._domAppendChild(child, slotName)
  }

  public domInsertChild(
    child: Component,
    slotName: string = 'default',
    at: number
  ): void {
    // console.log('Component', 'domInsertChild', slotName, at)

    this._domInsertChild(child, slotName, at)
  }

  public postAppendChild(child: Component, slotName: string, at: number): void {
    const slot = this.$slot[slotName]

    slot.postAppendParentChild(child, slotName, at)
  }

  public postInsertChild(child: Component, slotName: string, at: number): void {
    const slot = this.$slot[slotName]

    slot.postAppendParentChild(child, slotName, at)
  }

  public _createSVGWrapper(): Component<SVGSVGElement> {
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
    if (this.isHTML() && child.isSVG()) {
      return svg()
    } else if (this.isSVG() && child.isHTML()) {
      return html()
    } else {
      return fallback()
    }
  }

  public domRemoveChild(
    child: Component,
    slotName: string = 'default',
    at?: number
  ): void {
    const slot = this.$slot[slotName]

    at = at ?? slot.$slotChildren[slotName].indexOf(child)

    slot.domRemoveParentChildAt(child, slotName, at, at, this.$slotParent)

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

  public connect($unit: U, deep: boolean = true): Unlisten {
    if (this.$connected) {
      // throw new Error('component is already connected')
      return NOOP
    }

    this._connect($unit, deep)

    if (deep) {
      if (this.$unbundled) {
        for (const unitId in this.$subComponent) {
          const childSubComponent = this.$subComponent[unitId]

          const _ = getComponentInterface(childSubComponent)

          const subUnit = ($unit as $Graph).$refSubComponent({ unitId, _ })

          childSubComponent.connect(subUnit)
        }
      }
    }

    return () => {
      this.disconnect()
    }
  }

  public _connect($unit: U, deep: boolean = true): void {
    // console.log(this.constructor.name, 'connect')

    if (this.$connected) {
      // throw new Error('component is already connected')
      return
    }

    this.$unit = proxyWrap($unit, UCGEE)

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

          const child = this._instanceChild({ bundle }, at)

          const slot_name = 'default'

          push(this.$remoteChildren, child)

          this.appendChild(child, slot_name)
        } else if (event_event === 'append_children') {
          const bundles = event_data

          const children = bundles.map((bundle: UnitBundleSpec, i: number) =>
            this._instanceChild({ bundle }, this.$children.length + i)
          )

          const slot_name = 'default'

          for (const child of children) {
            push(this.$remoteChildren, child)
          }

          this.appendChildren(children, slot_name)
        } else if (event_event === 'remove_child') {
          const at = event_data

          const child = this.$remoteChildren[at]

          this.removeChildAt(at)

          child.disconnect()
          child.destroy()

          remove(this.$remoteChildren, child)
        } else if (event_event === 'play') {
          this.play()
        } else if (event_event === 'pause') {
          this.pause()
        } else if (event_event === 'register') {
          this.register(event_data)
        } else if (event_event === 'unregister') {
          this.unregister()
        } else {
          throw new Error('invalid event')
        }
      },
    }

    const unit_listener = (moment: Moment): void => {
      const { type } = moment

      handler[type] && handler[type](moment)
    }

    this.$named_listener_count = {}

    $unit.$getGlobalId({}, (remoteId: string) => {
      this.register(remoteId)
    })

    const all_unlisten: Unlisten[] = []

    const events = [
      'append_child',
      'append_children',
      'remove_child',
      'register',
      'unregister',
      'play',
      'pause',
    ]

    const unit_unlisten = this.$unit.$watch({ events }, unit_listener)

    all_unlisten.push(unit_unlisten)

    this.$unit.$getSetup({}, (setup) => {
      const {
        events,
        animations,
        stopPropagation,
        stopImmediatePropagation,
        preventDefault,
      } = setup

      for (const event of events) {
        listen(event as IOUIEventName)
      }

      for (const animation of animations) {
        const { keyframes, opt } = animation

        this.animate(keyframes, opt)
      }

      for (const event of stopPropagation) {
        this.stopPropagation(event)
      }
    })

    const $emitter = $unit.$refEmitter({ _: ['EE'] })

    const unlisten_control = this.$control($emitter)

    all_unlisten.push(unlisten_control)

    const unlisten_emitter = callAll([
      $emitter.$addListener({ event: 'listen' }, ([{ event }]) => {
        if (UI_EVENT_SET.has(event as IOUIEventName) || event.startsWith('_')) {
          listen(event)
        }
      }),
      $emitter.$addListener({ event: 'unlisten' }, ([{ event }]) => {
        if (
          UI_EVENT_SET.has((event as IOUIEventName) || event.startsWith('_'))
        ) {
          unlisten(event)
        }
      }),
      $emitter.$addListener({ event: 'call' }, ([{ method, data }]) => {
        this._call(method, data)
      }),
    ])

    all_unlisten.push(unlisten_emitter)

    this._unit_unlisten = callAll(all_unlisten)

    $unit.$children({}, ($children: Children) => {
      if ($children.length > 0) {
        const children = $children.map(this._instanceChild)

        this.$remoteChildren = children

        this.setChildren(children)
      }
    })

    this.$connected = true

    this.onConnected($unit)
  }

  private _instanceChild = ($child: Child, at: number) => {
    const component = $childToComponent(this.$system, $child)

    const _ = getComponentInterface(component)

    const $childRef = this.$unit.$refChild({ at, _ })

    component.connect($childRef)

    return component
  }

  private $control = ($emitter: $EE) => {
    return callAll([
      $emitter.$addListener(
        { event: 'set_sub_component' },
        ([subComponentId, bundle]) => {
          if (!this.$controlled) {
            const child = $childToComponent(this.$system, { bundle })

            const _ = getComponentInterface(child)

            const $subComponent = (this.$unit as $Graph).$refUnit({
              unitId: subComponentId,
              _,
            }) as $Component

            child.connect($subComponent)

            this.setSubComponent(subComponentId, child)
          }
        }
      ),
      $emitter.$addListener(
        { event: 'register_root' },
        ([globalRef]: [GlobalRefSpec]) => {
          if (!this.$controlled) {
            const { globalId } = globalRef

            let subComponent: Component

            for (const subComponentId in this.$subComponent) {
              const siblingComponent = this.$subComponent[subComponentId]

              if (siblingComponent.$remoteId === globalId) {
                subComponent = siblingComponent

                break
              }
            }

            if (subComponent) {
              if (subComponent.$rootParent) {
                subComponent.$rootParent.removeParentRoot(subComponent)
              }

              this.registerRoot(subComponent)
            }
          }
        }
      ),
      $emitter.$addListener(
        { event: 'unregister_root' },
        ([globalRef]: [GlobalRefSpec]) => {
          if (!this.$controlled) {
            const { globalId } = globalRef

            let subComponent: Component

            for (const subComponentId in this.$subComponent) {
              const siblingComponent = this.$subComponent[subComponentId]

              if (
                siblingComponent.$remoteId === globalId &&
                siblingComponent.$mounted
              ) {
                subComponent = siblingComponent

                break
              }
            }

            if (subComponent) {
              for (const parentRoot of [...subComponent.$parentRoot]) {
                subComponent.unregisterParentRoot(parentRoot)

                this.registerRoot(parentRoot)
              }

              this.unregisterRoot(subComponent)
            }
          }
        }
      ),
      $emitter.$addListener(
        { event: 'register_parent_root' },
        ([globalRef]: [GlobalRefSpec]) => {
          if (!this.$controlled) {
            const { globalId } = globalRef

            const components = this.$system.getLocalComponents(globalId)

            if (!components.length) {
              return
            }

            let subComponent: Component

            if (!this.$parent.$controlled) {
              for (const subComponentId in this.$parent.$subComponent) {
                const siblingComponent =
                  this.$parent.$subComponent[subComponentId]

                if (siblingComponent.$remoteId === globalId) {
                  subComponent = siblingComponent

                  break
                }
              }

              if (subComponent) {
                if (subComponent.$rootParent) {
                  subComponent.$rootParent.removeParentRoot(subComponent)
                } else if (
                  subComponent.$parent &&
                  subComponent.$parent.$mountRoot.includes(subComponent)
                ) {
                  subComponent.$parent.removeRoot(subComponent)
                }

                this.registerParentRoot(subComponent)
              }
            }
          }
        }
      ),
      $emitter.$addListener(
        { event: 'unregister_parent_root' },
        ([globalRef]: [GlobalRefSpec]) => {
          if (!this.$controlled) {
            const { globalId } = globalRef

            const components = this.$system.getLocalComponents(globalId)

            if (!components.length) {
              return
            }

            let subComponent: Component

            if (!this.$parent.$controlled) {
              for (const subComponentId in this.$parent.$subComponent) {
                const siblingComponent =
                  this.$parent.$subComponent[subComponentId]

                if (siblingComponent.$remoteId === globalId) {
                  subComponent = siblingComponent

                  break
                }
              }

              if (subComponent) {
                if (subComponent.$rootParent) {
                  subComponent.$rootParent.removeParentRoot(subComponent)
                } else if (
                  subComponent.$parent &&
                  subComponent.$parent.$mountRoot.includes(subComponent)
                ) {
                  subComponent.$parent.removeRoot(subComponent)
                }

                this.unregisterParentRoot(subComponent)
              }
            }
          }
        }
      ),
      $emitter.$addListener(
        { event: 'reorder_sub_component' },
        ([parentId, childId, to]) => {
          if (!this.$controlled) {
            const child = this.getSubComponent(childId)

            if (parentId) {
              const parent = this.getSubComponent(parentId)

              const slotName = 'default'

              parent.removeParentRoot(child)
              parent.insertParentChildAt(child, slotName, to)
            } else {
              this.removeRoot(child)
              this.insertRootAt(child, to)
            }
          }
        }
      ),
      $emitter.$addListener(
        { event: 'move_sub_component_root' },
        ([parentId, prevParentMap, children, slotMap, prevSlotMap]) => {
          if (!this.$controlled) {
            for (const childId of children) {
              const child = this.getSubComponent(childId)
              const currentParentId = this.getSubComponentParentId(childId)

              if (currentParentId) {
                const parent = this.getSubComponent(currentParentId)

                parent.unregisterParentRoot(child)
              } else {
                this.unregisterRoot(child)
              }

              if (parentId) {
                const parent = this.getSubComponent(parentId)

                const slotName = 'default'

                parent.registerParentRoot(child, slotName)
              } else {
                this.registerRoot(child)
              }
            }
          }
        }
      ),
    ])
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
      throw new Error('component is not connected')
    }

    this._unit_unlisten()

    for (const child of this.$remoteChildren) {
      child.disconnect()
    }

    this.unregister()

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
    push(this.$root, component)
  }

  public placeRootAt(component: Component, at: number): void {
    insert(this.$root, component, at)
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
    _if(this.$mounted, mount, component, this._$context)
  }

  public domAppendRoot(component: Component, at: number, index: number): void {
    set(component, '$slotParent', this)

    this.$slotParentChildren['default'] =
      this.$slotParentChildren['default'] ?? []
    this.$slotParentChildren['default'][at] = component

    if (!this.$primitive) {
      if (!component.$primitive) {
        let i = 0

        for (const root of component.$mountRoot) {
          this.domAppendRoot(root, at + i, index + i)

          i++
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domAppendParentChildAt(
            component,
            'default',
            at,
            index
          )
        } else {
          this.domCommitAppendChild(component, this.$mountRoot.length - 1)
        }
      }
    } else {
      if (!component.$primitive) {
        let i = 0

        for (const root of component.$mountRoot) {
          this.domAppendRoot(root, i, index)

          i++
        }
      } else {
        this.domCommitAppendChild(component, this.$mountRoot.length - 1)
      }
    }
  }

  public isParent = (): boolean => {
    const {
      api: {
        window: { HTMLElement },
      },
    } = this.$system

    if (this.$element instanceof HTMLElement) {
      return !!this.$element.classList?.contains('__parent')
    }

    return false
  }

  protected _insertAt(parent: Component, child: Component, at: number) {
    this.$domChildren[at] = child

    child.$domParent = parent

    const target = this._wrapElement(parent, child, at)

    insertAt(parent.$element, target, at)
  }

  private _svg_wrapper_unlisten: Unlisten[] = []

  public $wrapElement: HTMLElement | SVGElement

  private _wrapElement = (
    parent: Component,
    child: Component<HTMLElement | SVGElement>,
    at: number
  ) => {
    const { $element: element } = child

    let target = element

    if (isHTML(this.$system, parent.$element) && isSVG(this.$system, element)) {
      const {
        api: {
          document: { MutationObserver },
        },
      } = this.$system

      const svg = this._svgWrapper() as SVGSVGElement

      child.$wrapElement = svg

      target = svg

      const config: MutationObserverInit = {
        childList: false,
        subtree: false,
        attributes: true,
      }

      const mirror = element.cloneNode() as SVGElement

      const { foreground } = this.$system

      foreground.svg.appendChild(mirror)

      mirror.style.visibility = 'hidden'

      const resize = () => {
        if (!element.isConnected) {
          const oldViewBox = element.getAttribute('data-viewbox')

          if (oldViewBox) {
            svg.setAttribute('viewBox', oldViewBox)

            return
          }
        }

        const strokeWidth =
          parseLayoutValue(
            (element as SVGElement).style.strokeWidth ??
              (element as SVGElement).getAttribute('stroke-width') ??
              '3px'
          )[0] + 3

        const rect = mirror.getBoundingClientRect()
        const tRect = getTransformedRect(element as SVGElement, rect)

        const { x, y, width, height } = tRect

        const viewBox = `${x - strokeWidth} ${y - strokeWidth} ${width + 2 * strokeWidth} ${height + 2 * strokeWidth}`

        element.setAttribute('data-viewbox', viewBox)

        svg.setAttribute('viewBox', viewBox)
      }

      resize()

      const observer = new MutationObserver((records) => {
        let tapped = new Set(['data-viewbox'])

        for (const record of records.reverse()) {
          const { attributeName } = record

          if (tapped.has(attributeName)) {
            continue
          }

          tapped.add(attributeName)

          const value =
            (element as SVGElement).getAttribute(attributeName) ?? ''

          mirror.setAttribute(attributeName, value)
        }

        mirror.style.visibility = 'hidden'

        if (tapped.size > 1) {
          resize()
        }
      })

      observer.observe(element, config)

      function parseTransformMatrix(matrixString: string) {
        if (!matrixString || matrixString === 'none') {
          return [1, 0, 0, 1, 0, 0]
        }

        return matrixString
          .replace('matrix(', '')
          .replace(')', '')
          .split(',')
          .map(parseFloat)
      }

      function applyMatrixToPoint(matrix: number[], x: number, y: number) {
        const [a, b, c, d, e, f] = matrix

        const newX = a * x + c * y + e
        const newY = b * x + d * y + f

        return { x: newX, y: newY }
      }

      function getTransformedRect(
        element: HTMLElement | SVGElement,
        rect: Rect
      ): Rect {
        if (!element.isConnected) {
          return rect
        }

        const matrixString = getComputedStyle(element).transform
        const matrix = parseTransformMatrix(matrixString)

        const topLeft = applyMatrixToPoint(matrix, rect.x, rect.y)
        const topRight = applyMatrixToPoint(matrix, rect.x + rect.width, rect.y)
        const bottomLeft = applyMatrixToPoint(
          matrix,
          rect.x,
          rect.y + rect.height
        )
        const bottomRight = applyMatrixToPoint(
          matrix,
          rect.x + rect.width,
          rect.y + rect.height
        )

        const xCoords = [topLeft.x, topRight.x, bottomLeft.x, bottomRight.x]
        const yCoords = [topLeft.y, topRight.y, bottomLeft.y, bottomRight.y]

        const maxX = Math.max(...xCoords)
        const maxY = Math.max(...yCoords)
        const minX = Math.min(...xCoords)
        const minY = Math.min(...yCoords)

        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        }
      }

      let transitionCount = child.$animationCount

      let cooldown = -1

      let frame: number

      let start = () => {
        resize()

        if (cooldown > 0) {
          cooldown--

          if (cooldown === 0) {
            return
          }
        }

        frame = requestAnimationFrame(start)
      }

      let stop = () => {
        cancelAnimationFrame(frame)
      }

      const onTransitionStart = (event) => {
        transitionCount++

        if (transitionCount === 1) {
          cooldown = -1

          start()
        }
      }

      const onTransitionEnd = (event) => {
        transitionCount--

        if (transitionCount === 0) {
          cooldown = 10
        }
      }

      element.addEventListener('transitionstart', onTransitionStart)
      element.addEventListener('transitionend', onTransitionEnd)

      element.addEventListener('animationstart', onTransitionStart)
      element.addEventListener('animationstend', onTransitionEnd)

      this._svg_wrapper[at] = target as SVGSVGElement
      this._svg_wrapper_unlisten[at] = () => {
        observer.disconnect()

        stop()
      }

      target.appendChild(element)

      if (transitionCount > 0) {
        start()
      }
    } else if (
      (isSVG(this.$system, parent.$element) ||
        isSVGSVG(this.$system, parent.$element)) &&
      isHTML(this.$system, element)
    ) {
      target = this._htmlWrapper()

      child.$wrapElement = target

      this._html_wrapper[at] = target as SVGForeignObjectElement

      target.appendChild(element)
    }

    return target
  }

  private _unwrapElement = (parent: Node, element: Node, at: number) => {
    let target: Node = element

    if (isHTML(this.$system, parent) && isSVG(this.$system, element)) {
      target = this._svg_wrapper[at]

      this._svg_wrapper[at] = undefined

      this._svg_wrapper_unlisten[at]()
      this._svg_wrapper_unlisten[at] = undefined

      target.removeChild(element)
    } else if (
      (isSVG(this.$system, parent) || isSVGSVG(this.$system, parent)) &&
      isHTML(this.$system, element)
    ) {
      target = this._html_wrapper[at]

      this._html_wrapper[at] = undefined

      target.removeChild(element)
    }

    return target
  }

  protected domCommitAppendChild(component: Component, at: number) {
    this._domCommitChild__template(component, at, this._insertAt.bind(this))
  }

  protected domCommitInsertChild(component: Component, at: number) {
    if (component.$detached) {
      return
    }

    this._domCommitChild__template(component, at, this._insertAt.bind(this))
  }

  protected _domCommitChild__template = (
    component: Component,
    at: number,
    callback: (parent: Component, child: Component, at: number) => void
  ) => {
    if (component.isParent()) {
      let i = 0

      for (const root of component.$root) {
        this._domCommitChild__template(root, at + i, callback)

        i++
      }

      return
    }

    if (this.isParent()) {
      if (this.$slotParent) {
        const index =
          this.$slotParent.$slotParentChildren['default'].indexOf(this)

        this.$slotParent._domCommitChild__template(
          component,
          index + at,
          callback
        )
      } else {
        callback(this, component, at)
      }
    } else {
      callback(this, component, at)
    }
  }

  public appendRoot(component: Component): void {
    // console.log('Component', 'appendRoot', component)
    const at = this.$mountRoot.length
    const index = this.$root.indexOf(component)

    this.memAppendRoot(component)
    this.domAppendRoot(component, at, index)
    this.postAppendRoot(component)
  }

  public insertRootAt(component: Component, at: number): void {
    this.memInsertRootAt(component, at)
    this.domInsertRootAt(component, at)
    this.postInsertRootAt(component, at)
  }

  public postInsertRootAt(component: Component, at: number): void {
    this.$mounted && this.mountChild(component)
  }

  public memInsertRootAt(component: Component, at: number): void {
    if (this.$mountRoot.indexOf(component) > -1) {
      throw new Error('root is already mounted')
    }
    insert(this.$mountRoot, component, at)
  }

  public domInsertRootAt(component: Component, at: number): void {
    set(component, '$slotParent', this)

    this.$slotParentChildren['default'][at] = component

    if (!this.$primitive) {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          let i = 0

          if (this.$slotParent) {
            this.$slotParent.domInsertParentChildAt(
              component,
              'default',
              at + i
            )
          } else {
            this.domCommitInsertChild(root, at)
          }

          i++
        }
      } else {
        if (this.$slotParent) {
          const index: number =
            this.$slotParent.$slotParentChildren['default'].indexOf(this)

          this.$slotParent.domInsertParentChildAt(component, 'default', index)
        } else {
          this.domCommitInsertChild(component, at)
        }
      }
    } else {
      if (!component.$primitive) {
        let i = 0

        for (const root of component.$mountRoot) {
          this.domInsertRootAt(root, at + i)

          i++
        }
      } else {
        this.domCommitInsertChild(component, at)
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
    const index = this.$root.indexOf(component)
    const at = this.$mountRoot.indexOf(component)

    this.domRemoveRoot(component, index, at)
    this.memRemoveRoot(component)
    this.postRemoveRoot(component)
  }

  public memRemoveRoot(component: Component): void {
    pull(this.$mountRoot, component)
  }

  public domRemoveRoot(component: Component, index: number, at: number): void {
    if (!this.$primitive) {
      if (!component.$primitive) {
        for (let i = 0; i < component.$mountRoot.length; i++) {
          if (this.$slotParent) {
            this.$slotParent.domRemoveParentChildAt(
              component.$mountRoot[i],
              'default',
              at,
              at,
              this.$slotParent
            )
          } else {
            this.domRemoveRoot(component.$mountRoot[i], index, at)
          }
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domRemoveParentChildAt(
            component,
            'default',
            at,
            index,
            this.$slotParent
          )
        } else {
          this.domCommitRemoveChild(component, at)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domRemoveRoot(root, index, at)
        }
      } else {
        this.domCommitRemoveChild(component, at)
      }
    }

    set(component, '$slotParent', null)
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

      deep && component.uncollapse(deep, this.$slotParent)
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

    component.$rootParent = slot
  }

  public placeParentRoot(
    component: Component,
    at: number,
    slotName: string
  ): void {
    insert(this.$parentRoot, component, at)
    insert(this.$parentRootSlotName, slotName, at)

    const slot = get(this.$slot, slotName)

    slot.memInsertParentChild(component, at, slotName)

    component.$rootParent = slot
  }

  public unshiftParentRoot(component: Component, slotName: string): void {
    unshift(this.$parentRoot, component)
    unshift(this.$parentRootSlotName, slotName)

    component.$rootParent = null
  }

  public pullParentRoot(component: Component): void {
    // console.log(this.constructor.name, 'pullParentRoot')

    const i = this.$parentRoot.indexOf(component)

    if (i > -1) {
      const slotName = this.$parentRootSlotName[i]

      removeAt(this.$parentRoot, i)
      removeAt(this.$parentRootSlotName, i)

      const slot = get(this.$slot, slotName)

      slot.memPullParentChild(component)
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
    this.removeParentRoot(component, this.$slotParent)
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

  public uncollapse(deep: boolean = true, slotParent?: Component): void {
    for (const component of this.$parentRoot) {
      this.removeParentRoot(component, slotParent)

      deep && component.uncollapse(deep, slotParent ?? this.$slotParent)
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

  public memInsertParentChild(
    component: Component,
    at: number,
    slotName: string
  ): void {
    insert(this.$parentChildren, component, at)
    insert(this.$parentChildrenSlot, slotName, at)
  }

  public memPullParentChild(component: Component): void {
    const at = this.$parentChildren.indexOf(component)

    removeAt(this.$parentChildren, at)
    removeAt(this.$parentChildrenSlot, at)
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
    index: number
  ): void {
    set(component, '$slotParent', this)

    this.$slotParentChildren['default'] =
      this.$slotParentChildren['default'] ?? []
    this.$slotParentChildren['default'][at] = component

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
          const index =
            this.$slotParent.$slotParentChildren['default'].indexOf(this)

          this.$slotParent.domAppendParentChildAt(
            component,
            'default',
            index,
            index
          )
        } else {
          this.domCommitAppendChild(component, index)
        }
      }
    } else {
      if (!component.$primitive) {
        let j = 0

        for (const root of component.$mountRoot) {
          this.domAppendParentChildAt(root, slotName, at + j, at + j)

          j++
        }
      } else {
        this.domCommitAppendChild(component, index)
      }
    }
  }

  public postAppendParentChild(
    component: Component,
    slotName: string,
    at: number
  ): void {
    this.postInsertParentChildAt(component, slotName, at)
  }

  public postInsertParentChild(
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
    at: number
  ): void {
    set(component, '$slotParent', this)

    this.$slotParentChildren[slotName] =
      this.$slotParentChildren[slotName] ?? []
    this.$slotParentChildren[slotName][at] = component

    if (!this.$primitive) {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          if (this.$slotParent) {
            const index = this.$parent?.$root.includes(this)
              ? this.$parent?.$root.indexOf(this)
              : 0

            this.$slotParent.domInsertParentChildAt(
              component,
              'default',
              index + at
            )
          } else {
            this.domCommitInsertChild(root, at)
          }
        }
      } else {
        if (this.$slotParent) {
          const index =
            this.$slotParent.$slotParentChildren[slotName].indexOf(this)

          this.$slotParent.domInsertParentChildAt(
            component,
            'default',
            index + at
          )
        } else {
          this.domCommitInsertChild(component, at)
        }
      }
    } else {
      if (!component.$primitive) {
        let j = 0

        for (const root of component.$mountRoot) {
          this.domInsertParentChildAt(root, 'default', at + j)

          j++
        }
      } else {
        this.domCommitInsertChild(component, at)
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

      this.domRemoveParentChildAt(
        component,
        slotName,
        at,
        _at,
        this.$slotParent
      )
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
    index: number,
    slotParent?: Component
  ): void {
    if (!this.$primitive) {
      if (!component.$primitive) {
        for (let i = 0; i < component.$mountRoot.length; i++) {
          if (this.$slotParent) {
            this.$slotParent.domRemoveParentChildAt(
              component.$mountRoot[i],
              slotName,
              at,
              index,
              slotParent
            )
          } else {
            this.domRemoveParentChildAt(
              component.$mountRoot[i],
              slotName,
              at,
              index,
              slotParent
            )
          }
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domRemoveParentChildAt(
            component,
            'default',
            at,
            index,
            slotParent
          )
        } else if (slotParent) {
          slotParent.domCommitRemoveChild(component, at)
        } else {
          this.domCommitRemoveChild(component, at)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domRemoveParentChildAt(root, slotName, at, at, slotParent)

          if (!root.$primitive) {
            let i = 1
            for (const parentRoot of root.$mountParentChildren) {
              this.domRemoveParentChildAt(
                parentRoot,
                slotName,
                at,
                index,
                slotParent
              )
            }
          }
        }
      } else {
        this.domCommitRemoveChild(component, at)
      }
    }

    set(component, '$slotParent', null)
  }

  protected domCommitRemoveChild(component: Component, at: number) {
    if (component.$detached) {
      return
    }

    if (component.isParent()) {
      for (const root of component.$root) {
        this.domCommitRemoveChild(root, at)
      }

      return
    }

    if (this.isParent()) {
      if (this.$slotParent) {
        this.$slotParent.domCommitRemoveChild(component, at)
      } else {
        this._removeChild(component, at)
      }
    } else {
      this._removeChild(component, at)
    }
  }

  protected _removeChild(child: Component, at: number) {
    remove(this.$domChildren, child)

    child.$domParent = null

    if (this.$element.contains(child.$element)) {
      const target = this._unwrapElement(this.$element, child.$element, at)

      removeChild(this.$element, target)
    }
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

  public removeParentRoot(component: Component, slotParent?: Component): void {
    const at = this.$parentRoot.indexOf(component)
    const _at = this.$mountParentRoot.indexOf(component)
    const slotName = this.$parentRootSlotName[at]
    this.postRemoveParentRootAt(component, slotName, at, _at)
    this.domRemoveParentRootAt(
      component,
      slotName,
      at,
      _at,
      slotParent ?? this.$slotParent
    )
    this.memRemoveParentRootAt(component, slotName, at, _at)
  }

  public memRemoveParentRoot(
    component: Component,
    slotParent?: Component
  ): void {
    const at = this.$parentRoot.indexOf(component)
    const at_ = this.$mountParentRoot.indexOf(component)
    const slotName = this.$parentRootSlotName[at]

    this.memRemoveParentRootAt(component, slotName, at, at_)
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
    _at: number,
    slotParent?: Component
  ): void {
    // console.log(this.constructor.name, 'domRemoveParentRootAt', component.constructor.name, slotName, at, _at)
    const slot = this.$slot[slotName]
    slot.domRemoveParentChildAt(component, 'default', at, _at, slotParent)
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

  public setControlled(controlled: boolean): void {
    this.$controlled = controlled
  }

  public setSystem(system: System): void {
    this.$system = system

    for (const subComponentId in this.$subComponent) {
      const subComponent = this.$subComponent[subComponentId]

      subComponent.setSystem(system)
    }
  }

  public setDetached(detached: boolean): void {
    this.$detached = detached

    for (const subComponentId in this.$subComponent) {
      const subComponent = this.$subComponent[subComponentId]

      subComponent.setDetached(detached)
    }
  }

  public setSubComponent(id: string, component: Component): void {
    set(component, '$parent', this)

    this.$subComponent[id] = component
  }

  public setSubComponents(component_map: Dict<Component>): void {
    forEachObjKV(component_map, this.setSubComponent.bind(this))
  }

  public decoupleSubComponent(id: string): void {
    const subComponent = this.getSubComponent(id)
    const parent = this.getSubComponentParent(id)

    if (parent) {
      parent.removeParentRoot(subComponent)
    } else {
      this.removeRoot(subComponent)
    }
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

  public getSubComponentParent(id: string): Component | null {
    const subComponentParentId = this.getSubComponentParentId(id)

    if (subComponentParentId) {
      return this.getSubComponent(subComponentParentId)
    }

    return null
  }

  public getSlotSubComponentId(slotName: string): string | null {
    const subComponentId = this.$slotId[slotName]

    return subComponentId
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

  public getPath(): string[] {
    let path: string[] = []
    let c: Component = this
    let p = this.$parent

    while (p) {
      const subComponentId = p.getSubComponentId(c)

      path.unshift(subComponentId)

      c = p

      p = p.$parent
    }

    return path
  }

  public addEventListener = (listener: Listener): Unlisten => {
    const roots = this.getBaseRoots()

    const allUnlisten = []

    for (const root of roots) {
      const unlisten = listener(root)

      allUnlisten.push(unlisten)
    }

    return callAll(allUnlisten)
  }

  public addEventListeners = (listeners: Listener[]): Unlisten => {
    const roots = this.getBaseRoots()

    const allUnlisten = []

    for (const root of roots) {
      const unlisten = addListeners(root, listeners)

      allUnlisten.push(unlisten)
    }

    return callAll(allUnlisten)
  }

  private _call(method: string, data: any[] = []): void {
    if (this[method]) {
      this[method](...data)
    } else {
      throw 'invalid method'
    }
  }

  public reset() {
    //
  }

  public play() {
    const animations = this.getAnimations()

    for (const animation of animations) {
      animation.play()
    }
  }

  public pause() {
    const animations = this.getAnimations()

    for (const animation of animations) {
      animation.pause()
    }
  }

  public destroy() {
    // console.log(this.constructor.name, 'destroy')

    this.onDestroy()
  }
}
