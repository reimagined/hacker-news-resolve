async function withUserNames(items, getReadModel) {
  const users = await getReadModel('users')

  return items.map(item => {
    const user = users.find(user => user.id === item.createdBy)

    return {
      ...item,
      createdByName: user ? user.name : 'unknown'
    }
  })
}

export default withUserNames
