import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import comments from './comments';
import stories from './stories';
import ui from './ui';

export default combineReducers({
  user,
  users,
  comments,
  stories,
  ui
});
