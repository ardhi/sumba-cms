function routePath (name) {
  const { breakNsPath, getPlugin } = this.app.bajo
  const { getPluginPrefix } = this.app.waibu
  const { trim } = this.app.bajo.lib._

  const { ns, path, subNs } = breakNsPath(name)
  const plugin = getPlugin(ns)
  const prefix = getPluginPrefix(this.name)
  let fullPath = `${prefix}/${subNs}/${path}`
  if (subNs === 'doc') {
    fullPath = `${prefix}/${this.config.page.prefixDocs}/${plugin.alias}/${path}`
  } else if (subNs.startsWith('virtual')) {
    fullPath = `${prefix}/${subNs.slice(7)}` +
      `/${this.app.waibu.config.prefixVirtual}/${plugin.alias}/${path}`
  }
  return `/${trim(fullPath.replaceAll('//', '/'), '/')}`
}

export default routePath
