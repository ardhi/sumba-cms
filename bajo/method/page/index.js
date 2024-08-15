function pageIndex (file, base, req) {
  if (file === base) return
  return this.pageDetails(base, base, req)
}

export default pageIndex
