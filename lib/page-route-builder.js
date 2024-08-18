import path from 'path'

async function handlerVirtualToc (req, reply) {
  const { eachPlugins, getPluginFile } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { map } = this.app.bajo.lib._
  const { renderString } = this.app.waibuMpa
  const opts = { ext: '.md', layout: 'sumbaCms:/default.html' }
  const items = []
  await eachPlugins(async function () {
    if (!items.includes(this.name)) items.push(this.name)
  }, { glob: 'pages/*', prefix: this.name })
  const text = fs.readFileSync(getPluginFile('sumbaCms:/lib/template/dir.md'), 'utf8')
  const children = map(items, item => {
    const plugin = this.app[item]
    const permalink = this.routePath(`${item}.virtualpage:/`)
    const title = plugin.title
    const isDir = true
    return { permalink, title, isDir }
  })
  const page = {
    type: 'pages',
    main: {},
    children,
    siblings: []
  }
  reply.header('Content-Type', `text/html; charset=${this.app.waibuMpa.config.page.charset}`)
  reply.header('Content-Language', req.lang)
  return await renderString(text, { page }, reply, opts)
}

async function handlerPage (req, reply, isPluginBase) {
  const { getPlugin, getPluginFile, getPluginDataDir, importPkg } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { trim } = this.app.bajo.lib._
  const { renderString } = this.app.waibuMpa
  const { parse } = this.app.bajoMarkdown
  const mime = await importPkg('waibu:mime')

  let base = `${getPluginDataDir(this.name)}/pages`
  if (isPluginBase) {
    const [alias, ...args] = req.params['*'].split('/')
    const plugin = getPlugin(alias, true)
    if (plugin) {
      req.params.ns = plugin.name
      req.params['*'] = args.join('/')
      base = `${plugin.dir.pkg}/${this.name}/pages`
    } else return handlerVirtualToc.call(this, req, reply)
  } else req.params.ns = this.name
  req.params['*'] = trim(req.params['*'], '/')
  const page = await this.pageInfo(req, base)
  let ext = path.extname(page.main.file)
  let mimeType = mime.getType(ext)
  if (!mimeType || mimeType === 'text/markdown') mimeType = `text/html; charset=${this.app.waibuMpa.config.page.charset}`

  reply.header('Content-Type', mimeType)
  reply.header('Content-Language', req.lang)
  if (page.type === 'assets') return fs.readFileSync(page.file)

  let text = ''
  if (page.main.isDir) {
    const file = page.main.file + '/index.md'
    const index = fs.existsSync(file)
    if (index) text = parse(file, { readFile: true, parseContent: false }).content
    else text = fs.readFileSync(getPluginFile('sumbaCms:/lib/template/dir.md'), 'utf8')
    ext = '.md'
  } else text = fs.readFileSync(page.main.file, 'utf8')
  const opts = { ext, layout: 'sumbaCms:/default.html' }
  return await renderString(text, { page }, reply, opts)
}

function pageRouteBuilder (isPluginBase) {
  const prefix = isPluginBase ? `/${this.app.waibu.config.prefixVirtual}` : ''
  const me = this
  return {
    url: `/${this.config.page.prefix}${prefix}/*`,
    method: 'GET',
    config: {
      virtual: isPluginBase,
      engine: this.app.waibuMpa.name,
      ns: this.name
    },
    handler: async function (req, reply) {
      return await handlerPage.call(me, req, reply, isPluginBase)
    }
  }
}

export default pageRouteBuilder
