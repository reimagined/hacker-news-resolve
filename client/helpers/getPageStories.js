export const STORIES_ON_ONE_PAGE = 30;

export const hasNextStories = (stories, page = 1) => {
  return Math.ceil(stories.length / STORIES_ON_ONE_PAGE) > page;
};

export const getPageStories = (stories, page = 1) => {
  const start = STORIES_ON_ONE_PAGE * (page - 1);
  const end = STORIES_ON_ONE_PAGE * page;

  return stories.slice(start, end);
};
