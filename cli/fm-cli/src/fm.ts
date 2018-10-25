#!/usr/bin/env node
import { parse } from 'yargs'
import Cli from './cli'

new Cli().bootstrap(parse(process.argv.slice(2)))
