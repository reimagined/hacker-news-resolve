import Immutable from 'seamless-immutable'

export default (
  state = Immutable({
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
            : state.set('storyCreation', true)
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
    case 'SUBMIT_VIEW_SHOWN': {
      return state.merge({
        storyCreation: false,
        createdStoryId: null,
        storyCreationError: null
      })
    }
    default: {
      return state
    }
  }
}
