import * as express from 'express'
import { PATH_PUBLIC } from '../../../../path'
import { logUrlMid } from '../../../middleware/log'

const app = express.Router()

app.use(logUrlMid)

app.use(express.static(PATH_PUBLIC))

export default app
