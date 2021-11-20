import { Router } from 'express'
import { CRUD } from '../CRUD'
import { JOI_FILE_SCHEMA } from './validation'

const app = Router()

app.use('/', CRUD('file', JOI_FILE_SCHEMA))

export default app
