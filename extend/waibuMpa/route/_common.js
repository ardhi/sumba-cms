export const dynHooks = [{
  name: 'afterFindRecord',
  handler: async function (filter, result, options) {
    await this.plugin.formatPostItem.call(this, result)
  }
}, {
  name: 'afterFindAllRecord',
  handler: async function (filter, result, options) {
    await this.plugin.formatPostItem.call(this, result)
  }
}]
