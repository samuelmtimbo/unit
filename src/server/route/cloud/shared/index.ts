import * as bodyParser from 'body-parser'
import { Router } from 'express'
import { authHeaderMid } from '../../../middleware/authHeaderMid'
import { logUrlMid } from '../../../middleware/log'
import { SHARED } from '../CRUD'

const app = Router()

app.use('/', logUrlMid)

app.use(bodyParser.json())

app.use(authHeaderMid())

app.use('/graph', SHARED('graph'))
app.use('/file', SHARED('file'))
app.use('/peer', SHARED('peer'))
app.use('/web', SHARED('web'))

export default app
