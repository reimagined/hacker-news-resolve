import comments from './comments';
import news from './news';
import users from './users';

export default {
  ...comments,
  ...news,
  ...users
};
