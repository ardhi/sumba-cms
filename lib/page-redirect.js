async function pageRedirect ({ virtual = false, docs = false } = {}) {
  const { trim } = this.app.bajo.lib._
  let url = '/' + trim(`${this.config.prefix}/${this.config.page.prefix}`, '/')
  if (virtual) url += '/' + this.app.waibu.config.prefixVirtual
  if (docs) url = '/' + trim(`${this.config.prefix}/${this.config.page.prefixDocs}`, '/')

  await this.instance.route({
    method: 'GET',
    url,
    handler: function (req, reply) {
      reply.redirect(url + '/')
    }
  })
}

export default pageRedirect
