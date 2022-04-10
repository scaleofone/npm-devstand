#!/usr/bin/env node

import process from 'process'

import { Command } from 'commander'
const program = new Command()
program.version('0.0.7')

program.option('-v, --verbose', 'More verbose output', false)

import operationAdd from './operations/add'
program
    .command('add')
    .argument('<src>', 'Repository location in format domain.com/org/repo')
    .description('Add dependency')
    .action(operationAdd)


import operationRemove from './operations/remove'
program
    .command('remove')
    .argument('<src>', 'Repository location in format domain.com/org/repo')
    .description('Remove dependency')
    .action(operationRemove)

import operationFetch from './operations/fetch'
program
    .command('fetch')
    .description('Fetch all dependencies mentioned in jsonnetpkg.json file')
    .action(operationFetch)

import operationManifests from './operations/manifests'
program
    .command('manifests')
    .option('-j|--json', 'Export as JSON')
    .argument('<breadboard>', 'Path to jsonnet breadbord file')
    .description('Export jsonnet file to manifests')
    .action(operationManifests)


program.parse(process.argv)
