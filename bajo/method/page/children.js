import path from 'path'

function pageChildren (dir, base, req) {
  const { fastGlob } = this.app.bajo.lib
  const { map, filter } = this.app.bajo.lib._
  const types = ['', ...this.types]

  if (path.extname(dir) !== '') return []
  const pattern = [`${dir}/*`, `!${dir}/index.md`]
  const files = fastGlob.globSync(pattern, { onlyFiles: false })
  return map(filter(files, f => types.includes(path.extname(f))), f => this.pageDetails(f, base, req))
}

export default pageChildren
