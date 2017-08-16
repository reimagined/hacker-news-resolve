export const ITEMS_ON_ONE_PAGE = 30;

export const hasNextItems = (items, page = 1) => {
  return Math.ceil(items.length / ITEMS_ON_ONE_PAGE) > page;
};

export const getPageItems = (items, page = 1) => {
  const start = ITEMS_ON_ONE_PAGE * (page - 1);
  const end = ITEMS_ON_ONE_PAGE * page;

  return items.slice(start, end);
};
