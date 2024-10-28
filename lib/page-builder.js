import path from 'path'
import handleTocEntry from './page-builder/handle-toc-entry.js'
import handleVirtualEntry from './page-builder/handle-virtual-entry.js'

async function handlePage (req, reply, { virtual = false, docs = false } = {}) {
  const { getPlugin, getPluginFile, getPluginDataDir, importPkg } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { trim } = this.app.bajo.lib._
  const { renderString } = this.app.waibuMpa
  const { parse } = this.app.bajoMarkdown
  const mime = await importPkg('waibu:mime')

  let base = `${getPluginDataDir(this.name)}/pages`
  if (docs || virtual) {
    const [alias, ...args] = req.params['*'].split('/')
    const plugin = getPlugin(alias, true)
    if (plugin) {
      req.params.ns = plugin.name
      req.params['*'] = args.join('/')
      base = `${plugin.dir.pkg}/${docs ? 'docs' : (this.name + '/pages')}`
    } else return handleVirtualEntry.call(this, req, reply, docs)
  } else req.params.ns = this.name

  req.params.docs = docs
  req.params['*'] = trim(req.params['*'], '/')
  const page = await this.pageInfo(req, base)
  if (page.toc) return await handleTocEntry.call(this, req, reply, page)
  let ext = path.extname(page.main.file)
  let mimeType = mime.getType(ext)
  if (!mimeType || mimeType === 'text/markdown') mimeType = `text/html; charset=${this.app.waibuMpa.config.page.charset}`

  reply.header('Content-Type', mimeType)
  reply.header('Content-Language', req.lang)
  if (page.type === 'assets') return fs.readFileSync(page.file)

  let text = ''

  if (page.main.isDir) {
    const file = page.main.file + '/_index.md'
    const index = fs.existsSync(file)
    if (index) text = parse(file, { readFile: true, parseContent: false }).content
    else text = fs.readFileSync(getPluginFile('sumbaCms:/lib/template/dir.md'), 'utf8')
    ext = '.md'
  } else text = fs.readFileSync(page.main.file, 'utf8')
  const opts = { ext, layout: 'sumbaCms:/page.html' }
  if (docs) opts.renderComponent = false
  return await renderString(text, { page }, reply, opts)
}

function pageBuilder ({ virtual = false, docs = false } = {}) {
  let url = `/${this.config.page.prefix}`
  if (virtual) url += `/${this.app.waibu.config.prefixVirtual}`
  if (docs) url = `/${this.config.page.prefixDocs}`
  const me = this
  return {
    url: url + '/*',
    method: 'GET',
    config: {
      type: docs ? 'docs' : 'page',
      virtual,
      webApp: this.app.waibuMpa.name,
      ns: this.name
    },
    handler: async function (req, reply) {
      return await handlePage.call(me, req, reply, { virtual, docs })
    }
  }
}

export default pageBuilder
