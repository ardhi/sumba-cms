async function handler (req, reply) {
  /*
  const { getPluginDataDir } = this.app.bajo
  const base = `${getPluginDataDir(this.name)}/pages`
  const info = await this.getPathInfo(req, base)
  return info
  */
  return this.breakPath(req.params['*'])
}

async function dataRoutes () {
  await this.instance.route({
    url: '/*',
    method: 'GET',
    handler: handler.bind(this)
  })
}

export default dataRoutes
