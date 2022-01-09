import { Object_ } from '../Object'

const _obj_emitter = new Object_({ foo: {} })
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
_obj_emitter.pathSet([], 'foo', {})
_obj_emitter.pathSet(['foo'], 'name', 'bar')
_obj_emitter.pathSet(['foo'], 'name', 'zaz')
_obj_emitter.pathDelete(['foo'], 'name')
unlisten()
unlisten0()
unlisten1()
unlisten2()
console.log('...')
_obj_emitter.pathSet(['foo'], 'name', 'tar')
