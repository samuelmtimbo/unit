import { Router } from 'express'
import { Dict } from '../../../types/Dict'
import { connectDB } from '../../db'
import { validateBodyMid, validateParamsMid } from '../../middleware/validate'
import { Req } from '../../req'
import { userBroadcast } from '../../wss'
import {
  JOI_GET_SCHEMA,
  JOI_RESOURCE_SCHEMA,
  JOI_SHARED_ENTRY_SCHEMA,
} from './validation'
import Joi = require('joi')

export function CRUD(type: string, JOI_SCHEMA: Joi.AnySchema): Router {
  const app = Router()

  app.get('/', async function (req: Req, res, next) {
    const { user } = req
    const { userId } = user
    const { cloudDB } = await connectDB()
    const store = cloudDB[type]
    const all = await store.getAll(userId)
    res.send(all)
  })

  app.get('/:id', validateParamsMid(JOI_RESOURCE_SCHEMA))
  app.get('/:id', async function (req: Req, res, next) {
    const { user, params } = req
    const { userId } = user
    const { id } = params
    const { cloudDB } = await connectDB()
    const store = cloudDB[type]
    const entry = await store.get(userId, id)
    res.send(entry)
  })

  app.post('/', validateBodyMid(JOI_SCHEMA))
  app.post('/', async function (req: Req, res, next) {
    const { user, sessionId, body } = req
    const { userId } = user
    const { id, data } = body
    const { cloudDB } = await connectDB()
    const store = cloudDB[type]
    await store.create(userId, id, data)
    userBroadcast(userId, sessionId, {
      type: 'cloud',
      data: {
        type,
        data: { type: 'user', data: { type: 'add', data: { id, data } } },
      },
    })
    res.send({})
  })

  app.get('/:id', validateParamsMid(JOI_RESOURCE_SCHEMA))
  app.put('/:id', validateBodyMid(JOI_SCHEMA))
  app.put('/:id', async function (req: Req, res, next) {
    const { user, sessionId, body, params } = req
    const { userId } = user
    const { id } = params
    const { data } = body
    const { cloudDB } = await connectDB()
    const store = cloudDB[type]
    await store.put(userId, id, data)
    userBroadcast(userId, sessionId, {
      type: 'cloud',
      data: {
        type,
        data: { type: 'user', data: { type: 'put', data: { id, data } } },
      },
    })
    res.send({})
  })

  app.delete('/:id', validateParamsMid(JOI_RESOURCE_SCHEMA))
  app.delete('/:id', async function (req: Req, res, next) {
    const { user, sessionId, params } = req
    const { userId } = user
    const { id } = params
    const { cloudDB } = await connectDB()
    const store = cloudDB[type]
    // TODO 404
    await store.delete(userId, id)
    userBroadcast(userId, sessionId, {
      type: 'cloud',
      data: {
        type,
        data: { type: 'user', data: { type: 'delete', data: { id } } },
      },
    })
    res.send({})
  })

  return app
}

export function SHARED(path: string): Router {
  const app = Router()

  app.get('/', async function (req: Req, res, next) {
    const { user } = req
    const { userId } = user
    const { cloudDB, sharedDB } = await connectDB()
    const sharedStore = sharedDB[path]
    const cloudStore = cloudDB[path]
    const allShared = await sharedStore.getAll(userId)
    const all: Dict<any> = {}
    for (const sharedEntryId in allShared) {
      const sharedEntry = allShared[sharedEntryId]
      const { userId: _userId, entryId } = sharedEntry
      const entry = await cloudStore.get(_userId, entryId)
      all[sharedEntryId] = entry
    }
    res.send(all)
  })

  app.get('/:id', validateParamsMid(JOI_GET_SCHEMA))

  app.get('/:id', async function (req: Req, res, next) {
    const { user, params } = req
    const { userId } = user
    const { id } = params
    const { cloudDB, sharedDB } = await connectDB()
    const sharedStore = sharedDB[path]
    const cloudStore = cloudDB[path]
    const sharedEntry = await sharedStore.get(userId, id)
    const { userId: _userId, entryId } = sharedEntry
    const entry = await cloudStore.get(_userId, entryId)
    res.send(entry)
  })

  app.post('/', validateBodyMid(JOI_SHARED_ENTRY_SCHEMA))

  app.post('/', async function (req: Req, res, next) {
    const { user, body } = req
    const { userId } = user
    const { id, data } = body
    const { sharedDB } = await connectDB()
    const sharedStore = sharedDB[path]
    await sharedStore.create(userId, id, data)
    res.send({})
  })

  app.delete('/:id', validateParamsMid(JOI_RESOURCE_SCHEMA))

  app.delete('/:id', async function (req: Req, res, next) {
    const { user, params } = req
    const { userId } = user
    const { id } = params
    const { sharedDB } = await connectDB()
    const sharedStore = sharedDB[path]
    // TODO 404
    await sharedStore.delete(userId, id)
    res.send({})
  })

  return app
}
