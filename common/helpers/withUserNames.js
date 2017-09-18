async function withUserNames(items, getReadModel) {
  const users = await Promise.all(
    items.map(({ createdBy }) => getReadModel('users', [createdBy]))
  )

  const userNames = users.map(([{ name }]) => name)

  items.forEach((item, index) => {
    item.createdByName = userNames[index]
  })

  return items
}

export default withUserNames
