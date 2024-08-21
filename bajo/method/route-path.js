function routePath (name) {
  const { breakNsPath, getPlugin } = this.app.bajo
  const { trim } = this.app.bajo.lib._

  const { ns, path, subNs } = breakNsPath(name)
  const plugin = getPlugin(ns)
  let fullPath = `${this.config.prefix}/${subNs}/${path}`
  if (subNs === 'doc') {
    fullPath = `${this.config.prefix}/${this.config.page.prefixDocs}/${plugin.alias}/${path}`
  } else if (subNs.startsWith('virtual')) {
    fullPath = `${this.config.prefix}/${subNs.slice(7)}` +
      `/${this.app.waibu.config.prefixVirtual}/${plugin.alias}/${path}`
  }
  return `/${trim(fullPath.replaceAll('//', '/'), '/')}`
}

export default routePath
