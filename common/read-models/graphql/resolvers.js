export default {
  user: async (store, { id, name }) => {
    const users = await store.collection('users')

    return id ? await users.findOne({ id }) : await users.findOne({ name })
  },
  me: (store, _, { getJwtValue }) => {
    try {
      return getJwtValue()
    } catch (e) {
      return null
    }
  },
  stories: async (store, { type, first = 0, offset }) => {
    const stories = await store.collection('stories')
    const count = type ? await stories.count({ type }) : await stories.count({})

    return (type
      ? await stories
          .find({ type })
          .skip(Math.max(count - first - offset, 0))
          .limit(offset)
      : await stories
          .find({})
          .skip(Math.max(count - first - offset, 0))
          .limit(offset)
    ).reverse()
  },
  comments: async (store, { first = 0, offset }) => {
    const comments = await store.collection('comments')
    const count = await comments.count({})

    return (await comments
      .find({})
      .skip(Math.max(count - first - offset, 0))
      .limit(offset)).reverse()
  }
}
