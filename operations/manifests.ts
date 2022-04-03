import fs from 'fs'
import path from 'path'
import child_process from 'child_process'

import { Command, OptionValues } from 'commander'
import Yaml from 'json-to-pretty-yaml'

import { KubeResource } from '../interfaces'

export default function (breadboardSrc: string, options: OptionValues, command: Command) {

    let breadboardPath = path.join(process.cwd(), breadboardSrc)
    if (! fs.existsSync(breadboardPath)) {
        console.error('File not found at the given location')
        return
    }

    let jsonnetpkgPath = path.join(path.dirname(breadboardPath), 'jsonnetpkg')
    if (! fs.existsSync(jsonnetpkgPath)) {
        console.error('Could not determine jsonnetpkgPath')
        return
    }

    const flattenFunction = "local flatten = function(obj) if std.objectHas(obj, 'kind') && std.objectHas(obj, 'apiVersion') then [ obj ] else std.flattenArrays(std.map(flatten, std.objectValues(obj))); "
    let jsonnetToEval = `${ flattenFunction } flatten(std.mapWithKey(function(name, item) item.factory(name, item), (import '${ breadboardPath }')))`
    let jsonnetArguments = [
        '--jpath', jsonnetpkgPath,
        '-e', jsonnetToEval
    ]

    let jsonnetExectutablePath = child_process.execSync('which jsonnet', { encoding: 'utf-8' }).toString().trim()
    if (! fs.existsSync(jsonnetExectutablePath)) {
        console.error('Could not locate jsonnet executable binary')
        return
    }

    let resources: KubeResource[] = []
    try {
        resources = JSON.parse(
            child_process.execFileSync(jsonnetExectutablePath, jsonnetArguments, { encoding: 'utf8' })
        )
    } catch (err) {
        console.error('Errors invoking jsonnet')
        return
    }

    if (options.json === true) {
        console.log(JSON.stringify({
            apiVersion: 'v1',
            kind: 'List',
            items: resources,
        }, null, 2))
        return
    }

    console.log(
        resources.map(r => Yaml.stringify(r)).join('\n---\n')
    )
}
