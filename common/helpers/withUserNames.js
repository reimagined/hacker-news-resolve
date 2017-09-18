async function withUserNames(items, getReadModel) {
  const users = await getReadModel('users')

  items.forEach(item => {
    const user = users.find(user => user.id === item.createdBy)
    item.createdByName = user ? user.name : 'unknown'
  })

  return items
}

export default withUserNames
