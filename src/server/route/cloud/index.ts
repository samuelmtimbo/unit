import { Router } from 'express'
import { Dict } from '../../../types/Dict'
import { connectDB } from '../../db'
import { logUrlMid } from '../../middleware/log'
import { Req, Res } from '../../req'
import FILE from './file'
import GRAPH from './graph'
import PEER from './peer'
import PUBLIC from './public'
import USER from './user'
import WEB from './web'

const app = Router()

app.use('/', logUrlMid)

// app.use('/auth', AUTH) // TODO
app.use('/public', PUBLIC)

// app.use(authHeaderMid())

app.use('/file', FILE)
app.use('/user', USER)
app.use('/graph', GRAPH)
app.use('/peer', PEER)
app.use('/web', WEB)

const SERVICES = ['graph', 'web', 'vm']

app.get('/', async (req: Req, res: Res) => {
  const { user } = req
  const { userId } = user
  const { cloudDB, sharedDB } = await connectDB()
  const all: Dict<{ user: any; shared: any }> = {}
  for (const service of SERVICES) {
    all[service] = {
      user: [],
      shared: [],
    }

    const user_store = cloudDB[service]
    const shared_store = sharedDB[service]

    all[service].user = await user_store.getAll(userId)
    all[service].shared = await shared_store.getAll(userId)
  }

  res.send(all)
})

export default app
