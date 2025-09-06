#!/usr/bin/env node
import { Command } from 'commander'
import { readFileSync } from 'fs'
import * as path from 'path'
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

const program = new Command()

program
  .version(version)
  .option('-p, --port <number>', 'Port to run unit server on')

// "serve" as default/root command
program.action(() => {
  const { port } = program.opts()
  serve({ port })
})

// "build" subcommand
program
  .command('build [input]')
  .description(
    'Build from a bundle or system file. Shorthand: "unit build bundle.json"'
  )
  .option('-b, --bundle <path>', 'Path to bundle file (e.g., bundle.json)')
  .option('-s, --system <path>', 'Path to system file (e.g., system.json)')
  .option(
    '-o, --output <path>',
    'Output directory (defaults to same dir as input)'
  )
  .action(
    async (
      input: string | undefined,
      cmdOptions: {
        bundle?: string
        system?: string
        output?: string
      }
    ) => {
      const bundle = cmdOptions.bundle
        ? path.resolve(cmdOptions.bundle)
        : input
          ? path.resolve(input)
          : undefined

      const system = cmdOptions.system
        ? path.resolve(cmdOptions.system)
        : undefined

      const basisForOutput = cmdOptions.output
        ? path.resolve(cmdOptions.output)
        : bundle ?? system ?? (input ? path.resolve(input) : undefined)

      if (!basisForOutput) {
        console.error(
          'Error: provide at least a positional [input] or --bundle or --system'
        )
        process.exit(1)
      }

      const output = cmdOptions.output
        ? path.resolve(cmdOptions.output)
        : path.extname(basisForOutput)
          ? path.dirname(basisForOutput)
          : basisForOutput

      await defaultBundle(bundle, system, output, false, {})
    }
  )

program.parse(process.argv)
