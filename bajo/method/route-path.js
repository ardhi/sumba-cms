function routePath (name) {
  const { breakNsPath, getPlugin } = this.app.bajo
  const { trim } = this.app.bajo.lib._

  const [ns, path, subNs] = breakNsPath(name)
  const plugin = getPlugin(ns)
  const fullPath = `${this.config.prefix}/${subNs}/${plugin.alias}/${path}`
  return `/${trim(fullPath.replaceAll('//', '/'), '/')}`
}

export default routePath
