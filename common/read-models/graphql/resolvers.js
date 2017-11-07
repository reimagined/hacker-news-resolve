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
  user: async (read, { id, name }) => {
    const root = await read('users')

    return id
      ? root.find(user => user.id === id)
      : root.find(user => user.name === name)
  },
  stories: async (read, { type, first, offset = 0 }) => {
    const root = await read('stories')

    const filteredStories = type
      ? root.filter(story => story.type === type).reverse()
      : root.reverse()

    const stories = filteredStories.slice(offset, offset + first)

    return withUserNames(stories, read)
  },
  story: async (read, { id }) => {
    const root = await read('stories')

    let story = root.find(s => s.id === id)

    if (!story) {
      return null
    }

    story = (await withUserNames([story], read))[0]
    story.comments = await withUserNames(story.comments, read)
    return story
  },
  comment: async (read, { id }) => {
    const root = await read('comments')

    const commentIndex = root.findIndex(c => c.id === id)

    if (commentIndex === -1) {
      return null
    }

    const comment = root[commentIndex]
    const [resultComment] = await withUserNames([comment], read)
    const replies = getReplies(root, commentIndex)

    return {
      ...resultComment,
      replies: await withUserNames(replies, read)
    }
  },
  comments: async (read, { first, offset = 0 }) => {
    const root = await read('comments')

    const comments = root.slice(offset, offset + first).reverse()

    return withUserNames(comments, read)
  }
}
