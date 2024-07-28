import { NOOP } from '../NOOP'
import { $Child } from '../component/Child'
import { $Children } from '../component/Children'
import { Moment } from '../debug/Moment'
import { UnitMoment } from '../debug/UnitMoment'
import { proxyWrap } from '../proxyWrap'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { Unlisten } from '../types/Unlisten'
import { $Component } from '../types/interface/async/$Component'
import { $Graph } from '../types/interface/async/$Graph'
import { insert, pull, push, remove, removeAt, unshift } from '../util/array'
import { callAll } from '../util/call/callAll'
import { _if } from '../util/control'
import { appendChild, insertAt, removeChild } from '../util/element'
import { forEachObjKV, get, set } from '../util/object'
import { weakMerge } from '../weakMerge'
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  DEFAULT_TEXT_ALIGN,
} from './DEFAULT_FONT_SIZE'
import { IOElement } from './IOElement'
import { Listener } from './Listener'
import { getActiveElement } from './activeElement'
import { addListeners } from './addListener'
import { animateSimulate } from './animation/animateSimulate'
import { RGBA, colorToHex, hexToRgba } from './color'
import { ANIMATION_PROPERTY_DELTA_PAIRS } from './component/app/graph/ANIMATION_PROPERTY_DELTA_PAIRS'
import { namespaceURI } from './component/namespaceURI'
import { componentFromSpecId } from './componentFromSpecId'
import { getComponentInterface } from './component_'
import { Context, dispatchContextEvent, dispatchCustomEvent } from './context'
import { makeCustomListener } from './event/custom'
import { readDataTransferItemAsText } from './event/drag'
import { extractTrait } from './extractTrait'
import { LayoutBase, LayoutLeaf } from './layout'
import {
  IOUIEventName,
  UI_EVENT_SET,
  makeUIEventListener,
} from './makeEventListener'
import { mount } from './mount'
import { rawExtractStyle } from './rawExtractStyle'
import { getBaseStyle } from './reflectComponentBaseTrait'
import { stopImmediatePropagation, stopPropagation } from './stopPropagation'
import { applyStyle } from './style'
import { unmount } from './unmount'
import { addVector } from './util/geometry'
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

