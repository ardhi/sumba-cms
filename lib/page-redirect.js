async function pageRedirect ({ virtual = false, docs = false } = {}) {
  const { trim } = this.app.bajo.lib._
  const { getAppPrefix } = this.app.waibu
  const prefix = getAppPrefix(this.name)
  let url = '/' + trim(`${prefix}/${this.config.page.prefix}`, '/')
  if (virtual) url += '/' + this.app.waibu.config.prefixVirtual
  if (docs) url = '/' + trim(`${prefix}/${this.config.page.prefixDocs}`, '/')

  await this.instance.route({
    method: 'GET',
    url,
    handler: function (req, reply) {
      reply.redirect(url + '/')
    }
  })
}

export default pageRedirect
