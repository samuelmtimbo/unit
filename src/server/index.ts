#!/usr/bin/env node
import { readFileSync } from 'fs'
import * as path from 'path'
import { parseArgs } from 'util'
import { defaultBundle } from '../build/bundle'
import { PATH_UNIT } from '../path'
import { serve } from './serve'

/* eslint-disable no-console */
process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

const packageJson = JSON.parse(
  readFileSync(path.join(PATH_UNIT, 'package.json')).toString()
) as { version: string }

const { version } = packageJson

const ROOT_HELP = `Usage: unit [options] [command]

Options:
  -V, --version          output the version number
  -p, --port <number>    Port to run unit server on
  -h, --help             display help for command

Commands:
  build [options] [input]  Build from a bundle or system file. Shorthand: "unit build bundle.json"
`

const BUILD_HELP = `Usage: unit build [options] [input]

Build from a bundle or system file. Shorthand: "unit build bundle.json"

Options:
  -b, --bundle <path>    Path to bundle file (e.g., bundle.json)
  -s, --system <path>    Path to system file (e.g., system.json)
  -o, --output <path>    Output directory (defaults to same dir as input)
  -h, --help             display help for command
`

async function main() {
  const args = process.argv.slice(2)

  if (args[0] === 'build') {
    const { values, positionals } = parseArgs({
      args: args.slice(1),
      allowPositionals: true,
      options: {
        bundle: { type: 'string', short: 'b' },
        system: { type: 'string', short: 's' },
        output: { type: 'string', short: 'o' },
        help: { type: 'boolean', short: 'h' },
      },
    })

    if (values.help) {
      console.log(BUILD_HELP)
      process.exit(0)
    }

    const input = positionals[0]

    const bundle = values.bundle
      ? path.resolve(values.bundle)
      : input
        ? path.resolve(input)
        : undefined

    const system = values.system ? path.resolve(values.system) : undefined

    const basisForOutput = values.output
      ? path.resolve(values.output)
      : bundle ?? system ?? (input ? path.resolve(input) : undefined)

    if (!basisForOutput) {
      console.error(
        'Error: provide at least a positional [input] or --bundle or --system'
      )
      process.exit(1)
    }

    const output = values.output
      ? path.resolve(values.output)
      : path.extname(basisForOutput)
        ? path.dirname(basisForOutput)
        : basisForOutput

    await defaultBundle(bundle, system, output, false, {})
    return
  }

  // "serve" as default/root command
  const { values } = parseArgs({
    args,
    allowPositionals: false,
    options: {
      port: { type: 'string', short: 'p' },
      version: { type: 'boolean', short: 'V' },
      help: { type: 'boolean', short: 'h' },
    },
  })

  if (values.version) {
    console.log(version)
    process.exit(0)
  }

  if (values.help) {
    console.log(ROOT_HELP)
    process.exit(0)
  }

  serve({ port: values.port })
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
