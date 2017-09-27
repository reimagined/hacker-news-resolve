import '../../common/read-models'
import gqlResolvers from '../../common/read-models/gqlResolvers'

describe('gql-resolvers', () => {
  it('comments', async () => {
    const users = [{ id: 'user-id', name: 'username' }]
    const comments = [{ id: 'comment-id', createdBy: 'user-id' }]
    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'users':
            return users
          case 'comments':
            return comments
          default:
            throw Error()
        }
      }
    })

    const result = await gqlResolvers.comments(read, { page: 1 })

    expect(result).toEqual([
      { id: 'comment-id', createdBy: 'user-id', createdByName: 'username' }
    ])
  })

  it('gqlResolver with name', async () => {
    const users = [{ name: 'user-1' }, { name: 'user-2' }]
    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'users':
            return users
        }
      }
    })

    const result = await gqlResolvers.users(read, { name: 'user-1' })

    expect(result).toEqual([{ name: 'user-1' }])
  })

  it('gqlResolver with id', async () => {
    const users = [
      { name: 'user-1', id: 'id-1' },
      { name: 'user-2', id: 'id-1' }
    ]
    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'users':
            return users
        }
      }
    })

    const result = await gqlResolvers.users(read, { id: 'id-1' })

    expect(result).toEqual([{ name: 'user-1', id: 'id-1' }])
  })
})
