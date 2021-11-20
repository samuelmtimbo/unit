import { Router } from 'express'
import { CRUD } from '../CRUD'
import { JOI_WEB_SCHEMA } from './validation'

const app = Router()

app.use('/', CRUD('web', JOI_WEB_SCHEMA))

export default app