const $childToComponent = (
  system: System,

  { bundle }: $Child
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

  public $localId: string
  public $remoteId: string

  public $ref: Dict<Component<any>> = {}

  public $context: Context

  public $connected: boolean = false
  public $unit: U

  public $primitive: boolean = true

  public $propUnlisten: Dict<Unlisten> = {}

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
  public $detachedContext: Context | null = null
  public $detachedSlotParent: Component | null = null

  public $returnIndex: number = 0

  public $mounted: boolean = false

  public $listenCount: Dict<number> = {}

  private _stopPropagationSet: Set<string>
  private _stopImmediatePropagationSet: Set<string>
  private _preventDefaultCounter: Dict<number> = {}

  constructor($props: P, $system: System, $element?: E, $node?: E) {
    this.$props = $props
    this.$system = $system
    this.$element = $element
    this._$node = $node ?? $element

    this.register()
  }

  get $node() {
    return this._$node ?? this.$element
  }

  set $node($node: E) {
    this._$node = $node
  }

  getProp(name: string): any {
    return this.$props[name]
  }

  setProp<K extends keyof P>(prop: K, data: P[K]) {
    this.$props[prop] = data

    if (this.$mounted) {
      this._onPropChanged(prop, data)
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

  onPropChanged<K extends keyof P>(prop: K, current: any) {}

  _onPropChanged<K extends keyof P>(prop: K, current: any) {
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

  onDestroy() {
    for (const child of this.$children) {
      child.destroy()
    }
  }

  dispatchEvent(type: string, detail: any = {}, bubbles: boolean = true) {
    for (const root of this.getBaseRoots()) {
      dispatchCustomEvent(root.$element, type, detail, bubbles)
    }
  }

  dispatchContextEvent(type: string, data: any = {}) {
    if (this.$context) {
      dispatchContextEvent(this.$context, type, data)
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
      this.dettachText(type)
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

  dettachText(type: string): void {
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
    const leaf = this.getFirstRootLeaf()

    if (leaf && leaf.$element instanceof HTMLElement) {
      leaf.$element.scroll(opt)
    }
  }

  scrollIntoView(opt: ScrollIntoViewOptions): void {
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
    const firstLeaf = this.getFirstRootLeaf()

    if (firstLeaf.$element instanceof HTMLElement) {
      if (firstLeaf.$element.showPopover) {
        firstLeaf.$element.showPopover()
      }
    } else {
      //
    }
  }

  private $detached: boolean = false

  private _baseAnimationAbort: Unlisten

  private _animateBase = (
    base: LayoutBase,
    hostSlot: Component<any>,
    reverse: boolean = false,
    prepend: boolean = false,
    commit: Callback
  ): Unlisten => {
    const {
      foreground: { html },
      api: {
        text: { measureText },
        document: { createElement },
        layout: { reflectChildrenTrait },
      },
    } = this.$system

    const allAbort = []

    let hostTarget = hostSlot

    while (
      hostTarget.isParent() ||
      (hostTarget.$element as HTMLElement).style?.display === 'contents'
    ) {
      hostTarget = hostTarget.$slotParent
    }

    const hostTrait = extractTrait(hostTarget, measureText)
    const hostStyle = rawExtractStyle(
      hostTarget.$element,
      hostTrait,
      measureText
    )

    delete hostStyle['transform']
    delete hostStyle['opacity']

    const baseStyle = getBaseStyle(base, [], (leafPath, leafComp) => {
      return rawExtractStyle(leafComp.$element, hostTrait, measureText)
    })

    const targetTraits = reflectChildrenTrait(
      hostTrait,
      hostStyle,
      baseStyle,
      [],
      () => {
        return []
      }
    )

    let leafFinished = 0
    let leafFrames: HTMLDivElement[] = []

    for (let i = 0; i < base.length; i++) {
      const targetTrait = targetTraits[i]

      const leaf = base[i]

      const [_, leafComp] = leaf

      const leafTrait = extractTrait(leafComp, measureText)

      const leafFrame = createElement('div')

      applyStyle(leafFrame, {
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
        hostTarget.$element.prepend(leafFrame)
      } else {
        hostTarget.$element.appendChild(leafFrame)
      }

      !reverse && this.domRemoveLeaf(leaf)

      leafComp.unmount()

      leafFrame.appendChild(leafComp.$element)

      leafComp.$slotParent = hostTarget

      leafComp.mount(hostTarget.$context)

      leafFrames.push(leafFrame)

      const { x: scrollX0, y: scrollY0 } = getScrollPosition(
        hostTarget.$element,
        hostTarget.$context.$element
      )

      const abortAnimation = animateSimulate(
        this.$system,
        leafTrait,
        () => {
          return targetTrait
        },
        ANIMATION_PROPERTY_DELTA_PAIRS,
        ({ x, y, width, height, sx, sy, opacity, fontSize }) => {
          const { x: scrollX, y: scrollY } = getScrollPosition(
            hostTarget.$element,
            hostTarget.$context.$element
          )

          const scrollDx = scrollX - scrollX0
          const scrollDy = scrollY - scrollY0

          leafFrame.style.left = `${
            x -
            (reverse ? this.$context.$x : hostTrait.x) +
            ((Math.abs(sx) - 1) * width) / 2 -
            scrollDx
          }px`
          leafFrame.style.top = `${
            y -
            (reverse ? this.$context.$y : hostTrait.y) +
            ((Math.abs(sy) - 1) * height) / 2 -
            scrollDy
          }px`
          leafFrame.style.width = `${width}px`
          leafFrame.style.height = `${height}px`
          leafFrame.style.transform = `scale(${sx}, ${sy})`
          // leafFrame.style.opacity = `${opacity}`
          leafFrame.style.opacity = `1`
          leafFrame.style.fontSize = `${fontSize}px`
        },
        () => {
          leafFinished++

          if (leafFinished === base.length) {
            for (const leafFrame of leafFrames) {
              leafFrame.removeChild(leafComp.$element)

              hostTarget.$element.removeChild(leafFrame)
            }

            commit()
          }
        }
      )

      allAbort.push(abortAnimation)
    }

    return callAll(allAbort)
  }

  register() {
    const { registerLocalComponent } = this.$system

    if (this.$localId) {
      return
    }

    if (!this.$remoteId) {
      return
    }

    this.$localId = registerLocalComponent(this, this.$remoteId)

    this._forAllDescendent((child) => {
      child.register()
    })
  }

  unregister() {
    const { unregisterLocalComponent } = this.$system

    if (!this.$localId) {
      return
    }

    unregisterLocalComponent(this.$remoteId, this.$localId)

    this.$localId = undefined
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

    const hostComponent = hosts[0] // TODO heuristic: get closest on the tree

    let hostSlot = hostComponent.getSlot('default')

    const base = this.getRootBase()

    const commit = () => {
      for (const [_, leaf] of base) {
        hostSlot.domAppendChild(leaf)
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
    this.$detachedContext = this.$context

    let index = 0
    if (this.$rootParent) {
      index = this.$rootParent.$parentRoot.indexOf(this)
    } else if (this.$parent) {
      index = this.$parent.$parentRoot.indexOf(this)
    } else {
      index = this.$context.$children.indexOf(this)
    }

    this.$returnIndex = index

    if (animate) {
      this._baseAnimationAbort = this._animateBase(
        base,
        hostSlot,
        false,
        prepend,
        commit
      )
    } else {
      this.domRemoveBase(base)

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

    const base = this.getRootBase()

    let leafEnd = 0

    const couple = (leafComp: Component) => {
      leafComp.unmount()

      if (leafComp.$rootParent) {
        leafComp.$rootParent.domInsertParentRootAt(
          leafComp,
          this.$returnIndex,
          'default'
        )
      } else if (leafComp.$parent) {
        leafComp.$parent.domInsertRootAt(leafComp, this.$returnIndex)
      } else {
        //
      }

      leafComp.mount(this.$parent.$context)
    }

    if (animate) {
      const targetSlots = []

      this.templateBase(
        base,
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

      for (let i = 0; i < base.length; i++) {
        const leaf = base[i]

        const [_, leafComp] = leaf

        const targetSlot = this.$detachedSlotParent

        this._baseAnimationAbort = this._animateBase(
          [leaf],
          targetSlot,
          true,
          false,
          () => {
            leafEnd++

            couple(leafComp)
          }
        )
      }
    } else {
      for (let i = 0; i < base.length; i++) {
        const leaf = base[i]

        const [_, leafComp] = leaf

        couple(leafComp)
      }
    }
  }

  public templateBase = (
    base: LayoutBase,
    root: (parent: Component, leafComp: Component) => void,
    parentRoot: (parent: Component, leafComp: Component) => void,
    self: (leafComp: Component) => void
  ): void => {
    // console.log('Component', 'templateBase', sub_component_id)

    for (const leaf of base) {
      this.templateLeaf(leaf, root, parentRoot, self)
    }
  }

  public templateLeaf = (
    leaf: LayoutLeaf,
    root: (parent: Component, leaf_comp: Component) => void,
    parentRoot: (parent: Component, leaf_comp: Component) => void,
    self: (leafComp: Component) => void
  ): void => {
    // console.log('Component', 'templateLeaf', sub_component_id)

    const [leafPath, leafComp] = leaf

    const leafParentLast = leafPath[leafPath.length - 1]
    const leafParentPath = leafPath.slice(0, -1)

    const leafParent = this.pathGetSubComponent(leafParentPath)

    if (leafParent === leafComp) {
      self(leafComp)
    } else {
      const parent_id = leafParent.getSubComponentParentId(leafParentLast)
      if (parent_id) {
        const parent = leafParent.getSubComponent(parent_id)

        parentRoot(parent, leafComp)
      } else {
        root(leafParent, leafComp)
      }
    }
  }

  public domRemoveBase = (base: LayoutBase): void => {
    this.templateBase(
      base,
      (parent, leafComp) => {
        const index = parent.$root.indexOf(leafComp)

        parent.domRemoveRoot(leafComp, index)
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

  public domRemoveLeaf = (leaf: LayoutLeaf): void => {
    this.templateLeaf(
      leaf,
      (parent, leaf_comp) => {
        const index = parent.$root.indexOf(leaf_comp)

        parent.domRemoveRoot(leaf_comp, index)
      },
      (parent, leaf_comp) => {
        const index = parent.$parentRoot.indexOf(leaf_comp)

        parent.domRemoveParentRootAt(
          leaf_comp,
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

  public domAppendBase = (
    base: LayoutBase,
    fallbackParent: Component
  ): void => {
    // console.log('Component', 'domAppendBase', sub_component_id)

    this.templateBase(
      base,
      (parent, leafComp) => {
        parent.domAppendRoot(leafComp)
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
      if (child.$detached) {
        return
      }

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
      if (child.$detached) {
        return
      }

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

  animate(
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ): Animation[] {
    const base = this.getAnimatableBase()

    const animations = []

    for (const leaf of base) {
      const animation = leaf.$element.animate(keyframes, options)

      animations.push(animation)
    }

    return animations
  }

  getAnimatableBase(): Component<HTMLElement | SVGElement>[] {
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

  getColor(): RGBA {
    const defaultColor = () => {
      if (this.$slotParent) {
        return this.$slotParent.getColor()
      } else {
        if (this.$mounted) {
          return hexToRgba(this.$context.$color)
        } else {
          return hexToRgba(this.$system.color)
        }
      }
    }

    if (this.$primitive) {
      if (
        this.$element instanceof HTMLElement ||
        this.$element instanceof SVGElement
      ) {
        const styleColor = this.$element.style.color

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
      return subComponent.pathGetSubComponent(tail)
    }
  }

  getRect(): Rect {
    return getRect(this.$node)
  }

  getBoundingClientRect(): Rect {
    if (this.$context) {
      if (!this.$primitive) {
        throw new Error('cannot calculate position of multiple elements.')
      }

      if (this.$node instanceof Text) {
        // TODO
        return { x: 0, y: 0, width: 0, height: 0 }
      }

      const { $x, $y, $sx, $sy } = this.$context

      const bcr: Rect = this.$node.getBoundingClientRect()

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

  public appendChildren(children: Component[], slotName: string): void {
    this.memAppendChildren(children, slotName)
    this.domAppendChildren(children, slotName)
    this.postAppendChildren(children, slotName)
  }

  public memAppendChildren(children: Component[], slotName: string): void {
    for (const child of children) {
      this.memAppendChild(child, slotName, this.$children.length)
    }
  }

  public postAppendChildren(children: Component[], slotName: string): void {
    for (const child of children) {
      this.postAppendChild(child, slotName, this.$children.length)
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
    slotName: string = 'default',
    at?: number,
    slot?: Component
  ): void {
    // console.log('Component', '_domAppendChild')

    slot = slot ?? this.getLeafSlot(slotName)

    at = at ?? this.$children.length

    slot.domAppendParentChildAt(child, slotName, at, at)
  }

  public domAppendChild(
    child: Component,
    slotName: string = 'default',
    at?: number
  ): void {
    // console.log('Component', '_domAppendChild')

    const slot = this.getLeafSlot(slotName)

    this._domAppendChild(child, slotName, at)

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

          const _ = getComponentInterface(childSubComponent)

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

    this.$unit = proxyWrap($unit, ['U', 'C', 'G', 'EE'])

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
        } else if (event_event === 'append_children') {
          const bundles = event_data

          const children = bundles.map((bundle: UnitBundleSpec, i: number) =>
            this._$instanceChild({ bundle }, this.$children.length + i)
          )

          const slot_name = 'default'

          this.appendChildren(children, slot_name)
        } else if (event_event === 'remove_child') {
          const at = event_data

          const child = this.$children[at]

          this.removeChildAt(at)

          child.destroy()
        } else if (event_event === 'register') {
          this.register()
        } else if (event_event === 'unregister') {
          this.unregister()
        } else if (event_event === 'play') {
          this.play()
        } else {
          this.pause()
        }
      },
    }

    const unit_listener = (moment: Moment): void => {
      const { type } = moment

      handler[type] && handler[type](moment)
    }

    this.$named_listener_count = {}

    $unit.$getGlobalId({}, (remoteId: string) => {
      this.$remoteId = remoteId

      this.register()
    })

    $unit.$getAnimations({}, (animations) => {
      for (const animation of animations) {
        const { keyframes, opt } = animation

        this.animate(keyframes, opt)
      }
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
        if (UI_EVENT_SET.has(event as IOUIEventName) || event.startsWith('_')) {
          listen(event as IOUIEventName)
        }
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

    const _ = getComponentInterface(component)

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
          const i = this.$slotParent.$mountParentChildren.length - 1

          this.$slotParent.domAppendParentChildAt(component, 'default', i, i)
        } else {
          this.domCommitAppendChild(component, this.$mountRoot.length - 1)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domAppendRoot(root)
        }
      } else {
        this.domCommitAppendChild(component, this.$mountRoot.length - 1)
      }
    }
  }

  public isParent = (): boolean => {
    return (this.$element as HTMLElement).classList?.contains('__parent')
  }

  protected domCommitAppendChild(component: Component, at: number) {
    this._domCommitChild__template(component, at, appendChild)
  }

  protected domCommitInsertChild(component: Component, at: number) {
    this._domCommitChild__template(component, at, insertAt)
  }

  protected _domCommitChild__template = (
    component: Component,
    at: number,
    callback: (parent: Node, child: Node, at: number) => void
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
        const index = this.$slotParent.$mountParentChildren.indexOf(this)

        this.$slotParent._domCommitChild__template(
          component,
          index + at,
          callback
        )
      } else {
        callback(this.$element, component.$element, at)
      }
    } else {
      callback(this.$element, component.$element, at)
    }
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
          let i = 0

          if (this.$slotParent) {
            const index = this.$parent?.$root.includes(this)
              ? this.$parent?.$root.indexOf(this)
              : this.$slotParent.$mountParentChildren.indexOf(this)

            this.$slotParent.domInsertParentChildAt(
              component,
              'default',
              index + _at + i
            )
          } else {
            this.domCommitInsertChild(root, _at)
          }

          i++
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
        let i = 0

        for (const root of component.$mountRoot) {
          this.domInsertRootAt(root, _at + i)

          i++
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
    set(component, '$slotParent', null)

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
            this.domRemoveRoot(component.$mountRoot[i], at)
          }

          appendChild(component.$element, component.$mountRoot[i].$element)
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domRemoveParentChildAt(
            component,
            'default',
            at,
            at,
            this.$slotParent
          )
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

    component.$rootParent = this
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
          this.domCommitAppendChild(component, at)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domAppendParentChildAt(root, slotName, at, at)

          if (!root.$primitive) {
            let i = 0

            for (const parentRoot of root.$mountParentChildren) {
              this.domAppendParentChildAt(parentRoot, slotName, at, at)

              i++
            }
          }
        }
      } else {
        this.domCommitAppendChild(component, at)
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

    component.$rootParent = this
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
              : 0

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
        let j = 0

        for (const root of component.$root) {
          this.domInsertParentChildAt(root, 'default', i + j)

          j++
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
    _at: number,
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
              at,
              slotParent
            )
          } else {
            this.domRemoveParentChildAt(
              component.$mountRoot[i],
              slotName,
              at,
              at,
              slotParent
            )
          }

          appendChild(component.$element, component.$mountRoot[i].$element)
        }
      } else {
        if (this.$slotParent) {
          this.$slotParent.domRemoveParentChildAt(
            component,
            'default',
            at,
            at,
            slotParent
          )
        } else if (slotParent) {
          slotParent.domCommitRemoveChild(component)
        } else {
          this.domCommitRemoveChild(component)
        }
      }
    } else {
      if (!component.$primitive) {
        for (const root of component.$mountRoot) {
          this.domRemoveParentChildAt(root, slotName, at, at, slotParent)

          appendChild(component.$element, root.$element)

          if (!root.$primitive) {
            let i = 1
            for (const parentRoot of root.$mountParentChildren) {
              this.domRemoveParentChildAt(
                parentRoot,
                slotName,
                at,
                at,
                slotParent
              )
            }
          }
        }
      } else {
        this.domCommitRemoveChild(component)
      }
    }

    set(component, '$slotParent', null)
  }

  protected domCommitRemoveChild(component: Component) {
    if (component.isParent()) {
      for (const root of component.$root) {
        this.domCommitRemoveChild(root)
      }

      return
    }

    if (this.isParent()) {
      if (this.$slotParent) {
        this.$slotParent.domCommitRemoveChild(component)
      } else {
        if (this.$element.contains(component.$element)) {
          removeChild(this.$element, component.$element)
        }
      }
    } else {
      if (this.$element.contains(component.$element)) {
        removeChild(this.$element, component.$element)
      }
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

  public memRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    pull(this.$mountParentRoot, component)

    const slot = this.$slot[slotName]

    slot.memRemoveParentChildAt(component, 'default', at, _at)

    slot.$rootParent = null
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
      throw 'method not implemented'
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
