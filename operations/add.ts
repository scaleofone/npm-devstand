import { Command, OptionValues } from 'commander'
import degit from 'degit'

import { parseSrc, getJsonnetpkgJson, setJsonnetpkgJson } from '../utils'

export default async function (src: string, options: OptionValues, command: Command) {
    const parsed = parseSrc(src)
    const srcForManifest = `${parsed.domain}/${parsed.user}/${parsed.name}${parsed.subdir ? parsed.subdir : ''}#${parsed.ref}`
    const packageId = `${parsed.domain}/${parsed.user}/${parsed.name}`
    const directory = `jsonnetpkg/${packageId}`
    const emitter = degit(src, { cache: false, force: true, verbose: true })
    emitter.on('info', info => { if (options.verbose) console.log(info.message) })
    emitter.on('warn', warn => console.log(warn.message))
    await emitter.clone(directory)
    let manifest = getJsonnetpkgJson()
    manifest.deps[packageId] = srcForManifest
    setJsonnetpkgJson(manifest)
    console.log(`FETCHED ${packageId}`)

}
