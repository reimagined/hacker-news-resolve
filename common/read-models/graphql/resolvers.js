async function withUserNames(items, store) {
  const users = await store.collection('users')

  return await Promise.all(
      items.map(async (item) => {
          const user = await users.findOne({ id: item.createdBy })
          return {
            ...item,
            createdByName: user ? user.name : 'unknown'
          }
      })
  );
}

function getReplies(comments, commentIndex) {
  const result = []
  const commentsCount = comments.length
  let replyIndex = commentIndex + 1

  while (replyIndex < commentsCount) {
    result.push(comments[replyIndex])
    replyIndex++
  }

  return result
}

export default {
  user: async (store, { id, name }) => {
    const users = await store.collection('users')

    return id
      ? users.find({ id })
      : users.find({ name })
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
      ? await stories.find({ type }).skip(offset).limit(first)
      : await stories.find({}).skip(offset).limit(first)

    return await withUserNames(filteredStories, store)
  },
  story: async (store, { id }) => {
    const stories = await store.collection('stories')

    let story = (await stories.findOne({ id }));

    if (!story) {
      return null
    }

    story = (await withUserNames([story], store))[0]
    story.comments = await withUserNames(story.comments, store)
    return story
  },
  comment: async (store, { id }) => {
    const comments = await store.collection('comments')

    const comment = (await comments.findOne({ id }));

    const [resultComment] = await withUserNames([comment], store)
    //const replies = getReplies(comments, comment.id)

    return {
      ...resultComment,
      replies: []//await withUserNames(replies, store)
    }
  },
  comments: async (store, { first, offset = 0 }) => {
    const comments = await store.collection('comments')

    const result = await comments.find({}).skip(offset).limit(first)

    return await withUserNames(result, store)
  }
}
