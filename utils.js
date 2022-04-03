import fs from 'fs'

const supported = new Set(['github', 'gitlab', 'bitbucket', 'git.sr.ht']);

export function parseSrc(src) {
    const match = /^(?:(?:https:\/\/)?([^:/]+\.[^:/]+)\/|git@([^:/]+)[:/]|([^/]+):)?([^/\s]+)\/([^/\s#]+)(?:((?:\/[^/\s#]+)+))?(?:\/)?(?:#(.+))?/.exec(
        src
    );
    if (!match) {
        throw new Error(`could not parse ${src}`);
    }

    const site = (match[1] || match[2] || match[3] || 'github').replace(
        /\.(com|org)$/,
        ''
    );
    if (!supported.has(site)) {
        throw new Error(`degit supports GitHub, GitLab, Sourcehut and BitBucket`);
    }

    const user = match[4];
    const name = match[5].replace(/\.git$/, '');
    const subdir = match[6];
    const ref = match[7] || 'HEAD';

    const domain = `${site}.${
        site === 'bitbucket' ? 'org' : site === 'git.sr.ht' ? '' : 'com'
    }`;
    const url = `https://${domain}/${user}/${name}`;
    const ssh = `git@${domain}:${user}/${name}`;

    const mode = supported.has(site) ? 'tar' : 'git';

    return { domain, site, user, name, ref, url, ssh, subdir, mode };
}

// taken from here: https://github.com/mrDarcyMurphy/node-rmrf/blob/master/index.js
export const rmrf = (dirPath) => {
    if (fs.existsSync(dirPath)) {
      var files = fs.readdirSync(dirPath)
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i]
          if (fs.lstatSync(filePath).isDirectory())
            rmrf(filePath)
          else
            fs.unlinkSync(filePath)
        }
      }
      fs.rmdirSync(dirPath)
    }
}



export function getJsonnetpkgJson() {
  return fs.existsSync('jsonnetpkg.json') ? JSON.parse(fs.readFileSync('jsonnetpkg.json', { encoding: 'utf-8' })) : { deps: {} }
}
export function setJsonnetpkgJson(value) {
  fs.writeFileSync('jsonnetpkg.json', JSON.stringify(value, null, '  '), { encoding: 'utf-8' })
}
