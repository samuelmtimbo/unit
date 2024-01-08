import { Object_ } from '../Object'

const _obj_emitter = new Object_({ foo: {} })

const unlisten = _obj_emitter.subscribe([], '*', (type, path, key, data) => {
  // eslint-disable-next-line no-console
  console.log(`[], '*'`, type, path, key, data)
})

const unlisten0 = _obj_emitter.subscribe(
  ['*'],
  'name',
  (type, path, key, data) => {
    // eslint-disable-next-line no-console
    console.log(`['*'], 'name'`, type, path, key, data)
  }
)

const unlisten1 = _obj_emitter.subscribe(
  ['*'],
  'name',
  (type, path, key, data) => {
    // eslint-disable-next-line no-console
    console.log(`['*'], 'name'`, type, path, key, data)
  }
)

const unlisten2 = _obj_emitter.subscribe(
  ['*'],
  '*',
  (type, path, key, data) => {
    // eslint-disable-next-line no-console
    console.log(`['*'], '*'`, type, path, key, data)
  }
)

_obj_emitter.deepSet(['foo'], {})
_obj_emitter.deepSet(['foo', 'name'], 'bar')
_obj_emitter.deepSet(['foo', 'name'], 'zaz')
_obj_emitter.deepDelete(['foo', 'name'])

unlisten()
unlisten0()
unlisten1()
unlisten2()

_obj_emitter.deepSet(['foo', 'name'], 'tar')
