import { EventEmitter2 } from 'eventemitter2'
import { J } from './interface/J'
import { Dict } from './types/Dict'
import { Unlisten } from './Unlisten'
import { pop } from './util/array'

export type ObjectUpdateType = 'set' | 'delete'

export type ObjectEmitterNode = {
  emitter: EventEmitter2 | null
  children: Dict<ObjectEmitterNode>
}

export function $Object<T extends object>(obj: T): J {
  const _node: ObjectEmitterNode = {
    emitter: new EventEmitter2(),
    children: {},
  }

  const _obj_at_path = (path: string[]): Dict<any> => {
    let _obj: any = obj
    for (const p of path) {
      _obj = _obj[p]
    }
    return _obj
  }

  const _node_at_path = (path: string[]): ObjectEmitterNode | null => {
    let node = _node
    for (const p of path) {
      node = node.children[p]
      if (!node) {
        return null
      }
    }
    return node
  }

  const _rec_dispatch = (
    current: string[],
    node: ObjectEmitterNode,
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ): void => {
    if (current.length === 0) {
      _end_dispatch(node, type, path, key, value)
    } else {
      const [p, ...next] = current
      const key_node = node.children[p]
      if (key_node) {
        _rec_dispatch(next, key_node, type, path, key, value)
      }
      const all_node = node.children['*']
      if (all_node) {
        _rec_dispatch(next, all_node, type, path, key, value)
      }
    }
  }

  const _end_dispatch = (
    node: ObjectEmitterNode,
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

  const _ensure_emitter = (path: string[]): EventEmitter2 => {
    let node = _node
    for (const p of path) {
      if (!node.children[p]) {
        node.children[p] = { emitter: new EventEmitter2(), children: {} }
      }
      node = node.children[p]
    }
    return node.emitter
  }

  const _remove_node = (path: string[]): void => {
    if (path.length > 0) {
      const [last, rest] = pop(path)
      const parent = _node_at_path(rest)
      delete parent.children[last]
    }
  }

  const subscribe = (
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten => {
    const emitter = _ensure_emitter(path)
    emitter.addListener(key, listener)
    return () => {
      emitter.removeListener(key, listener)

      const eventNames = emitter.eventNames()
      if (eventNames.length === 0) {
        _remove_node(path)
      }
    }
  }

  const _dispatch = (
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ) => {
    _rec_dispatch(path, _node, type, path, key, value)
  }

  const _set_path = (path: string[], key: string, data: any) => {
    const obj = _obj_at_path(path)
    obj[key] = data
    _dispatch('set', path, key, data)
  }

  const _delete_path = (path: string[], name: string) => {
    const obj = _obj_at_path(path)
    const value = obj[name]
    delete obj[name]
    _dispatch('delete', path, name, value)
  }

  const get = async (name: string): Promise<any> => {
    return obj[name]
  }

  const set = async (name: string, data: any): Promise<void> => {
    obj[name] = data
    _set_path([], name, data)
    return
  }

  const _delete = async (name: string): Promise<void> => {
    _delete_path([], name)
    return
  }

  const getPath = async (path: string[], name: string): Promise<any> => {
    const obj = _obj_at_path(path)
    return obj[name]
  }

  const setPath = async (
    path: string[],
    name: string,
    data: any
  ): Promise<void> => {
    _set_path(path, name, data)
    return
  }

  const deletePath = async (path: string[], name: string): Promise<void> => {
    _delete_path(path, name)
    return
  }

  return {
    get,
    set,
    delete: _delete,
    getPath,
    setPath,
    deletePath,
    subscribe,
  }
}

const _obj_emitter = $Object({ foo: {} })

const unlisten = _obj_emitter.subscribe([], '*', (type, path, key, data) => {
  console.log(`[], '*'`, type, path, key, data)
})

const unlisten0 = _obj_emitter.subscribe(
  ['*'],
  'name',
  (type, path, key, data) => {
    console.log(`['*'], 'name'`, type, path, key, data)
  }
)

const unlisten1 = _obj_emitter.subscribe(
  ['*'],
  'name',
  (type, path, key, data) => {
    console.log(`['*'], 'name'`, type, path, key, data)
  }
)

const unlisten2 = _obj_emitter.subscribe(
  ['*'],
  '*',
  (type, path, key, data) => {
    console.log(`['*'], '*'`, type, path, key, data)
  }
)

_obj_emitter.setPath([], 'foo', {})

_obj_emitter.setPath(['foo'], 'name', 'bar')

_obj_emitter.setPath(['foo'], 'name', 'zaz')

_obj_emitter.deletePath(['foo'], 'name')

unlisten()

unlisten0()

unlisten1()

unlisten2()

console.log('...')

_obj_emitter.setPath(['foo'], 'name', 'tar')
