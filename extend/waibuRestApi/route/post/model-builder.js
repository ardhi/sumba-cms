async function modelBuilder () {
  return {
    model: 'CmsPost',
    disabled: ['create', 'update', 'remove']
  }
}

export default modelBuilder
