const action = {
  method: ['GET', 'POST'],
  title: 'post',
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const crudSkel = await importModule('waibuAdmin:/lib/crud-skel.js')
    return await crudSkel.call(this, 'CmsPost', req, reply)
  }
}

export default action
