import path from 'path'

async function handler (req, reply) {
  const { getPluginDataDir, getPlugin, importPkg, importModule } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { renderString } = this.app.waibuMpa
  const mime = await importPkg('waibu:mime')
  const buildLocals = await importModule('waibuMpa:/lib/build-locals.js')

  const [alias, ...rest] = req.params['*'].split('/')
  let base = `${getPluginDataDir(this.name)}/pages`
  try {
    const plugin = getPlugin(alias)
    const check = `${plugin.dir.pkg}/${this.name}/pages`
    if (fs.existsSync(check)) {
      base = check
      req.params['*'] = rest.join('/')
    }
  } catch (err) {}
  const info = await this.getPathInfo(req, base)
  const ext = path.extname(info.main.file)
  const mimeType = mime.getType(ext) ?? `text/html; charset=${this.app.waibuMpa.config.page.charset}`
  reply.header('Content-Type', mimeType)
  reply.header('Content-Language', req.lang)
  const text = fs.readFileSync(info.main.file, 'utf8')
  if (info.type === 'asset') return text
  const locals = await buildLocals.call(this, info.main.file, info, reply)
  return await renderString(text, locals, reply, { partial: true, ext: path.extname(info.main.file) })
}

async function buildRoutes (ctx, prefix) {
  await ctx.route({
    url: '/*',
    method: 'GET',
    handler: handler.bind(this)
  })
}

export default buildRoutes
