import path from 'path'

function pageSiblings (file, base, req) {
  const { fastGlob } = this.app.bajo.lib
  const { map, filter } = this.app.bajo.lib._
  const types = ['', ...this.types]

  const pattern = [`${path.dirname(file)}/*`, `!${path.dirname(file)}/index.md`]
  const files = fastGlob.globSync(pattern, { onlyFiles: false })
  return map(filter(files, f => types.includes(path.extname(f))), f => {
    const opts = { active: f === file }
    return this.pageDetails(f, base, req, opts)
  })
}

export default pageSiblings
