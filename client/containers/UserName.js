import React from 'react'
import { connect } from 'react-redux'
import { withViewModel } from 'resolve-redux'

import viewModel from '../../common/view-models/userName'

export const UserName = props => (props.name ? <span>{props.name}</span> : null)

export const mapStateToProps = (state, props) => ({
  name: state.viewModels[viewModel.name][props.id],
  viewModel: viewModel.name,
  aggregateId: props.id
})

export default connect(mapStateToProps)(withViewModel(UserName))
