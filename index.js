async function factory (pkgName) {
  const me = this

  return class SumbaCms extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'cms'
      this.dependencies = ['waibu-mpa']
      this.config = {
        waibu: {
          prefix: ''
        },
        page: {
          prefix: 'page'
        },
        post: {
          prefix: 'post',
          route: '/:year/:month/:date/:slug'
        }
      }
    }
  }
}

export default factory
