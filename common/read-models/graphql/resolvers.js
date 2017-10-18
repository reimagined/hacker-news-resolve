import { NUMBER_OF_ITEMS_PER_PAGE } from '../../constants'

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
  const comment = comments[commentIndex]
  let replyIndex = commentIndex + 1

  while (replyIndex < commentsCount) {
    result.push(comments[replyIndex])
    replyIndex++
  }

  return result
}

export default {
  stories: async (read, { page, type }) => {
    const root = await read('stories')

    // TODO: fix initial state in adapter
    if (root === undefined) {
      return []
    }

    const filteredStories = type
      ? root.filter(story => story.type === type)
      : root

    const stories = filteredStories
      .slice(
        filteredStories.length - (+page * NUMBER_OF_ITEMS_PER_PAGE + 1),
        filteredStories.length - (+page - 1) * NUMBER_OF_ITEMS_PER_PAGE
      )
      .reverse()

    return withUserNames(stories, read)
  },
  story: async (read, { id }) => {
    const root = await read('stories')

    // TODO: fix initial state in adapter
    if (root === undefined) {
      return null
    }

    const story = root.find(s => s.id === id)

    if (!story) {
      return null
    }

    return (await withUserNames([story], read))[0]
  },
  comment: async (read, { id }) => {
    const root = await read('comments')

    // TODO: fix initial state in adapter
    if (root === undefined) {
      return null
    }

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
  comments: async (read, { page }) => {
    const root = await read('comments')

    // TODO: fix initial state in adapter
    if (root === undefined) {
      return []
    }

    const comments = root.slice(
      +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
      +page * NUMBER_OF_ITEMS_PER_PAGE + 1
    )
    return withUserNames(comments, read)
  },
  user: async (read, { id, name }) => {
    const root = await read('users')

    // TODO: fix initial state in adapter
    if (root === undefined) {
      return undefined
    }

    return id
      ? root.find(user => user.id === id)
      : root.find(user => user.name === name)
  }
}
