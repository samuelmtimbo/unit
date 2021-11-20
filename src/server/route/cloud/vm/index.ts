import { Router } from 'express'
import { CRUD } from '../CRUD'
import { JOI_VM_SCHEMA } from './validation'

const app = Router()

app.use('/', CRUD('vm', JOI_VM_SCHEMA))

export default app
