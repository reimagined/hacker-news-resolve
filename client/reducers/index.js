import { combineReducers } from 'redux';
import users from './users';
import comments from './comments';

export default combineReducers({
    users,
    comments
});
