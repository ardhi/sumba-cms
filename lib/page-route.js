import path from 'path'

async function handler (req, reply) {
  const { getPluginDataDir, getPlugin, getPluginFile, importPkg } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { renderString } = this.app.waibuMpa
  const { parse } = this.app.bajoMarkdown
  const mime = await importPkg('waibu:mime')

  const [alias, ...rest] = req.params['*'].split('/')
  req.params.ns = this.name
  let base = `${getPluginDataDir(this.name)}/pages`
  try {
    const plugin = getPlugin(alias)
    const check = `${plugin.dir.pkg}/${this.name}/pages`
    if (fs.existsSync(check)) {
      base = check
      req.params['*'] = rest.join('/')
      req.params.ns = plugin.name
    }
  } catch (err) {}
  const info = await this.pageInfo(req, base)
  let ext = path.extname(info.main.file)
  let mimeType = mime.getType(ext)
  if (!mimeType || mimeType === 'text/markdown') mimeType = `text/html; charset=${this.app.waibuMpa.config.page.charset}`
  reply.header('Content-Type', mimeType)
  reply.header('Content-Language', req.lang)
  if (info.type === 'assets') return fs.readFileSync(info.file)
  let text = ''
  if (info.main.isDir) {
    const file = info.main.file + '/index.md'
    const index = fs.existsSync(file)
    if (index) text = parse(file, { readFile: true, parseContent: false }).content
    else text = fs.readFileSync(getPluginFile('sumbaCms:/lib/template/dir.md'), 'utf8')
    ext = '.md'
  } else text = fs.readFileSync(info.main.file, 'utf8')
  const opts = { ext, layout: 'sumbaCms:/default.html' }
  return await renderString(text, { page: info }, reply, opts)
}

async function pageRoute (ctx) {
  await ctx.route({
    url: `/${this.config.page.prefix}/*`,
    method: 'GET',
    config: {
      engine: this.app.waibuMpa.name,
      ns: this.name
    },
    handler: handler.bind(this)
  })
}

export default pageRoute
