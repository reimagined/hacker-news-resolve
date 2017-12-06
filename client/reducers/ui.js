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
    replyCreation: false,
    createdStoryId: null,
    storyCreationError: null,
    updateList: [],
    userId: null,
    lastVotedStory: {},
    lastCreatedStory: {},
    lastCommentedStory: {}
  }),
  action
) => {
  switch (action.type) {
    case '@@resolve/SEND_COMMAND': {
      let newState = state

      switch (action.command.type) {
        case 'createStory': {
          if (action.command.error) {
            return newState.merge({
              storyCreation: false,
              storyCreationError: action.command.error
            })
          }

          return newState.merge({
            storyCreation: true
          })
        }
        case 'commentStory': {
          return newState.merge({
            replyCreation: true
          })
        }
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
      return state.set('lastCreatedStory', {
        ...action.payload,
        id: action.aggregateId
      })
    }
    case 'StoryUpvoted':
    case 'StoryUnvoted': {
      return state.set('lastVotedStory', {
        ...action.payload,
        id: action.aggregateId
      })
    }
    case 'StoryCommented': {
      return state.set('lastCommentedStory', {
        ...action.payload,
        id: action.aggregateId
      })
    }
    case 'SUBMIT_VIEW_SHOWN': {
      return state.merge({
        storyCreation: false,
        createdStoryId: null,
        storyCreationError: null
      })
    }
    case 'REPLY_VIEW_SHOWN': {
      return state.merge({
        replyCreation: false
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
