async function model () {
  return [{
    baseName: 'post',
    properties: [
      'title,,255,true,true',
      'subTitle,,255,true',
      {
        name: 'category',
        type: 'string',
        maxLength: 50,
        index: true,
        values: async function ({ req } = {}) {
          const { getModel } = this.app.dobo
          const model = await getModel('CmsPostCat')
          const opts = { req, noMagic: true, dataOnly: true, fields: ['name'] }
          const results = await model.findAllRecords({ sort: { level: 1, name: 1 } }, opts)
          return results.map(r => r.name)
        }
      },
      'excerpt,text',
      'content,text,,,true'
    ],
    features: [
      'dobo:createdAt',
      'dobo:updatedAt',
      'sumba:siteId',
      { name: 'sumba:slug', fieldSource: 'title' },
      { name: 'sumba:status', default: 'DRAFT', values: ['PUBLISHED', 'INACTIVE', 'DRAFT'] }
    ]
  }]
}

export default model
