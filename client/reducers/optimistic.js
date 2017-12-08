import {
  OPTIMISTIC_STORY_UPVOTED,
  OPTIMISTIC_STORY_UNVOTED
} from '../actions/actionTypes'

export const initialState = { votedStories: {} }

export default (state = initialState, action) => {
  switch (action.type) {
    case OPTIMISTIC_STORY_UPVOTED: {
      return {
        ...state,
        votedStories: {
          ...state.votedStories,
          [action.storyId]: true
        }
      }
    }
    case OPTIMISTIC_STORY_UNVOTED: {
      return {
        ...state,
        votedStories: {
          ...state.votedStories,
          [action.storyId]: false
        }
      }
    }
    default:
      return state
  }
}
