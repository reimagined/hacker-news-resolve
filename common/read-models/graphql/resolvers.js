async function withUserNames(items, store) {
  const users = await store.collection('users')

  return await Promise.all(
    items.map(async item => {
      const user = await users.findOne({ id: item.createdBy })
      return {
        ...item,
        createdByName: user ? user.name : 'unknown'
      }
    })
  )
}

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
  me: (store, _, { getJwt }) => {
    try {
      return getJwt()
    } catch (e) {
      return null
    }
  },
  stories: async (store, { type, first, offset = 0 }) => {
    const stories = await store.collection('stories')

    const filteredStories = type
      ? await stories
          .find({ type })
          .skip(offset)
          .limit(first)
      : await stories
          .find({})
          .skip(offset)
          .limit(first)

    return await withUserNames(filteredStories, store)
  },
  comment: async (store, { id }) => {
    const comments = await store.collection('comments')

    const tree = []
    await getCommentTree(comments, id, tree)

    const result = await withUserNames(tree, store)

    return {
      ...result[0],
      replies: result.slice(1)
    }
  },
  comments: async (store, { first, offset = 0 }) => {
    const comments = await store.collection('comments')

    const result = await comments
      .find({})
      .skip(offset)
      .limit(first)

    return await withUserNames(result, store)
  }
}
