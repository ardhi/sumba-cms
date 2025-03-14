import path from 'path'
import { isVisibleByFm } from '../page/_lib.js'

const statProps = ['size', 'mtime', 'birthtime']

function postDetails (file, req) {
  const { titleize, parseObject, getPluginDataDir } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { pick } = this.app.bajo.lib._
  const { parse } = this.app.bajoMarkdown
  const base = `${getPluginDataDir(this.name)}/posts`
  const ext = path.extname(file)
  const route = file.slice(0, file.length - ext.length).replace(base, '')

  let title = titleize(path.basename(file))
  const parsed = parse(file, { readFile: true, parseContent: false })
  const frontMatter = parseObject(parsed.frontMatter, { parseValue: true, lang: req.lang, ns: this.name })
  if (frontMatter.title) title = frontMatter.title
  if (!isVisibleByFm.call(this, frontMatter, req)) return
  const permalink = this.routePath(`${this.name}.post:${route}`)
  return {
    title,
    route,
    permalink,
    file,
    stat: pick(fs.statSync(file), statProps)
  }
}

export default postDetails
