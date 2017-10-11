export default {
  checkAggregateIsExists(state) {
    if (!state.createdAt || state.removedAt) {
      throw new Error('Aggregate is not exist')
    }
  },
  checkAggregateIsNotExists(state) {
    if (state.createdAt) {
      throw new Error('Aggregate already exists')
    }
  }
}
