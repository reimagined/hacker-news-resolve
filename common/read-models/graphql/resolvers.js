import jwt from 'jsonwebtoken'

export default {
  user: async (store, { id, name }) => {
    return id
      ? await store.hget('users_id', id)
      : await store.hget('users_name', name)
  },
  me: (store, _, { jwtToken }) => {
    try {
      return jwt.verify(jwtToken, process.env.JWT_SECRET)
    } catch (e) {
      return null
    }
  },
  stories: async (store, { type = 'story', first = 0, offset }) => {
    const stories = await store.hget('stories', type)
    if (!stories) {
      return []
    }
    const begin = first >= 0 ? first : 0
    return stories.slice(begin, begin + offset)
  },
  comments: async (store, { first = 0, offset }) => {
    const comments = await store.hget('comments', 'all')
    if (!comments) {
      return []
    }
    const begin = first >= 0 ? first : 0
    return comments.slice(begin, begin + offset)
  }
}
