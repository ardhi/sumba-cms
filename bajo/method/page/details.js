import path from 'path'
const statProps = ['size', 'mtime', 'birthtime']

function pageDetails (file, base, req, { removeExt = true, active } = {}) {
  const { titleize, parseObject } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { trim, pick, last } = this.app.bajo.lib._
  const { parse } = this.app.bajoMarkdown
  const types = ['', ...this.types]

  let route = trim(file.replace(base, ''), '/')
  if (removeExt) {
    for (const t of types) route = route.replace(t, '')
  }
  const isDir = path.extname(file) === ''
  let title = titleize(last(route.split('/')))
  if (title === '') title = req.params.ns
  if (!isDir) {
    const parsed = parse(file, { readFile: true, parseContent: false })
    const frontMatter = parseObject(parsed.frontMatter, { parseValue: true, i18n: req.i18n, plugin: this })
    if (frontMatter.title) title = frontMatter.title
  }
  return {
    title,
    active,
    route,
    permalink: this.routePath(`${req.params.ns}.page:/${route}`),
    isDir,
    file,
    stat: pick(fs.statSync(file), statProps)
  }
}

export default pageDetails
