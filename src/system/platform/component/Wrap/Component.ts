import { Component } from '../../../../client/component'
import { componentClassFromSpecId } from '../../../../client/componentClassFromSpecId'
import { component_ } from '../../../../client/component_'
import { parentClass } from '../../../../client/createParent'
import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { $Wrap } from '../../../../interface/async/$Wrap'
import { Pod } from '../../../../pod'
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

  private _Container: ComponentClass = parentClass()

  private _child_container: Component[] = []
  private _parent_container: Component[] = []
  private _parent_child_container: Component[] = []

  constructor(props: {}, $system: System, $pod: Pod) {
    super(props, $system, $pod)

    const $element = parentElement($system)

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

    super.domRemoveParentChildAt(container, childSlot, at, _at)
    super.memRemoveParentChildAt(container, childSlot, at, _at)

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
      super.domRemoveParentRootAt(container, childSlot, at, at)
      super.postRemoveParentRootAt(container, childSlot, at, at)

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
    const container = new this._Container({}, this.$system, this.$pod)

    const _ = component_(container)

    const containerUnit = this.$unit[`${method}`]({ at, _ })

    container.connect(containerUnit)

    return container
  }

  private _connected_child_container(at: number): Component {
    return this._connected_container(at, '$refChildContainer')
  }

  private _connected_parent_root_container(at: number): Component {
    return this._connected_container(at, '$refParentRootContainer')
  }

  private _connected_parent_child_container(at: number): Component {
    return this._connected_container(at, '$refParentChildContainer')
  }

  public memAppendChild(child: Component, slotName: string, at: number): void {
    const container = this._connected_child_container(at)

    this._child_container.push(container)

    container.memAppendChild(child, 'default', at)

    super.memAppendChild(child, slotName, at)
  }

  public memAppendParentChild(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    console.log(
      'Wrap',
      'memAppendParentChild',
      component.constructor.name,
      component.$globalId,
      slotName,
      at,
      _at
    )

    const container = this._connected_parent_child_container(at)

    push(this._parent_child_container, container)

    container.memAppendChild(component, 'default', at)

    super.memAppendParentChild(component, slotName, at, _at)
  }

  public domAppendParentChildAt(
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

    container.domAppendChild(component, 'default', at)

    super.domAppendParentChildAt(container, slotName, at, _at)
  }

  public memInsertParentChildAt(
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

    container.memAppendChild(component, 'default', at)

    super.memInsertParentChildAt(component, slotName, at, _at)
  }

  public domInsertParentChildAt(
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

    container.domInsertParentChildAt(component, 'default', at, _at)

    super.domInsertParentChildAt(container, slotName, at, _at)
  }

  public memRemoveParentChildAt(
    component: Component,
    slotName: string,
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

    super.memRemoveParentChildAt(component, slotName, at, _at)
  }

  public domRemoveParentChildAt(
    component: Component,
    slotName: string,
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

    container.domRemoveChild(component, 'default', at)

    super.domRemoveParentChildAt(container, slotName, at, _at)
  }

  public domAppendChild(child: Component, slotName: string, at: number) {
    const container = this._child_container[at]

    container.domAppendChild(child, 'default', at)

    super.domAppendChild(container, slotName, at)
  }

  public postAppendChild(child: Component, at: number): void {
    const container = this._child_container[at]

    child.$parent = this

    container.mount(this.$context)
  }

  public postAppendParentChild(
    child: Component,
    slotName: string,
    at: number
  ): void {
    const container = this._parent_child_container[at]

    container.mount(this.$context)

    child.$parent = this
  }

  public domRemoveChild(child: Component, slotName: string, at: number) {
    const container = this._child_container[at]

    container.domRemoveChild(child, 'default', at)

    super.domRemoveChild(container, slotName, at)
  }

  public postRemoveChild(child: Component, at: number): void {
    const container = this._child_container[at]

    container.unmount()

    super.postRemoveChild(child, at)
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

  public memAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    const container = this._connected_parent_root_container(at)

    this._parent_container.push(container)

    container.memAppendChild(component, 'default', at)

    super.memAppendParentRoot(component, slotName, at)
  }

  public domAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    // console.log('Graph', 'domAppendParentRoot', component, slotName, at)

    const container = this._parent_container[at]

    container.appendChild(component)

    super.domAppendParentRoot(container, slotName, at)
  }

  public postAppendParentRoot(
    component: Component,
    slotName: string,
    at: number
  ): void {
    // console.log('Graph', 'postAppendParentRoot', component, slotName, at)

    const container = this._parent_container[at]

    super.postAppendParentRoot(container, slotName, at)
  }

  public domRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log('Wrap', 'domRemoveParentRootAt', component, at)

    const container = this._parent_container[_at]

    container.domRemoveChild(component, 'default', at)

    super.domRemoveParentRootAt(container, slotName, at, _at)
  }

  public postRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ): void {
    // console.log('Wrap', 'postRemoveParentRootAt', component, at)

    super.postRemoveParentRootAt(component, slotName, at, _at)
  }

  public domInsertParentRootAt(
    component: Component,
    at: number,
    slotName: string
  ): void {
    const container = this._parent_container[at]

    container.domAppendChild(component, 'default', at)

    super.domInsertParentRootAt(container, at, slotName)
  }

  public postInsertParentRootAt(
    component: Component,
    at: number,
    slotName: string
  ): void {
    const container = this._parent_container[at]

    super.postInsertParentRootAt(container, at, slotName)
  }

  public onPropChanged(name: string, current: any): void {
    if (name === 'component') {
      let componentClass: ComponentClass

      if (current) {
        const Class = current as UnitClass

        const { __bundle } = Class

        const { id } = __bundle.unit

        componentClass = componentClassFromSpecId(this.$system, id)
      } else {
        componentClass = parentClass()
      }

      this._Container = componentClass

      this._rewrap()
    } else if (name === 'style') {
      //
    } else if (name === 'className') {
      //
    }
  }

  public getContainer(): ComponentClass {
    return this._Container
  }

  public getChildContainer(at: number): Component {
    return this._child_container[at]
  }

  public getParentChildContainer(at: number): Component {
    return this._parent_child_container[at]
  }

  public getParentRootContainer(at: number): Component {
    return this._parent_container[at]
  }
}
