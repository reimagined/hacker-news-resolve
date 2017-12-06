async function getCommentTree(comments, id, tree = []) {
  const comment = await comments.findOne({ id })
  tree.push(comment)

  const childComments = await comments.find({ parentId: comment.id })
  return await Promise.all(
    childComments.map(childComment =>
      getCommentTree(comments, childComment.id, tree)
    )
  )
}

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
  stories: async (store, { type, first, offset = 0 }) => {
    const stories = await store.collection('stories')

    return type
      ? await stories
          .find({ type })
          .skip(offset)
          .limit(first)
      : await stories
          .find({})
          .skip(offset)
          .limit(first)
  },
  comment: async (store, { id }) => {
    const comments = await store.collection('comments')

    const tree = []
    await getCommentTree(comments, id, tree)

    return {
      ...tree[0],
      replies: tree.slice(1)
    }
  },
  comments: async (store, { first, offset = 0 }) => {
    const comments = await store.collection('comments')

    return await comments
      .find({})
      .skip(offset)
      .limit(first)
  }
}
