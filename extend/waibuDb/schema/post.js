async function post () {
  const { routePath } = this.app.waibu
  return {
    common: {
      attachment: true,
      layout: [
        { name: 'meta', fields: ['id:3-md', 'createdAt:3-md', 'updatedAt:3-md', 'status:3-md'] },
        { name: 'general', fields: ['title:12-md', 'subTitle:9-md', 'category:3-md', 'excerpt', 'content'] }
      ],
      widget: {
        content: {
          attr: {
            rows: 10
          }
        },
        category: {
          addons: [{
            attr: {
              'x-data': true,
              '@click': `location.href='${routePath('waibuAdmin:/cms/post-cat/add')}'`,
              icon: 'add'
            },
            type: 'button',
            position: 'append'
          }]
        }
      }
    },
    view: {
      list: {
        fields: ['id', 'title', 'category', 'status', 'createdAt', 'updatedAt'],
        stat: {
          aggregate: [
            { fields: ['status'], group: 'status', aggregate: ['count'] },
            { fields: ['category'], group: 'category', aggregate: ['count'] }
          ]
        }
      },
      add: {
        hidden: ['id']
      },
      edit: {
        readonly: ['id']
      }
    }
  }
}

export default post
