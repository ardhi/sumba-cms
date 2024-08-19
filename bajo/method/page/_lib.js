import path from 'path'

export function isVisibleByFm (frontMatter) {
  const { env } = this.app.bajo.config
  return frontMatter.status === 'PUBLISHED' || (frontMatter.status === 'DRAFT' && env === 'dev')
}

export function isVisible (file) {
  const { parse } = this.app.bajoMarkdown
  const { fs } = this.app.bajo.lib

  if (path.extname(file) === '') {
    const dir = `${file}/index.md`
    if (!fs.existsSync(dir)) return true
    file = dir
  }
  const { frontMatter } = parse(file, { readFile: true, parseContent: false })
  return isVisibleByFm.call(this, frontMatter)
}

export function getFiles (dir) {
  const { fs, fastGlob } = this.app.bajo.lib
  const { filter, map } = this.app.bajo.lib._
  const { parse } = this.app.bajoMarkdown
  const types = ['', ...this.types]

  function getAll (d) {
    const pattern = [`${d}/*`, `!${d}/index.md`]
    return fastGlob.globSync(pattern, { onlyFiles: false })
  }

  const file = `${dir}/index.md`
  const index = fs.existsSync(file)
  let files = []
  if (index) {
    const { frontMatter } = parse(file, { readFile: true, parseContent: false })
    if (isVisibleByFm.call(this, frontMatter)) {
      if (frontMatter.pages && frontMatter.pages.length > 0) files = map(frontMatter.pages, p => `${dir}/${p}`)
      else files = getAll(dir)
    }
  } else files = getAll(dir)
  files = filter(files, f => {
    const byType = types.includes(path.extname(f))
    const byVisibility = isVisible.call(this, f)
    return byType && byVisibility
  })
  return files
}
