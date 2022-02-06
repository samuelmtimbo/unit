import { EventEmitter } from './EventEmitter'
import { J } from './interface/J'
import { V } from './interface/V'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import { pop } from './util/array'

export type ObjectUpdateType = 'set' | 'delete'

export type ObjectNode = {
  emitter: EventEmitter | null
  children: Dict<ObjectNode>
}

export class Object_<T extends any> implements J<T>, V<T> {
  private _obj: T
  private _node: ObjectNode = {
    emitter: new EventEmitter(),
    children: {},
  }

  constructor(obj: T) {
    this._obj = obj
  }

  private _obj_at_path(path: string[]): Dict<any> {
    let _obj: any = this._obj
    for (const p of path) {
      _obj = _obj[p]
    }
    return _obj
  }

  private _dispatch = (
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ) => {
    this._rec_dispatch(path, this._node, type, path, key, value)
  }

  _rec_dispatch = (
    current: string[],
    node: ObjectNode,
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ): void => {
    if (current.length === 0) {
      this._end_dispatch(node, type, path, key, value)
    } else {
      const [p, ...next] = current
      const key_node = node.children[p]
      if (key_node) {
        this._rec_dispatch(next, key_node, type, path, key, value)
      }
      const all_node = node.children['*']
      if (all_node) {
        this._rec_dispatch(next, all_node, type, path, key, value)
      }
    }
  }

  _end_dispatch = (
    node: ObjectNode,
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ) => {
    const { emitter } = node
    if (emitter) {
      emitter.emit(key, type, path, key, value)
      emitter.emit('*', type, path, key, value)
    }
  }

  private _ensure_emitter = (path: string[]): EventEmitter => {
    let node = this._node
    for (const p of path) {
      if (!node.children[p]) {
        node.children[p] = { emitter: new EventEmitter(), children: {} }
      }
      node = node.children[p]
    }
    return node.emitter
  }

  private _remove_node = (path: string[]): void => {
    if (path.length > 0) {
      const [last, rest] = pop(path)
      const parent = this._node_at_path(rest)
      delete parent.children[last]
    }
  }

  private _node_at_path = (path: string[]): ObjectNode | null => {
    let node = this._node
    for (const p of path) {
      node = node.children[p]
      if (!node) {
        return null
      }
    }
    return node
  }

  private _set_path = (path: string[], key: string, data: any) => {
    const obj = this._obj_at_path(path)
    obj[key] = data
    this._dispatch('set', path, key, data)
  }

  private _delete = async (name: string): Promise<void> => {
    this._delete_path([], name)
    return
  }

  private _delete_path = (path: string[], name: string) => {
    const obj = this._obj_at_path(path)
    const value = obj[name]
    delete obj[name]
    this._dispatch('delete', path, name, value)
  }

  public async read(): Promise<T> {
    return this._obj
  }

  public write(data: T): Promise<void> {
    this._obj = data
    // TODO unlisten
    return
  }

  public async get(name: string): Promise<any> {
    const value = this._obj[name]

    if (value === undefined) {
      throw new Error('key value not found')
    }

    return this._obj[name]
  }

  public async set(name: string, data: any): Promise<void> {
    this._set_path([], name, data)
  }

  public async hasKey(name: string): Promise<boolean> {
    return this._obj[name] !== undefined
  }

  public async delete(name: string): Promise<void> {
    return this._delete(name)
  }

  public async pathGet(path: string[], name: string): Promise<any> {
    const obj = this._obj_at_path(path)
    return obj[name]
  }

  public async pathSet(path: string[], name: string, data: any): Promise<void> {
    this._set_path(path, name, data)
    return
  }

  public async pathDelete(path: string[], name: string): Promise<void> {
    this._delete_path(path, name)
    return
  }

  public async keys(): Promise<string[]> {
    return Object.keys(this._obj)
  }

  public subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    const emitter = this._ensure_emitter(path)
    emitter.addListener(key, listener)
    return () => {
      emitter.removeListener(key, listener)

      const eventNames = emitter.eventNames()
      if (eventNames.length === 0) {
        this._remove_node(path)
      }
    }
  }
}
