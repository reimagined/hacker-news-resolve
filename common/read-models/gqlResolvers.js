import withUserNames from '../helpers/withUserNames'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'

const findCommentsById = (comments, id) => {
  const parent = comments.find(comment => comment.id === id)
  const result = []
  if (parent) {
    result.push(parent)
    comments.forEach(comment => {
      if (comment.parentId === parent.id) {
        result.push(...findCommentsById(comments, comment.id))
      }
    })
  }
  return result
}

function hasQueryField(query, field) {
  return (
    query.fieldNodes[0].selectionSet.selections.findIndex(
      selection => selection.name.value === field
    ) >= 0
  )
}

async function getCommentsTree(read, { parentId }) {
  const root = (await read()).get('comments')

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
    const root = (await read()).get('stories')
    const stories = (type
      ? root.filter(story => story.type === type)
      : root).slice(
      +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
      +page * NUMBER_OF_ITEMS_PER_PAGE + 1
    )
    return withUserNames(stories, read)
  },
  story: async (read, { id }, _, query) => {
    const stories = (await read()).get('stories')
    const story = stories.find(s => s.id === id)

    if (!story) {
      return null
    }

    if (hasQueryField(query, 'comments')) {
      const comments = (await read()).get('comments')

      const storyComments = comments.filter(
        ({ storyId }) => storyId === story.id
      )

      const storyWithComments = {
        ...story,
        comments: await withUserNames(storyComments, read)
      }

      return (await withUserNames([storyWithComments], read))[0]
    }

    return (await withUserNames([story], read))[0]
  },
  comment: async (read, { id }) => {
    const root = (await read()).get('comments')
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
    const root = (await read()).get('comments')
    const comments = root.slice(
      +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
      +page * NUMBER_OF_ITEMS_PER_PAGE + 1
    )
    return withUserNames(comments, read)
  },
  user: async (read, { id }) => {
    const root = (await read()).get('users')
    return root.find(user => user.id === id)
  }
}
