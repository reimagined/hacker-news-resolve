import { combineReducers } from 'redux'
import user from './user'
import users from './users'
import comments from './comments'
import storyDetails from './storyDetails'
import stories from './stories'
import ui from './ui'

export default combineReducers({
  user,
  users,
  comments,
  storyDetails,
  stories,
  ui
})
