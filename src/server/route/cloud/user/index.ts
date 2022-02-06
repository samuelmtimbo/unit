import { Router } from 'express'
import { authHeaderMid } from '../../../middleware/authHeaderMid'
import { logUrlMid } from '../../../middleware/log'
import { Req } from '../../../req'

const app = Router()

app.use(logUrlMid)

app.get('/', authHeaderMid())

app.get('/', async function (req: Req, res, next) {
  const { user } = req

  delete user.token

  res.send(user)
})

export default app
