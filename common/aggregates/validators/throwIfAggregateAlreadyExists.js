export default state => {
  if (state.createdAt) {
    throw new Error('Aggregate already exists');
  }
};
