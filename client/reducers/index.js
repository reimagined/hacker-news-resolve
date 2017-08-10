import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import comments from './comments';
import news from './news';

export default combineReducers({
  user,
  users,
  comments,
  news
});
