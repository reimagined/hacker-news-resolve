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

  it('comment by id', async () => {
    const users = [{ id: 'user-id', name: 'username' }]

    const comments = [
      { id: 'comment-id', createdBy: 'user-id' },
      { id: 'comment-id-2', parentId: 'comment-id', createdBy: 'user-id' }
    ]

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

    const result = await gqlResolvers.comment(read, { id: 'comment-id' })

    expect(result).toEqual({
      id: 'comment-id',
      createdBy: 'user-id',
      createdByName: 'username',
      replies: [
        {
          id: 'comment-id-2',
          parentId: 'comment-id',
          createdBy: 'user-id',
          replies: []
        }
      ]
    })
  })

  it('nonexistent comment', async () => {
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

    const result = await gqlResolvers.comment(read, { id: 'comment-id-2' })

    expect(result).toEqual(null)
  })

  it('user by id', async () => {
    const users = [
      { name: 'user-1', id: 'id-1' },
      { name: 'user-2', id: 'id-2' }
    ]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'users':
            return users
        }
      }
    })

    const result = await gqlResolvers.user(read, { id: 'id-2' })
    expect(result).toEqual({ name: 'user-2', id: 'id-2' })
  })

  it('user by name', async () => {
    const users = [
      { name: 'user-1', id: 'id-1' },
      { name: 'user-2', id: 'id-2' }
    ]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'users':
            return users
        }
      }
    })

    const result = await gqlResolvers.user(read, { name: 'user-2' })
    expect(result).toEqual({ name: 'user-2', id: 'id-2' })
  })

  it('story by id', async () => {
    const stories = [
      { name: 'story-1', id: 'id-1' },
      { name: 'story-2', id: 'id-2', createdBy: 'user-id' }
    ]

    const users = [{ name: 'user', id: 'user-id' }]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'stories':
            return stories
          case 'users':
            return users
        }
      }
    })

    const query = {
      fieldNodes: [
        {
          selectionSet: {
            selections: []
          }
        }
      ]
    }

    const result = await gqlResolvers.story(read, { id: 'id-2' }, {}, query)

    expect(result).toEqual({
      name: 'story-2',
      id: 'id-2',
      createdBy: 'user-id',
      createdByName: 'user'
    })
  })

  it('nonexistent story', async () => {
    const stories = [{ name: 'story-1', id: 'id-1' }]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'stories':
            return stories
        }
      }
    })

    const result = await gqlResolvers.story(read, { id: 'id-2' })
    expect(result).toEqual(null)
  })

  it('story with comments', async () => {
    const stories = [
      { name: 'story-1', id: 'id-1' },
      { name: 'story-2', id: 'id-2', createdBy: 'user-id' }
    ]

    const users = [{ name: 'user', id: 'user-id' }]

    const comments = [
      { name: 'story-1', id: 'comment-id-1', storyId: 'id-1' },
      {
        name: 'story-2',
        id: 'comment-id-2',
        storyId: 'id-2',
        createdBy: 'user-id'
      }
    ]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'stories':
            return stories
          case 'users':
            return users
          case 'comments':
            return comments
        }
      }
    })

    const query = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              {
                name: {
                  value: 'comments'
                }
              }
            ]
          }
        }
      ]
    }

    const result = await gqlResolvers.story(read, { id: 'id-2' }, {}, query)

    expect(result).toEqual({
      name: 'story-2',
      id: 'id-2',
      createdBy: 'user-id',
      createdByName: 'user',
      comments: [
        {
          id: 'comment-id-2',
          name: 'story-2',
          storyId: 'id-2',
          createdBy: 'user-id',
          createdByName: 'user'
        }
      ]
    })
  })

  it('stories', async () => {
    const stories = [
      { name: 'story-1', id: 'id-1', type: 'ask' },
      { name: 'story-2', id: 'id-2', createdBy: 'user-id', type: 'show' }
    ]

    const users = [{ name: 'user', id: 'user-id' }]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'stories':
            return stories
          case 'users':
            return users
        }
      }
    })

    const result = await gqlResolvers.stories(read, { page: 1, type: 'show' })

    expect(result).toEqual([
      {
        name: 'story-2',
        id: 'id-2',
        type: 'show',
        createdBy: 'user-id',
        createdByName: 'user'
      }
    ])
  })

  it('stories with no type argument', async () => {
    const stories = [
      { name: 'story-1', id: 'id-1', type: 'ask' },
      { name: 'story-2', id: 'id-2', createdBy: 'user-id', type: 'show' }
    ]

    const users = [{ name: 'user', id: 'user-id' }]

    const read = async () => ({
      get: collectionName => {
        switch (collectionName) {
          case 'stories':
            return stories
          case 'users':
            return users
        }
      }
    })

    const result = await gqlResolvers.stories(read, { page: 1 })

    expect(result).toEqual([
      {
        id: 'id-1',
        name: 'story-1',
        type: 'ask',
        createdByName: 'unknown'
      },
      {
        name: 'story-2',
        id: 'id-2',
        type: 'show',
        createdBy: 'user-id',
        createdByName: 'user'
      }
    ])
  })
})
