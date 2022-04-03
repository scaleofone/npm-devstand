import { Command, OptionValues } from 'commander'

import { parseSrc, rmrf, getJsonnetpkgJson, setJsonnetpkgJson } from '../utils'

export default function (src: string, options: OptionValues, command: Command) {
    const parsed = parseSrc(src)
    const packageId = `${parsed.domain}/${parsed.user}/${parsed.name}`
    const directory = `jsonnetpkg/${packageId}`
    rmrf(directory)
    let manifest = getJsonnetpkgJson()
    if (packageId in manifest.deps) {
        delete manifest.deps[packageId]
        setJsonnetpkgJson(manifest)
    }
}
