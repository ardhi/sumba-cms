import path from 'path'

export function isVisibleByFm (frontMatter, req = {}) {
  const { env } = this.app.bajo.config
  req.params = req.params ?? {}
  return req.params.docs || frontMatter.status === 'PUBLISHED' || (frontMatter.status === 'DRAFT' && env === 'dev')
}

export function isVisible (file, req = {}) {
  const { parse } = this.app.bajoMarkdown
  const { fs } = this.lib
  req.params = req.params ?? {}

  if (path.extname(file) === '') {
    const dir = `${file}/_index.md`
    if (!fs.existsSync(dir)) return true
    file = dir
  }
  const { frontMatter } = parse(file, { readFile: true, parseContent: false })
  return isVisibleByFm.call(this, frontMatter, req)
}

export function getFiles (dir, req = {}) {
  const { fs, fastGlob } = this.lib
  const { filter, map } = this.lib._
  const { parse } = this.app.bajoMarkdown
  const types = ['', ...this.types]
  req.params = req.params ?? {}

  function getAll (d) {
    const pattern = [`${d}/*`, `!${d}/_index.md`]
    return fastGlob.globSync(pattern, { onlyFiles: false })
  }

  const file = `${dir}/_index.md`
  const index = fs.existsSync(file)
  let files = []
  if (index) {
    const { frontMatter } = parse(file, { readFile: true, parseContent: false })
    if (isVisibleByFm.call(this, frontMatter)) {
      if (frontMatter.pages && frontMatter.pages.length > 0) files = map(frontMatter.pages, p => `${dir}/${p}`)
      else files = getAll(dir)
    }
  } else files = getAll(dir)
  return filter(files, f => {
    const byType = types.includes(path.extname(f))
    const byVisibility = req.params.docs || isVisible.call(this, f)
    return byType && byVisibility
  })
}
