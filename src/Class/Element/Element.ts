import {
  appendChild,
  appendParentChild,
  hasChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  unregisterParentRoot,
  unregisterRoot
} from '../../component/method'
import { C } from '../../interface/C'
import { E } from '../../interface/E'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { UnitClass } from '../../types/UnitClass'
import { forEach } from '../../util/array'
import { Stateful } from '../Stateful'
import { ION, Opt } from '../Unit'

export class Element<I = any, O = any> extends Stateful<I, O> implements E {
  __ = ['U', 'C', 'V']

  public element = true

  public _children: E[] = []
  public _root: C[] = []
  public _parent_root: C[] = []
  public _parent_children: C[] = []


  public _slot: Dict<C> = {}

  constructor({ i = [], o = [] }: ION, opt: Opt = {}, system: System = null) {
    super(
      {
        i,
        o,
      },
      opt,
      system
    )

    this.addListener('play', this._play)
    this.addListener('pause', this._pause)

    this._slot = {
      default: this,
    }
  }

  registerRoot(component: C): number {
    return registerRoot(this, this._root, component)
  }

  unregisterRoot(component: C): void {
    return unregisterRoot(this, this._root, component)
  }

  registerParentRoot(component: C, slotName: string): void {
    return registerParentRoot(this, this._parent_root, component, slotName)
  }

  unregisterParentRoot(component: C): void {
    return unregisterParentRoot(this, this._parent_root, component)
  }

  appendParentChild(component: C<any, any>, slotName: string): void {
    return appendParentChild(this, this._parent_children, component, slotName)
  }

  removeParentChild(component: C<any, any>): void {
    return removeParentChild(this, this._parent_children, component)
  }

  appendChild(Class: UnitClass): number {
    return appendChild(this, this._children, Class)
  }

  pushChild(Class: UnitClass): number {
    return pushChild(this, this._children, Class)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): UnitClass {
    return removeChild(this, this._children, at)
  }

  pullChild(at: number): UnitClass {
    throw pullChild(this, this._children, at)
  }

  refChild(at: number): C {
    return refChild(this, this._children, at)
  }

  refChildren(): C[] {
    return refChildren(this, this._children)
  }

  refSlot(slotName: string): C<any, any> {
    const slot = this._slot[slotName]

    if (slot) {
      return slot
    }

    throw new Error('Slot not found')
  }

  private _play(): void {
    forEach(this._children, (u) => u.play())
  }

  private _pause(): void {
    forEach(this._children, (u) => u.pause())
  }
}
