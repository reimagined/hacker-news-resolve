import Immutable from 'seamless-immutable'

export default (
  state = Immutable({
    refetchStories: false,
    refetchStory: false,
    storyCreation: false,
    createdStoryId: null,
    storyCreationError: null
  }),
  action
) => {
  switch (action.type) {
    case '@@resolve/SEND_COMMAND': {
      switch (action.command.type) {
        case 'createStory': {
          return action.command.error
            ? state.merge({
                storyCreation: false,
                storyCreationError: action.command.error
              })
            : state.merge({
                storyCreation: true,
                refetchStories: true
              })
        }
        default: {
          return state
        }
      }
    }
    case 'StoryCreated': {
      return state.merge({
        storyCreation: false,
        createdStoryId: action.aggregateId,
        storyCreationError: null
      })
    }
    case 'CommentCreated': {
      return state.set('refetchStory', true)
    }
    case 'SUBMIT_VIEW_SHOWN': {
      return state.merge({
        storyCreation: false,
        createdStoryId: null,
        storyCreationError: null
      })
    }
    case 'STORIES_REFETCHED': {
      return state.set('refetchStories', false)
    }
    case 'STORY_REFETCHED': {
      return state.set('refetchStory', false)
    }
    case 'STORY_VOTED': {
      return state.set('refetchStory', true)
    }
    default: {
      return state
    }
  }
}
