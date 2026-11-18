export default {
  url: async function () {
    const { prefix, route } = this.config.page
    return `/${prefix}/${route}`
  },
  handler: async function (req, reply) {
    throw this.error('_notFound')
  }
}
