import { Router } from 'express'
import CLOUD from './cloud'

const app = Router()

app.use('/', CLOUD)

export default app
