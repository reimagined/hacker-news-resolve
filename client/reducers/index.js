import { combineReducers } from 'redux'
import user from './user'
import ui from './ui'
import storyDetails from './storyDetails'

export default combineReducers({
  user,
  ui,
  storyDetails
})
