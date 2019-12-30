#!/usr/bin/env node

import { parsePostmanCollection } from './collection'

const chalk = require('chalk')
const program = require('commander')

function vars(
  value: string,
  previous: Map<string, string>
): Map<string, string> {
  let map = value.split('=')
  previous.set(map[0], map[1])
  return previous
}

program
  .version('0.0.1')
  .arguments('[collection-filenames]')
  .description('Generates K6 tests in typescript from postman collections')
  .option(
    '-d, --destination <directory>',
    'The directory the test files will be written to',
    'requests'
  )
  .option(
    '-v, --var <key=value>',
    'Environment variables for the postman collection',
    vars,
    new Map<string, string>()
  )
  .parse(process.argv)

if (!program.args.length) {
  program.outputHelp()
}

program.args.forEach((collection: string) => {
  parsePostmanCollection(collection, program.destination, program.var)
})
