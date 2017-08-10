export default state => {
  if (!state.createdAt || state.removedAt) {
    throw new Error('Aggregate is not exist');
  }
};
