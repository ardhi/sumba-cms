import path from 'path'

const statProps = ['size', 'mtime', 'birthtime']
let types = []

function getDetails (file, base, removeExt = true) {
  const { fs } = this.app.bajo.lib
  const { trim, pick } = this.app.bajo.lib._
  let route = trim(file.replace(base, ''), '/')
  if (removeExt) {
    for (const t of types) route = route.replace(t, '')
  }
  return {
    route,
    isDir: path.extname(file) === '',
    file,
    stat: pick(fs.statSync(file), statProps)
  }
}

function getSiblings (file, base) {
  const { fastGlob } = this.app.bajo.lib
  const { map, filter } = this.app.bajo.lib._
  const pattern = [`${path.dirname(file)}/*`, `!${file}`, `!${path.dirname(file)}/_index.md`]
  const files = fastGlob.globSync(pattern, { onlyFiles: false })
  return map(filter(files, f => types.includes(path.extname(f))), f => getDetails.call(this, f, base))
}

function getChildren (dir, base) {
  const { fastGlob } = this.app.bajo.lib
  const { map, filter } = this.app.bajo.lib._
  if (path.extname(dir) !== '') return []
  const pattern = [`${dir}/*`, `!${dir}/_index.md`]
  const files = fastGlob.globSync(pattern, { onlyFiles: false })
  return map(filter(files, f => types.includes(path.extname(f))), f => getDetails.call(this, f, base))
}

function handlePage (ofile, route, base) {
  const { fs } = this.app.bajo.lib
  let file
  for (const type of types) {
    const check = `${ofile}${type}`
    if (fs.existsSync(check)) {
      file = check
      break
    }
  }
  if (!file) throw this.error('notfound')
  const main = getDetails.call(this, file, base)
  const siblings = getSiblings.call(this, file, base)
  const children = getChildren.call(this, file, base)
  const result = { type: 'page', main, siblings, children }
  return result
}

async function getPathInfo (req, base = '') {
  const { trim } = this.app.bajo.lib._
  const { fs } = this.app.bajo.lib
  types = ['', ...this.types]
  const route = trim(req.params['*'], '/')
  const file = `${base}/${route}`
  if (path.extname(file) === '') return handlePage.call(this, file, route, base)
  if (!fs.existsSync(file)) throw this.error('notfound')
  return { type: 'asset', main: getDetails.call(this, file, base, false) }
}

export default getPathInfo
