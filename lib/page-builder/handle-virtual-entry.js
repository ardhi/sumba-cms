async function handleVirtualEntry (req, reply, docs) {
  const { eachPlugins, getPluginFile } = this.app.bajo
  const { fs } = this.lib
  const { map } = this.lib._
  const { renderString } = this.app.waibuMpa
  const opts = { ext: '.md', layout: 'sumbaCms:/page.html' }
  const items = []
  await eachPlugins(async function () {
    if (!items.includes(this.name)) items.push(this.name)
  }, { glob: docs ? 'docs/*' : 'pages/*', prefix: docs ? '' : this.name })
  const text = fs.readFileSync(getPluginFile('sumbaCms:/lib/template/dir.md'), 'utf8')
  const children = map(items, item => {
    const plugin = this.app[item]
    const permalink = this.routePath(`${item}.${docs ? 'doc' : 'virtualpage'}:/`)
    const title = plugin.title
    const isDir = true
    return { permalink, title, isDir }
  })
  const page = {
    type: docs ? 'docs' : 'pages',
    main: {},
    children,
    siblings: []
  }
  reply.header('Content-Type', `text/html; charset=${this.app.waibuMpa.config.page.charset}`)
  reply.header('Content-Language', req.lang)
  return await renderString(text, { page }, reply, opts)
}

export default handleVirtualEntry
