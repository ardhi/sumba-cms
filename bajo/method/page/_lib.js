import path from 'path'

export function isVisible (file) {
  const { env } = this.app.bajo.config
  const { parse } = this.app.bajoMarkdown

  if (path.extname(file) === '') return true
  const { frontMatter } = parse(file, { readFile: true, parseContent: false })
  return frontMatter.status === 'PUBLISHED' || (frontMatter.status === 'DRAFT' && env === 'dev')
}

export function getFiles (dir) {
  const { fs, fastGlob } = this.app.bajo.lib
  const { filter, map } = this.app.bajo.lib._
  const { parse } = this.app.bajoMarkdown
  const types = ['', ...this.types]

  const file = `${dir}/index.md`
  const index = fs.existsSync(file)
  let files = []
  if (index) {
    const { frontMatter } = parse(file, { readFile: true, parseContent: false })
    if (frontMatter.pages && frontMatter.pages.length > 0) files = map(frontMatter.pages, p => `${dir}/${p}`)
  }
  if (files.length === 0) {
    const pattern = [`${dir}/*`, `!${dir}/index.md`]
    files = fastGlob.globSync(pattern, { onlyFiles: false })
  }
  files = filter(files, f => {
    const byType = types.includes(path.extname(f))
    const byVisibility = isVisible.call(this, f)
    return byType && byVisibility
  })
  return files
}
