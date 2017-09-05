export default (state, command) => {
  if (state.createdBy !== command.payload.userId) {
    throw new Error("Permission denied");
  }
};
