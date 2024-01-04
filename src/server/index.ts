#!/usr/bin/env node
import * as http from 'http'
import { serve } from './serve'

/* eslint-disable no-console */

process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

export let server: http.Server | null = serve()
