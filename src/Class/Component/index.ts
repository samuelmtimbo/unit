import { isComponentEvent } from '../../client/isComponentEvent'
import {
  animate,
  appendChild,
  appendChildren,
  appendParentChild,
  attachDropTarget,
  attachText,
  cancelAnimation,
  hasChild,
  insertChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  refRoot,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  reorderParentRoot,
  reorderRoot,
  stopPropagation,
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { MethodNotImplementedError } from '../../exception/MethodNotImplementedError'
import { Primitive, PrimitiveEvents } from '../../Primitive'
import { fromUnitBundle } from '../../spec/fromUnitBundle'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { AnimationSpec, C, C_EE, ComponentSetup } from '../../types/interface/C'
import { Component_, ComponentEvents } from '../../types/interface/Component'
import { UnitBundle } from '../../types/UnitBundle'
import { Unlisten } from '../../types/Unlisten'
import { forEach } from '../../util/array'
import { clone } from '../../util/clone'
import { ION, Opt } from '../Unit'

export type Component_EE = C_EE

export type ComponentEE<_EE extends Dict<any[]>> = PrimitiveEvents<
  _EE & Component_EE
> &
  Component_EE

export class Component__<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    EE extends ComponentEE<EE> = ComponentEE<Component_EE>,
  >
  extends Primitive<I, O, EE>
  implements C
{
  __ = ['U', 'C', 'EE']

  public _children: Component_[] = []
  public _root: Component_[] = []
  public _parent_root: Component_[] = []
  public _parent_children: Component_[] = []
  public _slot: Dict<Component_> = {}
  public _animations: AnimationSpec[] = []
  public _stopPropagation: Dict<number> = {}
  public _stopImmediatePropagation: Dict<number> = {}
  public _preventDefault: Dict<number> = {}
  public _attachDropTarget: [][] = []
  public _attachText: [string, string][] = []

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      id
    )

    this.addListener('reset', this._component_reset)
    this.addListener('play', this._component_play)
    this.addListener('pause', this._component_pause)

    this._slot = {
      default: this,
    }
  }

  isElement(): boolean {
    return true
  }

  registerRoot(component: Component_, emit: boolean = true): void {
    return registerRoot(this, this._root, component, emit)
  }

  unregisterRoot(component: Component_, emit: boolean = true): void {
    return unregisterRoot(this, this._root, component, emit)
  }

  reorderRoot(
    component: Component_<ComponentEvents>,
    to: number,
    emit: boolean = true
  ): void {
    return reorderRoot(this, this._root, component, to, emit)
  }

  registerParentRoot(
    component: Component_,
    slotName: string,
    at?: number,
    emit: boolean = true
  ): void {
    return registerParentRoot(
      this,
      this._parent_root,
      component,
      slotName,
      at,
      emit
    )
  }

  unregisterParentRoot(component: Component_, emit: boolean): void {
    return unregisterParentRoot(this, this._parent_root, component, emit)
  }

  reorderParentRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderParentRoot(this, this._parent_root, component, to, true)
  }

  appendParentChild(component: Component_, slotName: string): void {
    return appendParentChild(
      this,
      this._parent_children,
      component,
      slotName,
      true
    )
  }

  removeParentChild(component: Component_): void {
    return removeParentChild(this, this._parent_children, component, true)
  }

  appendChild(bundle: UnitBundle, emit: boolean = true): number {
    return appendChild(this, this._children, bundle, emit)
  }

  appendChildren(bundles: UnitBundle[]): number {
    return appendChildren(this, this._children, bundles)
  }

  insertChild(Bundle: UnitBundle, at: number): void {
    return insertChild(this, this._children, Bundle, at)
  }

  pushChild(Bundle: UnitBundle): number {
    return pushChild(this, this._children, Bundle)[0]
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number, emit: boolean = true): Component_ {
    return removeChild(this, this._children, at)
  }

  pullChild(at: number): Component_ {
    throw pullChild(this, this._children, at)
  }

  refRoot(at: number): Component_ {
    return refRoot(this, this._children, at)
  }

  refChild(at: number): Component_ {
    return refChild(this, this._children, at)
  }

  refChildren(): Component_[] {
    return refChildren(this, this._children)
  }

  refSlot(slotName: string): Component_ {
    const slot = this._slot[slotName]

    if (slot) {
      return slot
    }

    throw new MethodNotImplementedError()
  }

  getAnimations(): AnimationSpec[] {
    return this._animations
  }

  animate(keyframes: Keyframe[], opt: KeyframeAnimationOptions): void {
    return animate(this, this._animations, keyframes, opt)
  }

  cancelAnimation(id: string): void {
    return cancelAnimation(this, this._animations, id)
  }

  stopPropagation(name: string): Unlisten {
    return stopPropagation(this, this._stopPropagation, name)
  }

  attachText(type: string, text: string): Unlisten {
    return attachText(this, this._attachText, type, text)
  }

  attachDropTarget(): Unlisten {
    return attachDropTarget(this, this._attachDropTarget)
  }

  getSetup(): ComponentSetup {
    const setup: ComponentSetup = {
      animations: this._animations,
      events: this.eventNames().filter(isComponentEvent),
      stopPropagation: Object.keys(this._stopPropagation),
      stopImmediatePropagation: Object.keys(this._stopImmediatePropagation),
      preventDefault: Object.keys(this._preventDefault),
      attachText: this._attachText,
      attachDropTarget: this._attachDropTarget,
    }

    return setup
  }

  private _component_reset(): void {
    forEach(this._children, (u) => u.reset())

    // this.emit('call', { method: 'reset', data: [] })
  }

  private _component_play(): void {
    forEach(this._children, (u) => u.play())
  }

  private _component_pause(): void {
    forEach(this._children, (u) => u.pause())
  }

  snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      _children: this._children.map((child) =>
        clone(child.getUnitBundleSpec({ deep: true }))
      ),
      _animations: clone(this._animations),
      _stopPropagation: clone(this._stopPropagation),
      _stopImmediatePropagation: clone(this._stopImmediatePropagation),
      _preventDefault: clone(this._preventDefault),
    }
  }

  restoreSelf(state: Dict<any>): void {
    const {
      _children = [],
      _animations = [],
      _stopPropagation = [],
      _stopImmediatePropagation = {},
      _preventDefault = {},
      ...rest
    } = state

    super.restoreSelf(rest)

    while (this._children.length) {
      this.removeChild(0, false)
    }

    for (const child of _children) {
      const Bundle = fromUnitBundle(
        child,
        this.__system.specs,
        this.__system.classes
      )

      this.appendChild(Bundle, false)
    }

    this._animations = _animations
    this._stopPropagation = _stopPropagation
    this._stopImmediatePropagation = _stopImmediatePropagation
    this._preventDefault = _preventDefault
  }
}
