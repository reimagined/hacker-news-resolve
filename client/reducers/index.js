import { combineReducers } from 'redux'
import { createViewModelsReducer } from 'resolve-redux'
import user from './user'
import ui from './ui'

export default combineReducers({
  user,
  ui,
  viewModels: createViewModelsReducer()
})
