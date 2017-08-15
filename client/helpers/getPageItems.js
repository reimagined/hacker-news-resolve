export const ITEMS_ON_ONE_PAGE = 30;

export function hasNextItems(items, page = 1) {
  return Math.ceil(items.length / ITEMS_ON_ONE_PAGE) > page;
}

export function getPageItems(items, page = 1) {
  const start = ITEMS_ON_ONE_PAGE * (page - 1);
  const end = ITEMS_ON_ONE_PAGE * page;

  return items.slice(start, end);
}
