import { Router } from 'express'
import { CRUD } from '../CRUD'
import { JOI_GRAPH_SCHEMA } from './validation'

const app = Router()

app.use('/', CRUD('graph', JOI_GRAPH_SCHEMA))

export default app
