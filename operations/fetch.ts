import { Command, OptionValues } from 'commander'
import degit from 'degit'

import { getJsonnetpkgJson } from '../utils'

export default async function (options: OptionValues, command: Command) {
    const manifest = getJsonnetpkgJson()
    for (const packageId of Object.keys(manifest.deps)) {
        let src = manifest.deps[packageId]
        let directory = `jsonnetpkg/${packageId}`
        const emitter = degit(src, { cache: false, force: true, verbose: true })
        emitter.on('info', info => { if (options.verbose) console.log(info.message) })
        emitter.on('warn', warn => console.log(warn.message))
        await emitter.clone(directory)
        console.log(`FETCHED ${packageId}`)
    }
}
