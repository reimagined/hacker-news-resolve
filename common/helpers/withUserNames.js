async function withUserNames(items, getReadModel) {
  const userNames = (await Promise.all(
    items.map(({ createdBy }) => getReadModel('users', [createdBy]))
  )).map(([{ name }]) => name)

  items.forEach((item, index) => {
    item.createdByName = userNames[index]
  })

  return items
}

export default withUserNames
