import { combineReducers } from 'redux'
import { createViewModelsReducer } from 'resolve-redux'

export default combineReducers({
  viewModels: createViewModelsReducer()
})
