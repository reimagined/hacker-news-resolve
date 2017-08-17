const STORIES_ON_ONE_PAGE = 30;

export const hasNextItems = (stories, page = 1) => {
  return Math.ceil(stories.length / STORIES_ON_ONE_PAGE) > page;
};

export const getPageItems = (items, page = 1) => {
  const start = STORIES_ON_ONE_PAGE * (page - 1);
  const end = STORIES_ON_ONE_PAGE * page;

  return items.slice(start, end);
};
