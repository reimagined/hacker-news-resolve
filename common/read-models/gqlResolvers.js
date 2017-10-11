import withUserNames from '../helpers/withUserNames'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'

function hasQueryField(query, field) {
  return (
    query.fieldNodes[0].selectionSet.selections.findIndex(
      selection => selection.name.value === field
    ) >= 0
  )
}

async function getCommentsTree(read, { parentId }) {
  const root = await read('comments')

  return Promise.all(
    root
      .filter(comment => comment.parentId === parentId)
      .map(async comment => ({
        ...comment,
        replies: await getCommentsTree(read, { parentId: comment.id })
      }))
  )
}

export default {
  stories: async (read, { page, type }) => {
    const root = await read('stories')

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
  story: async (read, { id }, _, query) => {
    const stories = await read('stories')
    const story = stories.find(s => s.id === id)

    if (!story) {
      return null
    }

    if (hasQueryField(query, 'comments')) {
      const comments = await read('comments')

      const storyComments = comments
        .filter(({ storyId }) => storyId === story.id)
        .reverse()

      const storyWithComments = {
        ...story,
        comments: await withUserNames(storyComments, read)
      }

      return (await withUserNames([storyWithComments], read))[0]
    }

    return (await withUserNames([story], read))[0]
  },
  comment: async (read, { id }) => {
    const root = await read('comments')
    const comment = root.find(c => c.id === id)

    if (!comment) {
      return null
    }

    const [resultComment] = await withUserNames([comment], read)

    return {
      ...resultComment,
      replies: await getCommentsTree(read, { parentId: comment.id })
    }
  },
  comments: async (read, { page }) => {
    const root = await read('comments')
    const comments = root
      .slice(
        root.length - (+page * NUMBER_OF_ITEMS_PER_PAGE + 1),
        root.length - (+page - 1) * NUMBER_OF_ITEMS_PER_PAGE
      )
      .reverse()

    return withUserNames(comments, read)
  },
  user: async (read, { id, name }) => {
    const root = await read('users')

    return id
      ? root.find(user => user.id === id)
      : root.find(user => user.name === name)
  }
}
