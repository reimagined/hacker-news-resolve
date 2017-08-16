const getCommentsCount = (comments, replies) => {
  let currentCount = 0;
  replies.forEach(id => {
    currentCount++;
    currentCount += getCommentsCount(comments, comments[id].replies);
  });
  return currentCount;
};

export default getCommentsCount;
