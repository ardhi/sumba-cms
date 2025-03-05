import path from 'path'
const statProps = ['size', 'mtime', 'birthtime']

function pageDetails (file, base, req, { removeExt = true, active, originalBase, props = [] } = {}) {
  const { titleize, parseObject } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { trim, pick, last } = this.app.bajo.lib._
  const { parse } = this.app.bajoMarkdown
  const types = ['', ...this.types]

  let route = trim(file.replace(originalBase ?? base, ''), '/')
  if (removeExt) {
    for (const t of types) route = route.replace(t, '')
  }
  const isDir = path.extname(file) === ''
  let title = titleize(last(route.split('/')))
  if (title === '') title = req.params.ns
  if (!isDir) {
    const parsed = parse(file, { readFile: true, parseContent: false })
    const frontMatter = parseObject(parsed.frontMatter, { parseValue: true, lang: req.lang, ns: this.name })
    if (frontMatter.title) title = frontMatter.title
  }
  let subNs = req.routeOptions.config.virtual ? 'virtualpage' : 'page'
  if (req.params.docs) subNs = 'doc'
  const permalink = this.routePath(`${req.params.ns}.${subNs}:/${route}`)
  const result = {
    title,
    active,
    route,
    permalink,
    isDir,
    file,
    stat: pick(fs.statSync(file), statProps)
  }
  return props.length === 0 ? result : pick(result, props)
}

export default pageDetails
