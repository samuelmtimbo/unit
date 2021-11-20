import { Router } from 'express'
import { connectDB } from '../../../db'
import { authHeaderMid } from '../../../middleware/authHeaderMid'
import { logUrlMid } from '../../../middleware/log'
import { Req } from '../../../req'

const app = Router()

app.use(logUrlMid)

app.get('/', authHeaderMid())

app.get('/', async function (req: Req, res, next) {
  const { userId } = req
  const db = await connectDB()
  const { userDB } = db
  const user = await userDB.get(userId)
  delete user.password
  res.send(user)
})

export default app
