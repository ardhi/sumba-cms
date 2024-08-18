async function pageRouteRedirect (isPluginBase) {
  const { trim } = this.app.bajo.lib._
  let url = '/' + trim(`${this.config.prefix}/${this.config.page.prefix}`, '/')
  if (isPluginBase) url += this.app.waibu.config.prefixVirtual
  await this.instance.route({
    method: 'GET',
    url,
    handler: function (req, reply) {
      reply.redirect(url + '/')
    }
  })
}

export default pageRouteRedirect
