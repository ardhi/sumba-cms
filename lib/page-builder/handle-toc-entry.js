async function handleTocEntry (req, reply, info) {
  const { renderString } = this.app.waibuMpa
  const data = Buffer.from(JSON.stringify(info.toc)).toString('base64')
  const text = `<c:tree data="${data}" />`
  const page = {
    type: 'pages',
    main: {},
    children: [],
    siblings: []
  }
  reply.header('Content-Type', `text/html; charset=${this.app.waibuMpa.config.page.charset}`)
  reply.header('Content-Language', req.lang)
  const opts = { ext: '.html', layout: 'sumbaCms:/default.html' }
  return await renderString(text, { page }, reply, opts)
}

export default handleTocEntry
