#!/usr/bin/env node
import { Command } from 'commander'
import { readFileSync } from 'fs'
import * as http from 'http'
import * as path from 'path'
import { PATH_UNIT } from '../path'
import { serve } from './serve'

const packageJson = JSON.parse(
  readFileSync(path.join(PATH_UNIT, 'package.json')).toString()
) as { version: string }

const { version } = packageJson

const program = new Command()

program
  .version(version)
  .option('-p, --port <number>', 'Port to run unit server on')

program.parse(process.argv)

const options = program.opts()

const { port } = options

/* eslint-disable no-console */
process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

export let server: http.Server | null = serve({ port })
