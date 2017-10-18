import Immutable from 'seamless-immutable'

const shouldBeUpdated = (state, action) => {
  const index = state.updateList.indexOf(action.aggregateId)
  return index >= 0 && state.userId === action.payload.userId ? index : -1
}

export default (
  state = Immutable({
    refetchStories: false,
    refetchStory: false,
    storyCreation: false,
    createdStoryId: null,
    storyCreationError: null,
    updateList: [],
    userId: null
  }),
  action
) => {
  switch (action.type) {
    case '@@resolve/SEND_COMMAND': {
      let newState = state
      if (!state.userId) {
        newState = state.set('userId', action.payload.userId)
      }

      switch (action.command.type) {
        case 'createStory': {
          if (action.command.error) {
            return newState.merge({
              storyCreation: false,
              storyCreationError: action.command.error
            })
          }

          return newState
            .merge({
              storyCreation: true
            })
            .update('updateList', items => items.concat(action.aggregateId))
        }
        case 'createComment':
        case 'unvoteStory':
        case 'upvoteStory': {
          return newState.update('updateList', items =>
            items.concat(action.aggregateId)
          )
        }
        default: {
          return newState
        }
      }
    }
    case 'StoryCreated': {
      const index = shouldBeUpdated(state, action)
      if (index >= 0) {
        return state
          .update('updateList', items => items.filter((_, i) => i !== index))
          .merge({
            storyCreation: false,
            createdStoryId: action.aggregateId,
            storyCreationError: null,
            refetchStories: {
              newest: true,
              show: true,
              ask: true
            }
          })
      }

      return state
    }
    case 'StoryUpvoted':
    case 'StoryUnvoted':
    case 'CommentCreated': {
      const index = shouldBeUpdated(state, action)
      if (index >= 0) {
        return state
          .update('updateList', items => items.filter((_, i) => i !== index))
          .set('refetchStory', true)
      }
      return state
    }
    case 'SUBMIT_VIEW_SHOWN': {
      return state.merge({
        storyCreation: false,
        createdStoryId: null,
        storyCreationError: null
      })
    }
    case 'STORIES_REFETCHED': {
      return state.setIn(['refetchStories', action.page], false)
    }
    case 'STORY_REFETCHED': {
      return state.set('refetchStory', false)
    }
    default: {
      return state
    }
  }
}
