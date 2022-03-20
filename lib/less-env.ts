#!/usr/bin/env node
import { program } from 'commander'
import create from './create'

program.version(`less-env ${require('../package').version}`)

program
  .command('create [name]')
  .description('create a new demo')
  .option('-f, --force', 'Overwrite the folder if it exists.')
  .action((name, options) => {
    create(name, options)
  })

program.parse(process.argv)
