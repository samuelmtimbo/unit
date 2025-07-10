import { app, BrowserWindow } from 'electron'

import { serve } from '../../../server/serve'

const PORT = 4224

const server = serve({ port: PORT })

const createWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
  })

  void window.loadURL(`http://localhost:${PORT}`)
}

app
  .whenReady()
  .then(() => {
    void createWindow()
  })
  .catch((err) => {})
