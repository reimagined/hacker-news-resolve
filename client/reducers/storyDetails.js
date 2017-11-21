import { createReducer } from 'resolve-redux'
import viewModel from '../../common/view-models/storyDetails'

export default createReducer({
  name: 'storyDetails',
  projection: viewModel.projection
})
