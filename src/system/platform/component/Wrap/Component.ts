import { Component } from '../../../../client/component'
import { component_ } from '../../../../client/component_'
import { componentClassFromSpecId } from '../../../../client/componentClassFromSpecId'
import { parentClass } from '../../../../client/createParent'
import { Element } from '../../../../client/element'
import parentElement from '../../../../client/parentElement'
import { $Wrap } from '../../../../interface/async/$Wrap'
import { ComponentClass, System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { UnitClass } from '../../../../types/UnitClass'
import { insert, push, removeAt, unshift } from '../../../../util/array'

export interface Props {
  className?: string
  style?: Dict<string>
  component?: UnitClass
}

export const DEFAULT_STYLE = {}

export default class Wrap extends Element<HTMLDivElement, Props, $Wrap> {
  $_ = ['$W']

  private _Component: ComponentClass = parentClass()

  private _child_container: Component[] = []
  private _parent_container: Component[] = []
  private _parent_child_container: Component[] = []

  constructor(props: {}, $system: System) {
    super(props, $system)

    const $element = parentElement()

    this.$element = $element
  }

  private _rewrap = (): void => {
    for (let at = 0; at < this._child_container.length; at++) {
      this.rewrapChild(at)
    }

    for (let at = 0; at < this._parent_container.length; at++) {
      this.rewrapParentRoot(at)
    }

    for (let at = 0; at < this._parent_child_container.length; at++) {
      this.rewrapParentChild(at)
    }
  }

  private rewrapParentChild(at: number) {
    const _at = at

    const container = this._parent_child_container[at]

    container.disconnect()

    const child = this.$parentRoot[at]
    const childSlot = this.$parentRootSlot[at]

    const new_container = this._connected_parent_root_container(at)
    this._parent_child_container[at] = new_container

    super.domRemoveParentChildAt(container, at, _at)
    super.memRemoveParentChildAt(container, at, _at)

    container.removeChild(child)

    new_container.appendChild(child)

    super.domAppendParentChildAt(new_container, childSlot, at, _at)
    super.memAppendParentChild(new_container, childSlot, at, _at)
  }

  private rewrapParentRoot(at: number) {
    const container = this._parent_container[at]

    container.disconnect()

    const child = this.$parentRoot[at]
    const childSlot = this.$parentRootSlot[at]

    const new_container = this._connected_parent_root_container(at)
    this._parent_container[at] = new_container

    if (this.$mountParentRoot.includes(child)) {
      super.domRemoveParentRootAt(container, at)
      super.postRemoveParentRootAt(container, at)

      container.removeChild(child)

      new_container.appendChild(child)

      super.domAppendParentRoot(new_container, childSlot, at)
      super.postAppendParentRoot(new_container, childSlot, at)
    }
  }

  private rewrapChild(at: number) {
    const container = this._child_container[at]

    container.disconnect()

    const child = this.$children[at]
    const childSlot = this.$childrenSlot[at]

    super.domRemoveChild(container, childSlot, at)
    super.postRemoveChild(container, at)

    container.removeChild(child)

    const new_container = this._connected_child_container(at)

    new_container.appendChild(child)

    this._child_container[at] = new_container

    super.domAppendChild(new_container, childSlot, at)
    super.postAppendChild(new_container, at)
  }

  private _connected_container = (at: number, method: string): Component => {
    const container = new this._Component({}, this.$system)

    const _ = component_(container)

    const containerUnit = this.$unit[`${method}`]({ at, _ })

    container.connect(containerUnit)

    return container
  }

  private _connected_child_container(at: number): Component {
    return this._connected_container(at, '$refParentChildContainer')
  }

  private _connected_parent_root_container(at: number): Component {
    return this._connected_container(at, '$refParentRootContainer')
  }

  private _connected_parent_child_container(at: number): Component {
    return this._connected_container(at, '$refParentChildContainer')
  }

  protected memAppendParentChild(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log(
    //   'Wrap',
    //   'memAppendParentChild',
    //   component.constructor.name,
    //   component.$globalId,
    //   slotName,
    //   at,
    //   _at
    // )

    const container = this._connected_parent_child_container(at)

    push(this._parent_child_container, container)

    super.memAppendParentChild(component, slotName, at, _at)
  }

  protected domAppendParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log(
    //   'Wrap',
    //   'domAppendParentChildAt',
    //   component.constructor.name,
    //   component.$globalId,
    //   slotName,
    //   at,
    //   _at
    // )

    const container = this._parent_child_container[_at]

    container.appendChild(component)

    super.domAppendParentChildAt(container, slotName, at, _at)

    container.mount(this.$context)
  }

  protected memInsertParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log(
    //   'Wrap',
    //   'memInsertParentChildAt',
    //   component.constructor.name,
    //   component.$globalId,
    //   slotName,
    //   at,
    //   _at
    // )

    const container = this._connected_parent_child_container(at)

    insert(this._parent_child_container, container, _at)

    super.memInsertParentChildAt(component, slotName, at, _at)
  }

  protected domInsertParentChildAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log(
    //   'Wrap',
    //   'domInsertParentChildAt',
    //   component.constructor.name,
    //   component.$globalId,
    //   slotName,
    //   at,
    //   _at
    // )

    const container = this._parent_child_container[_at]

    container.appendChild(component)

    super.domInsertParentChildAt(container, slotName, at, _at)

    container.mount(this.$context)
  }

  protected memRemoveParentChildAt(
    component: Component,
    at: number,
    _at: number
  ): void {
    // console.log(
    //   'Wrap',
    //   'memRemoveParentChildAt',
    //   component.constructor.name,
    //   component.$globalId,
    //   at,
    //   _at
    // )

    this._parent_child_container.splice(_at, 1)

    super.memRemoveParentChildAt(component, at, _at)
  }

  protected domRemoveParentChildAt(
    component: Component,
    at: number,
    _at: number
  ): void {
    // console.log(
    //   'Wrap',
    //   'domRemoveParentChildAt',
    //   component.constructor.name,
    //   component.$globalId,
    //   at,
    //   _at
    // )

    const container = this._parent_child_container[_at]

    container.removeChild(component)

    super.domRemoveParentChildAt(container, at, _at)

    container.unmount()
  }

  protected domAppendChild(child: Component, slotName: string, at: number) {
    const container = this._connected_child_container(at)

    this._child_container.push(container)

    container.appendChild(child)

    super.domAppendChild(container, slotName, at)
  }

  protected postAppendChild(child: Component, at: number): void {
    const container = this._child_container[at]

    super.postAppendChild(container, at)
  }

  protected domRemoveChild(child: Component, slotName: string, at: number) {
    const container = this._child_container[at]

    container.removeChild(child)

    super.domRemoveChild(container, slotName, at)
  }

  protected postRemoveChild(child: Component, at: number): void {
    const container = this._child_container[at]

    super.postRemoveChild(container, at)
  }

  public pushParentRoot(component: Component, slotName: string): void {
    // console.log('Graph', 'pushParentRoot', component, slotName)

    const at = this.$parentRoot.length

    const container = this._connected_parent_root_container(at)

    this._parent_container.push(container)

    super.pushParentRoot(component, slotName)
  }

  public insertParentRoot(
    component: Component,
    at: number,
    slotName: string
  ): void {
    // console.log('Graph', 'insertParentRoot', component, at, slotName)

    const container = this._connected_parent_root_container(at)

    insert(this._parent_container, container, at)

    super.insertParentRoot(component, at, slotName)
  }

  public unshiftParentRoot(component: Component, slotName: string): void {
    // console.log('Graph', 'unshiftParentRoot', component)

    const container = this._connected_parent_root_container(0)

    unshift(this._parent_container, container)

    super.unshiftParentRoot(component, slotName)
  }

  public pullParentRoot(component: Component): void {
    // console.log('Graph', 'pullParentRoot', component)

    const at = this.$parentRoot.indexOf(component)

    removeAt(this._parent_container, at)

    super.pullParentRoot(component)
  }

  protected domAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    // console.log('Graph', 'domAppendParentRoot', component, slotName, at)

    const container = this._parent_container[at]

    container.appendChild(component)

    super.domAppendParentRoot(container, slotName, at)
  }

  protected postAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    // console.log('Graph', 'postAppendParentRoot', component, slotName, at)

    const container = this._parent_container[at]

    super.postAppendParentRoot(container, slotName, at)
  }

  protected domRemoveParentRootAt(component: Component, at: number): void {
    // console.log('Wrap', 'domRemoveParentRootAt', component, at)

    const container = this._parent_container[at]

    container.removeChild(component)

    super.domRemoveParentRootAt(container, at)
  }

  protected postRemoveParentRootAt(component: Component, at: number): void {
    // console.log('Wrap', 'postRemoveParentRootAt', component, at)

    const container = this._parent_container[at]

    super.postRemoveParentRootAt(container, at)
  }

  protected domInsertParentRootAt(
    component: Component,
    at: number,
    slotName: string
  ): void {
    const container = this._parent_container[at]

    container.appendChild(component)

    super.domInsertParentRootAt(container, at, slotName)
  }

  protected postInsertParentRootAt(
    component: Component,
    at: number,
    slotName: string
  ): void {
    const container = this._parent_container[at]

    super.postInsertParentRootAt(container, at, slotName)
  }

  onPropChanged(name: string, current: any): void {
    if (name === 'component') {
      let componentClass: ComponentClass

      if (current) {
        const unitClass = current as UnitClass

        const { __id } = unitClass

        componentClass = componentClassFromSpecId(this.$system, __id)
      } else {
        componentClass = parentClass()
      }

      this._Component = componentClass

      this._rewrap()
    } else if (name === 'style') {
      //
    } else if (name === 'className') {
      //
    }
  }
}
